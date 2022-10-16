let nfcInfo = "";

import Cors from 'cors'

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
    methods: ['POST', 'GET', 'HEAD', 'DELETE'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
    req: any,
    res: any,
    fn: Function
) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}

export default async function handler(req : any, res : any) {
    await runMiddleware(req, res, cors)
    if(req.body === "undefined" || !req.body || req.method === "GET") return res.status(200).json(JSON.stringify(nfcInfo));
    nfcInfo = req.body;
    res.status(200).json(JSON.stringify(nfcInfo))
}