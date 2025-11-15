const fetch = require("node-fetch");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = "XDaveCode/Powerlink";
  const FILE_PATH = "data/items.json";

  const data = JSON.parse(event.body);

  // 1. Fetch current items.json
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

  const existing = await fetch(apiUrl, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  }).then(res => res.json());

  let list = [];
  if (existing.content) {
    list = JSON.parse(Buffer.from(existing.content, "base64").toString());
  }

  // 2. Append new entry
  list.push({
    title: data.title,
    original: data.original,
    thumb: data.thumb,
    file: data.file,
    uploaded: Date.now()
  });

  const updatedContent = Buffer.from(JSON.stringify(list, null, 2)).toString("base64");

  // 3. Commit back to GitHub
  await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Updated items.json via Netlify Function",
      content: updatedContent,
      sha: existing.sha
    })
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, items: list })
  };
};