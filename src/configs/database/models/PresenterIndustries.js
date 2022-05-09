const mongoose = require("mongoose");
const { PresenterIndustriesSchema } = require("db-schema");

const PresenterIndustries = mongoose.model(
  "PresenterIndustries",
  PresenterIndustriesSchema
);

module.exports = PresenterIndustries;
