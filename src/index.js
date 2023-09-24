/*
 * @Author: bulgarus@inbox.ru
 * @Date: 2023-09-20
 */
const assert = require("assert");
const macros = require("./macros");

const defaultConfig = {
    processEnv: true,
    macroPrefix: "#",
    singleLineComment: /^\s*\/\//,
    multiLineComment: {
        start: /^\s*\/\*+/,
        row: /^\s*\*+/,
        end: /\s*\*+\/\s*$/,
    },
    trimSingleLine: true,
};

module.exports = class Macro {
    context = { variables: {}, stack: [] };
    config = {};
    macros = [];
    preliminary = [];
    constructor(newConfig) {
        this.macros = macros.sort((a, b) => b.order - a.order);
        this.config.processEnv =
            newConfig && newConfig.processEnv !== undefined
                ? !!newConfig.processEnv
                : defaultConfig.processEnv;
        this.config.macroPrefix =
            (newConfig && newConfig.macroPrefix) || defaultConfig.macroPrefix;
        // this.config.stringQuotes = newConfig.stringQuotes || defaultConfig.stringQuotes;
        this.config.singleLineComment =
            (newConfig && newConfig.singleLineComment) ||
            defaultConfig.singleLineComment;
        this.config.multiLineComment =
            (newConfig && newConfig.multiLineComment) ||
            defaultConfig.multiLineComment;
        // this.config.singleLine = newConfig.singleLine || defaultConfig.singleLine;
        this.config.trimSingleLine =
            newConfig && newConfig.trimSingleLine !== undefined
                ? !!newConfig.trimSingleLine
                : defaultConfig.trimSingleLine;
        if (this.config.processEnv) {
            const envKeys = Object.keys(process.env);
            envKeys.forEach((key) => {
                this.context.variables[`\\b${key}\\b`] = (row) =>
                    row.replaceAll(
                        new RegExp(`\\b${key}\\b`, "g"),
                        process.env[key]
                    );
            });
        }
    }

    parse(text) {
        const lines = text.split("\n");
        const parsed = [];
        const errors = [];
        let isCommented = false;
        let multiLine = "";
        lines.forEach((line) => {
            const origin = line;
            line = line.trimLeft();
            if (
                line.length == 0 &&
                this.context.stack.length > 0 &&
                this.context.stack[this.context.stack.length - 1]
            ) {
                parsed.push(origin);
                return;
            }
            // process multiline comments
            // if we are in the comment, remove comment prefix, if exists
            if (isCommented) {
                const [before, after] = line.split(
                    this.config.multiLineComment.row
                );
                line = before.trimLeft() + (after !== undefined ? after : "");
            }
            // if the comment is started, set the mark
            if (line.search(this.config.multiLineComment.start) > -1) {
                const [, tail] = line.split(this.config.multiLineComment.start);
                isCommented = true;
                line = tail;
            }
            // if the comment is finished, clear the mark
            if (line.search(this.config.multiLineComment.start) > -1) {
                const [head] = line.split(this.config.multiLineComment.end);
                isCommented = false;
                line = head;
            }
            // process single line comment
            if (line.search(this.config.singleLineComment) > -1) {
                const [, tail] = line.split(this.config.singleLineComment);
                line = tail;
            }
            // if the previous line have backslash at the end and we are in processing mode, treat it as a whole sentence
            if (multiLine.length > 0) {
                line = multiLine + "\n" + line;
                multiLine = "";
            }
            // if the line starts from the prefix and have backslash at the end => set it to multiline and return
            if (
                line.search(this.config.macroPrefix) == 0 &&
                line.search(/\\$/) > -1
            ) {
                [multiline] = line.split(/\\$/);
                return;
            }
            // if the line starts from the prefix we need to test the macros with order < 0
            if (line.search(this.config.macroPrefix) == 0) {
                try {
                    const trimmed = line.substr(this.config.macroPrefix.length);
                    const newLine = this.parseMacros(trimmed, -99, -1);
                    if (newLine !== trimmed) line = newLine;
                } catch (e) {
                    errors.push(e);
                    parsed.push(origin);
                    return;
                }
            }
            // else return the line to the original view if it is not a multiline macro
            else if (multiLine.length == 0) {
                line = origin;
            }
            // process the line before searching for macros
            try {
                line = this.processLine(line);
            } catch (e) {
                errors.push(e);
                parsed.push(origin);
                return;
            }

            // if the line starts from the prefix
            if (line.search(this.config.macroPrefix) == 0) {
                try {
                    line = this.parseMacros(
                        line.substr(this.config.macroPrefix.length),
                        1,
                        99
                    );
                } catch (e) {
                    errors.push(e);
                    parsed.push(origin);
                    return;
                }
            }
            // if stack has display:false  on it's head after all parses -> skip the line
            if (
                this.context.stack.length > 0 &&
                !this.context.stack[this.context.stack.length - 1].display
            )
                return;
            // do not push empty line if it defined in config
            if (this.config.trimSingleLine && line.length == 0) return;
            parsed.push(line);
        });
        const ret = { content: parsed.join("\n") };
        if (errors.length > 0) ret.error = errors.join("\n");
        return ret;
    }

    processLine(line) {
        const keys = Object.keys(this.context.variables);
        keys.forEach((variable) => {
            while (line.search(new RegExp(variable)) > -1) {
                line = this.context.variables[variable](line);
            }
        });
        return line;
    }

    parseMacros(line, fromCount, toCount) {
        const variables = this.context.variables;
        const reduced = this.macros.filter(
            ({ order }) => order >= fromCount && order <= toCount
        );
        const macro = reduced.find(
            ({ token }) => line.search(new RegExp(`^${token}\\b`)) == 0
        );
        if (!macro) return line;
        const [, row] = line.split(new RegExp(`^${macro.token}\\s`));
        const ctx = macro.action(this.context, row);
        assert(
            ctx !== undefined,
            `#${macro.token} not returns context in "${row}"`
        ); 
        // if we have filled stack, we can change the variables only if display:true on the top of the stack
        if (
            ctx.stack.length > 0 &&
            !ctx.stack[this.context.stack.length - 1].display
        ) {
            this.context = { variables, stack: ctx.stack };
            return line;
        }
        this.context = ctx;
        return "";
    }
};
