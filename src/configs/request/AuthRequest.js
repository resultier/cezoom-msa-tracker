const { default: axios } = require("axios");

const AuthInstance = axios.create({
  baseURL: process.env.AUTH_URL,
});

module.exports = AuthInstance;
