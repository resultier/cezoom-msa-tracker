const mongoose = require("mongoose");
const { CompanyDocumentsSchema } = require("db-schema");

const CompanyDocuments = mongoose.model(
  "CompanyDocuments",
  CompanyDocumentsSchema
);

module.exports = CompanyDocuments;
