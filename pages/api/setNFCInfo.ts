let nfcInfo = "";

export default function handler(req : any, res : any) {
    if(req.body === "undefined" || !req.body) return res.status(200).json(nfcInfo);
    nfcInfo = req.body;
    res.status(200).json(nfcInfo)
}