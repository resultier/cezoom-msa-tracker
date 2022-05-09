const mongoose = require("mongoose");
const { UserSchema } = require("db-schema");
const { TestSchema } = require("db-schema");

const Test = mongoose.model("Test", TestSchema);

module.exports = Test;
