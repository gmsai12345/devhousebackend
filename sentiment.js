const { NLClient } = require("@expertai/nlapi");
const { Language } = require("@expertai/nlapi");
const { Analysis } = require("@expertai/nlapi");
require('dotenv').config();


var nlClient = new NLClient();

var text = "i am dumb";

nlClient.analyze(text, {
  language: Language.EN,
  context: "standard",
  analysis: Analysis.Sentiment
}).then((result) => {
    console.log("Overall sentiment:");
    console.log(result.data.sentiment.overall);
})