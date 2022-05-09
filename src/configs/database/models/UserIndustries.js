const mongoose = require("mongoose");
const { UserIndustriesSchema } = require("db-schema");

const UserIndustries = mongoose.model("UserIndustry", UserIndustriesSchema);

module.exports = UserIndustries;
