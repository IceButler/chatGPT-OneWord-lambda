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

  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      temperature: 0,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.choices) answer = data.choices[0].message.content;
      else answer = null;

      if (answer != null) answers = answer.split("**");
      callback(null, { words: answers });
    }
    );
};