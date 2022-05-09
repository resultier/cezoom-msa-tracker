const mongoose = require("mongoose");
const { QuestionAnswerSchema } = require("db-schema");

const QuestionAnswer = mongoose.model("QuestionAnswer", QuestionAnswerSchema);

module.exports = QuestionAnswer;
