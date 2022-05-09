const mongoose = require("mongoose");
const { EmployeeCountriesSchema } = require("db-schema");

const EmployeeCountries = mongoose.model(
  "EmployeeCountries",
  EmployeeCountriesSchema
);

module.exports = EmployeeCountries;
