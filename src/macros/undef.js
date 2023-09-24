/*
 * @Author: bulgarus@inbox.ru
 * @Date: 2023-09-20
 */

const { omit } = require("lodash");

module.exports = {
    token: "undef",
    order: -1,  // positive orders call after the line processing, negative before
    action: (context, row) => {
        const ctx = context;
        const data = row.split(" ", 1);
        ctx.variables = omit(ctx.variables, `\\b${data[0]}\\b`);
        return ctx;
    },
};
