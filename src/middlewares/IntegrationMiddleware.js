const { verifyIntegrationToken } = require("../utils/utils");

module.exports = async function (resolve, root, args, context, info) {
  const token = context.req.headers.authorization;
  verifyIntegrationToken(token);
  context.token = token;
  const result = await resolve(root, args, context, info);
  return result;
};
