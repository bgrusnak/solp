/*
 * @Author: bulgarus@inbox.ru
 * @Date: 2023-09-24
 */

module.exports = {
    token: "endif",
    order: 2,  // positive orders call after the line processing, negative before
    action: (context, row) => {
        if (context.stack.length > 0) context.stack.pop();
        return context;
    },
};
