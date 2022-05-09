const logger = require("../configs/logs/logger");

module.exports = function (err) {
  logger.error(err);
  return { message: err.message, statusCode: 400 };
};
