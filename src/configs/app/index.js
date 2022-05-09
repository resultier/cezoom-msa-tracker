const compress = require("compression");
const helmet = require("helmet");
const express = require("express");
const bodyParser = require('body-parser');
const { NODE_ENV, ALLOW } = require("../../utils/constants");
const addAppConfigs = require("../app");

const createServer = () => {
  /**
   * Express instance
   * @public
   */
  const app = express();
  app.use(bodyParser.json({limit:'10mb'}));
  // parse body params and attache them to req.body
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // gzip compression
  app.use(compress());

  // secure apps by setting various HTTP headers
  // app.use(helmet());
  app.use(
    helmet({
      contentSecurityPolicy: NODE_ENV === "production" ? undefined : false,
    })
  );

  addAppConfigs(app);

  return app;
};

module.exports = createServer;
