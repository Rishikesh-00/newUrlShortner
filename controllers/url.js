const shortid=require("shortid");
const URL=require("../models/url")
async function handleGenerateNewShortUrl(req,res) {
    console.log("hello")
    const body=req.body;
    if(!body.url) return res.status(400).json({error:"url is reqired!"})
    const shortID=shortid();
    await URL.create({
        shortId:shortID,
        redirectURL:body.url,
        visitedHistory:[],
    });
    return res.json({id:shortID})
}

async function handleGetAnalytics(req,res) {
    const shortId=req.params.shortId;
    const result=await URL.findOne({shortId});
    // return res.json({totalClicks:result.visitHistory.length,analytics:visitHistory})
    return res.json({totolClicks:result.visitHistory.length,analytics:result.visitHistory})
}

module.exports={
    handleGenerateNewShortUrl,handleGetAnalytics
};