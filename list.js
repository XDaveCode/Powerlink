const fetch = require("node-fetch");

exports.handler = async () => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = "XDaveCode/Powerlink";
  const FILE_PATH = "data/items.json";

  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

  const existing = await fetch(apiUrl, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  }).then(res => res.json());

  let list = [];
  if (existing.content) {
    list = JSON.parse(Buffer.from(existing.content, "base64").toString());
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(list)
  };
};