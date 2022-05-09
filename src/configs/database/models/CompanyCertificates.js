const mongoose = require("mongoose");
const { CompanyCertificatesSchema } = require("db-schema");

const CompanyCertificate = mongoose.model(
  "CompanyCertificates",
  CompanyCertificatesSchema
);

module.exports = CompanyCertificate;
