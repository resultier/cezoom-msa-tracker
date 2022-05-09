const mongoose = require("mongoose");
const { DeaLicenseSchema } = require("db-schema");

const DeaLicense = mongoose.model("DeaLicense", DeaLicenseSchema);

module.exports = DeaLicense;
