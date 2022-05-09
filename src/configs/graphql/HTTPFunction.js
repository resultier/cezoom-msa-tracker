const schemaWithMiddleware = require(".");
const CustomError = require("../../middlewares/CustomError");
const { NODE_ENV } = require("../../utils/constants");

const SHOW_GRAPHI = NODE_ENV === "dev" || NODE_ENV === "test";

module.exports = function (req) {
  return {
    schema: schemaWithMiddleware,
    context: { req },
    graphiql: SHOW_GRAPHI,
    customFormatErrorFn: CustomError,
  };
};
