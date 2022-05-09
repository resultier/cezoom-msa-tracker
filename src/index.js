// Config .env
require("dotenv").config();

const createServer = require("./configs/app/index");
const { connect } = require("./configs/database/db");
const { PORT } = require("./utils/constants");

const startApp = () => {
  const app = createServer();

  app.listen(PORT || 3000, () => {
    console.log("CEZOOM - Assets CDN API");
  });
};

connect().then((con) => {
  startApp();
});
