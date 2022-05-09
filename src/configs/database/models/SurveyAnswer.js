const mongoose = require("mongoose");
const { QuestionAnswerSchema } = require("db-schema");

//const SurveyUser = mongoose.model("SurveyUser", SurveyUserSchema);
/*
const AnswerSchema = new mongoose.Schema({
	key: String,
  	value: String
});

const QuestionAnswerSchema = new mongoose.Schema({
    id: String,
    user_id: String,
    question_id: String,
    answer: [AnswerSchema],
},{
	collection: "question_answer"
});
*/
const QuestionAnswer = mongoose.model("QuestionAnswer", QuestionAnswerSchema);

module.exports = QuestionAnswer;
