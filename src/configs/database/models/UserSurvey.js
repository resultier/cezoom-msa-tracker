const mongoose = require("mongoose");
const { UserSurveySchema } = require("db-schema");

/*const UserSurveySchema = new mongoose.Schema(
  {
    user_id: String,
    survey_id: String,
    progress: Number
  },
  {
    collection: "user_surveys",
  }
);*/

const UserSurvey = mongoose.model("UserSurvey", UserSurveySchema);

module.exports = UserSurvey;
