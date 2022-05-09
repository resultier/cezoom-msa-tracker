const mongoose = require("mongoose");
const { MembershipSchema } = require("db-schema");

const Membership = mongoose.model("Membership", MembershipSchema);

module.exports = Membership;
