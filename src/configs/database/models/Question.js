const mongoose = require("mongoose");
const { QuestionSchema } = require("db-schema");

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;
