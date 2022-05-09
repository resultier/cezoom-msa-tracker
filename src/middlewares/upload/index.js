const { verifyToken } = require("../../utils/utils");

module.exports = function (req, res, next) {
  req.user = verifyToken(req.headers.authorization);
  next();
};
