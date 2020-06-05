const axios = require('axios');

const taxonomyAPI = 'https://api.impactgenome.com/taxonomy/';

const headers = {
  Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
};

const get = async (api, route, params) => {
  let url = taxonomyAPI;
  const r = await axios.get(url + route, {
    params: params,
    headers: headers,
  });
  return r.data;
};

module.exports = {
  get: get,
};
