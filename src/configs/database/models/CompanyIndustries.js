const mongoose = require("mongoose");
const { CompanyIndustriesSchema } = require("db-schema");

const CompanyIndustries = mongoose.model(
  "CompanyIndustries",
  CompanyIndustriesSchema
);

module.exports = CompanyIndustries;
