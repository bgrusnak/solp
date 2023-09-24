/*
 * @Author: bulgarus@inbox.ru
 * @Date: 2023-09-24
 */

module.exports = {
    token: "if",
    order: 2, // positive orders call after the line processing, negative before
    action: (context, row) => {
        const data = row.trim();
        const result = !!eval(data); 
        if (context.stack.length>0 && !context.stack[context.stack.length-1].display) {
            context.stack.push({ passed: true, display: false }); 
            return context;
        }
        context.stack.push({ passed: result, display: result == true }); 
        return context;
    },
};
