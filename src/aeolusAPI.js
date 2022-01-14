const fetch = require("node-fetch");

const host = process.env.API_HOST || "https://aeolus.se/api/";

/**
 * @param path {string}
 * @param method {string}
 * @param jwt {string}
 * @param body {object?}
 * @returns {Promise<{data: any, statusCode: number}>}
 */
async function fetchData(path, method, jwt, body = undefined) {
  const url = host + path;
  let response;
  try {
    response = await fetch(url, {
      method,
      body: body ? "" : JSON.stringify(body),
      headers: { Authorization: `Bearer ${jwt}` },
    });
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }

  // Return data if body is JSON
  try {
    return {
      data: await response.json(),
      statusCode: response.statusCode,
    };
  } catch (error) {
    return {
      statusCode: response.statusCode,
    };
  }
}

module.exports = { fetchData };
