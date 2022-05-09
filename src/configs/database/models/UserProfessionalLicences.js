const mongoose = require("mongoose");
const { UserProfessionalLicencesSchema } = require("db-schema");

const UserProfessionalLicences = mongoose.model("UserProfessionalLicences", UserProfessionalLicencesSchema);

module.exports = UserProfessionalLicences;
