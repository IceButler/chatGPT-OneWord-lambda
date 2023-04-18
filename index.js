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
  const message = `'${keyword}' is food name. Pick keyword up to 3 at '${keyword}', except special character and number. And every word should be a food. You should tell me in Korean and follow this rule, "#word"(one word), "#word#word"(two words), "#word#word#word"(three words).`;
  let answer = "";
  let answers = [];
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: message,
    temperature: 0,
    max_tokens: 700,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  if (response.data.choices) {
    if (response.data.choices) answer = response.data.choices[0].text;
    else answer = null;
  }
  if (answer != null) {
    answers = answer.split("#");
    answers.shift();
  }

  callback(null, { words: answers });
};