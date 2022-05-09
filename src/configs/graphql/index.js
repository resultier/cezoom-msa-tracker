const { merged } = require("../../graphql/typeDef");
const resolvers = require("../../graphql/resolvers");
const { applyMiddleware } = require("graphql-middleware");
const middleware = require("../../middlewares");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const schema = makeExecutableSchema({
  typeDefs: merged,
  resolvers,
});

const schemaWithMiddleware = applyMiddleware(schema, middleware);

module.exports = schemaWithMiddleware;
