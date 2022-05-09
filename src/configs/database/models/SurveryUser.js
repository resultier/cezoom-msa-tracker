const mongoose = require("mongoose");
//const { SurveyUserSchema } = require("db-schema");

//const SurveyUser = mongoose.model("SurveyUser", SurveyUserSchema);

const QuestionSchema = new mongoose.Schema({
    id: String,
    answer: Object
});

const SurveyUser = new mongoose.Schema({
    id: String,
    user_id: String,
    survey_id: String,
    questions: [QuestionSchema]
});

module.exports = SurveyUser;
