const mongoose = require("mongoose");
const { UserCurriculumSchema } = require("db-schema");

const UserCurriculum = mongoose.model("UserCurriculums", UserCurriculumSchema);

module.exports = UserCurriculum;
