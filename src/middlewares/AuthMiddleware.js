const { verifyToken } = require("../utils/utils");

module.exports = async function (resolve, root, args, context, info) {
  const token = context.req.headers.authorization;
  refresh = context.req.headers.authorization;
  context.user = verifyToken(token);
  context.token = token;
  const result = await resolve(root, args, context, info);
  return result;
};
