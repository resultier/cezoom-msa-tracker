const mongoose = require("mongoose");
const { UserSchema } = require("db-schema");
const { SurveySchema } = require("db-schema");

const Survey = mongoose.model("Survey", SurveySchema);

module.exports = Survey;
