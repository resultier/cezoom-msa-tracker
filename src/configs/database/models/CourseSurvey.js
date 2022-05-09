const mongoose = require("mongoose");
const { CourseSurveysSchema } = require("db-schema");

const CourseSurvey = mongoose.model("CourseSurvey", CourseSurveysSchema);

module.exports = CourseSurvey;
