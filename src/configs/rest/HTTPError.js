const logger = require("../logs/logger");

module.exports = function (err, req, res, next) {
  logger.error(err.message);
  res.json(
    {
      success: false,
      error: err.message,
    },
    500
  );
};
