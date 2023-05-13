var fs = require('fs').promises

module.exports = async function (context, req) {
    if (req.method === "GET") {
        const path = context.executionContext.functionDirectory + '/../content/index.html'
        try {
            var data = await fs.readFile(path);
            context.res = {
                headers: {
                    'Content-Type': 'text/html'
                },
                body: data
            }
        } catch (err) {
            context.log.error(err);
            context.done(err);
        }
    } else if (req.method === "POST") {
        context.bindings.mySbMsg = req.body;
        context.res = {
            headers: {
                'Content-Type': 'text/html'
            },
            body: "ok"
        };
    }
}