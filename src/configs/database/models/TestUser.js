const mongoose = require("mongoose");
const { TestUserSchema } = require("db-schema");

const TestUser = mongoose.model("TestUser", TestUserSchema);

module.exports = TestUser;
