require("dotenv").config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  USER_URL: process.env.USER_URL,
};
