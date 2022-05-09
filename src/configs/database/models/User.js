const mongoose = require("mongoose");
const { UserSchema } = require("db-schema");

const User = mongoose.model("User", UserSchema);

module.exports = User;
