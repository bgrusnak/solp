/*
 * @Author: bulgarus@inbox.ru
 * @Date: 2023-09-24
 */

module.exports = {
    token: "else",
    order: 2, // positive orders call after the line processing, negative before
    action: (context, row) => {
        if (context.stack.length > 0) {
            const before = context.stack.pop();
            if (before.passed) {
                context.stack.push({ passed: true, display: false });
                return context;
            }
            context.stack.push({ passed: true, display: true });
        }
        return context;
    },
};
