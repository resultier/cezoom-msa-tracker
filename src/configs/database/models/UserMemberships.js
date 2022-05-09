const mongoose = require("mongoose");
const { UserMembershipsSchema } = require("db-schema");

const UserMemberships = mongoose.model("UserMembership", UserMembershipsSchema);

module.exports = UserMemberships;
