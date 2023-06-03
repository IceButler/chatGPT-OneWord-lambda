const dotenv = require("dotenv");
const OpenAI = require("openai");
const axios = require("axios");
dotenv.config();

const { Configuration, OpenAIApi } = OpenAI;

const configuration = new Configuration({
  organization: process.env.ORGANIZATION,
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event, context, callback) => {
  const { keyword } = event;
  const message = `Tell me in one word what kind of food '${keyword}' is and what the food name of '${keyword}' is. You should tell me in only Korean, Don't ever speak English and follow this rule, {word**word}`;
  let answer = "";
  let answers = [];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
    temperature: 0,
  });

  if (response.data) {
    if (response.data.choices) answer = response.data.choices[0].message.content;
    else answer = null;
  }

  if (answer != null) answers = answer.split("**");
  callback(null, { words: answers });
};