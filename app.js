require("dotenv").config();
const express = require("express");
const urlRoute = require("./routes/url");
const URL=require("./models/url")
const { connectToMongoDb } = require("./connectdb");

const app = express();
const PORT =  process.env.PORT;

connectToMongoDb(process.env.MONGO_URL)
.then(() => console.log('mongodb connected!'))
.catch(err => console.error('Failed to connect to MongoDB', err));

app.use(express.json())

app.use("/url", urlRoute);

// app.get("/:shortId",async(req,res)=>{
//     const shortId=req.params.shortId;
//     console.log(shortId);
//    const entry= await URL.findByIdAndUpdate({
//         shortId
//     },{$push:{
//         visitHistory:{
//             timestamp:Date.now(),
//         },
//     },},{new:true})
//     res.redirect(entry.redirectURL)
// })

app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    console.log(shortId);

    try {
        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            },
            { new: true } // This option returns the updated document
        );

        if (entry) {
            res.redirect(entry.redirectURL);
        } else {
            res.status(404).send('Short URL not found');
        }
    } catch (error) {
        console.error('Error while finding and updating URL:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
