const mongoose = require("mongoose");
const { PresenterCountriesSchema } = require("db-schema");

const PresenterCountries = mongoose.model(
  "PresenterCountries",
  PresenterCountriesSchema
);

module.exports = PresenterCountries;
