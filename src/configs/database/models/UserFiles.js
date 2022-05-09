const mongoose = require("mongoose");
const { UserFileRepositorySchema } = require("db-schema");

const UserFiles = mongoose.model("UserFiles", UserFileRepositorySchema);

module.exports = UserFiles;
