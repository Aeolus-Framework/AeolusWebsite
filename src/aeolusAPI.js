const fetch = require("node-fetch");

const host = process.env.API_HOST || "https://aeolus.se/api";
const methodTypeCanHaveBody = ["POST", "PUT", "PATCH"]

/**
 * @param path {string}
 * @param method {string}
 * @param jwt {string}
 * @param body {object?}
 * @returns {Promise<{data: any, statusCode: number}>}
 */
async function fetchData(path, method, jwt, body) {
  const url = host + path;
  const options = {};
  options.method = method;
  options.headers = { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" };
  if(body && methodTypeCanHaveBody.includes(method)){
    options.body = JSON.stringify(body);
  }
  
  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    console.log(error);
    return { statusCode: 500 };
  }

  // Return data if body is JSON
  try {
    return {
      data: await response.json(),
      statusCode: response.status,
    };
  } catch (error) {
    return {
      statusCode: response.status,
    };
  }
}

module.exports = { fetchData };
