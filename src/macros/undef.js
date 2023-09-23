/*
 * @Author: bgrusnak@inbox.com
 * @Date: 2023-09-20
 */

module.exports = {
    token: "undef",
    order: -1,  // positive orders call after the line processing, negative before
    action: (context, row) => {
        const data = row.split(" ", 1);
        delete context.variables[data[0]];
        return context;
    },
};
