const { default: axios } = require("axios");

const NotificationIntance = axios.create({
  baseURL: process.env.NOTIFICATION_URL,
});

module.exports = NotificationIntance;
