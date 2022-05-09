const mongoose = require("mongoose");
const { UserTestSchema } = require("db-schema");

/*const UserTestSchema = new mongoose.Schema(
  {
    user_id: String,
    test_id: String,
    progress: Number,
    grade: Number,
    approved: Boolean
  },
  {
    collection: "user_tests",
  }
);*/

const UserSurvey = mongoose.model("UserTest", UserTestSchema);

module.exports = UserSurvey;
