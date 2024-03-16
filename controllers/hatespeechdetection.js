const { NLClient } = require("@expertai/nlapi");
const { Language } = require("@expertai/nlapi");
const { Analysis } = require("@expertai/nlapi");
require('dotenv').config();


var nlClient = new NLClient();

// var text = "hail hitler";

// nlClient.analyze(text, {
//   language: Language.EN,
//   context: "standard",
//   analysis: Analysis.Sentiment
// }).then((result) => {
//     console.log("Overall sentiment:");
//     console.log(result.data.sentiment.overall);
// })
exports.hatespeechdetection=async(req,res)=>
{
    try
    {
    const {text}=req.body;
    nlClient.analyze(text, {
        language: Language.EN,
        context: "standard",
        analysis: Analysis.Sentiment
      }).then((result) => {
          if(result.data.sentiment.overall<0)
          {
            res.status(403).json("hate speech");
          }
          else
          {
            res.status(403).json("good speech");
          }
          console.log(result.data.sentiment.overall);
      })
    }
    catch(error)
    {
        res.status(500).json("error",error);
    }
}