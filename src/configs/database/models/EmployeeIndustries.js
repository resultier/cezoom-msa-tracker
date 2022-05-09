const mongoose = require("mongoose");
const { EmployeeIndustriesSchema } = require("db-schema");

const EmployeeIndustries = mongoose.model(
  "EmployeeIndustries",
  EmployeeIndustriesSchema
);

module.exports = EmployeeIndustries;
