const axios = require("axios");

async function httpGet(url, params = {}, headers = {}) {
  const response = await axios.get(url, { params, headers });
  return response.data;
}

module.exports = { httpGet };
