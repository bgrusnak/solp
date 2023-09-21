/*
 * @Author: bgrusnak@inbox.com
 * @Date: 2023-09-20
 */

module.exports = {
    token: "undef",
    preliminary: true,
    action: (context, row) => {
        const data = row.split(" ", 1);
        delete context.variables[data[0]];
        return context;
    },
};
