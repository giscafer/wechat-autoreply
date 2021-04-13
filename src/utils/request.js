const https = require('https');
const axios = require('axios');

const axiosInstance = axios.create({
  timeout: 1000,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

module.exports = axiosInstance;
