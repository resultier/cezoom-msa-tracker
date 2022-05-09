const mongoose = require("mongoose");
const { UserCertificatesSchema } = require("db-schema");

const UserCertificates = mongoose.model("UserCertificates",UserCertificatesSchema);

module.exports = UserCertificates;
