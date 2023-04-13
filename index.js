const dotenv = require("dotenv");
dotenv.config();
const OpenAI = require("openai");
const { Configuration, OpenAIApi } = OpenAI;
const bodyParser = require("body-parser");

const configuration = new Configuration({
  organization: process.env.ORGANIZATION,
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());

export const handler = async (event, context, callback) => {
  const { keyword } = event;
  const message = `'${keyword}'에서 대표 단어 한어절`;
  let oneword = "";
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: message,
    max_tokens: 4000,
    temperature: 0,
  });
  if (response.data) {
    if (response.data.choices) oneword = response.data.choices[0].text;
    else oneword = "none";
  }

  callback(null, { oneword: oneword });
};

function getOneWord(text) {
  if (text) {
    let startIndex = text.indexOf('"');
    let lastIndex = text.lastIndexOf('"');
    return text.substring(startIndex + 1, lastIndex);
  }
}
