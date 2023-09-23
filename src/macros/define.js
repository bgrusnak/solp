/*
 * @Author: bgrusnak@inbox.com
 * @Date: 2023-09-20
 */

function extractVars(line) {
    let quoted = "";
    const items = [];
    let nextItem = true;
    const escaped = false;
    const quotes = ['"', "'", "`"];
    let pos = 0;
    for (pos; pos < line.length; pos++) {
        const el = line[pos];
        // escape character found
        if (!!quoted && !escaped && el == "\\") {
            escaped = true;
            continue;
        }
        // pass any character if escaped
        if (!!quoted && escaped) {
            escaped = false;
            items[items.length - 1] += el;
            continue;
        }
        // skip whitespace
        if (!quoted && el.search(/\s/) > -1) continue;
        // found bracket and not quoted -> exit from cycle
        if (el == ")" && !quoted) break;
        // comma found -> next element
        if (!quoted && el == ",") {
            nextItem = true;
            continue;
        }
        // new item found
        if (nextItem) {
            // started from quote?
            if (quotes.includes(el)) {
                quoted = el;
            }
            // fill new item
            items.push(el);
            nextItem = false;
            continue;
        }
        // close quote
        if (!!quoted && quoted === el) {
            quoted = "";
        }
        // simple element, push it
        items[items.length - 1] += el;
    }
    return [pos + 1, items];
}

module.exports = {
    token: "define",
    order: 1, // positive orders call after the line processing, negative before
    action: (context, row) => {
        const [, name, params, content] = row.match(/(\w*) ?(\(.*\))? ?(.*)/);
        if (!params) {
            context.variables[name] = (row) => row.replace(name, content);
            return context;
        }
        var items = params.match(/(\w*)/g).filter((i) => i != "");
        context.variables[`${name}\s*\\((.*?)\\)`] = (row) => {
            const [pre] = row.match(name + "\\s*\\(");
            const start = row.search(name + "\\s*\\(");
            const [len, data] = extractVars(row.substr(start + pre.length));
            const before = row.substr(0, start);
            const after = row.substr(start + pre.length + len);
            const out = items.reduce(
                (current, item, pos) =>
                    current.replaceAll(
                        new RegExp(`\\b${item}\\b`, "g"),
                        data[pos]
                    ),
                content
            );
            return before + out + after;
        };
        return context;
    },
};
