const mongoose = require("mongoose");
const { UserDeaLicensesSchema } = require("db-schema");

const UserDeaLicenses = mongoose.model("UserDeaLicense", UserDeaLicensesSchema);

module.exports = UserDeaLicenses;
