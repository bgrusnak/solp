/*
 * @Author: bulgarus@inbox.ru
 * @Date: 2023-09-24
 */

module.exports = {
    token: "elseif",
    order: 2, // positive orders call after the line processing, negative before
    action: (context, row) => {
        const ctx = context;
        if (ctx.stack.length > 0) {
            const before = ctx.stack.pop();
            if (before.passed) {
                ctx.stack.push({ passed: true, display: false });
                return ctx;
            }
            const data = row.trim();
            const result = !!eval(data);
            ctx.stack.push({ passed: result, display: result == true });
        }
        return ctx;
    },
};
