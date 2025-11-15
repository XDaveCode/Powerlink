exports.handler = async (event) => {
  const file = event.queryStringParameters.url;
  if (!file) {
    return { statusCode: 400, body: "Missing file URL" };
  }

  return {
    statusCode: 302,
    headers: { Location: file },
    body: ""
  };
};