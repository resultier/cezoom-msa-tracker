const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../../src/utils/constants");

const genToken = (data = {}) => {
  return jwt.sign({ data }, JWT_SECRET);
};

export { genToken };
