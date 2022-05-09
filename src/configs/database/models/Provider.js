const mongoose = require("mongoose");
const { UserProviderSchema } = require("db-schema");

const UserProvider = mongoose.model("UserProvider", UserProviderSchema);

module.exports = UserProvider;
