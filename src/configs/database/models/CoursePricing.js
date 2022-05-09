const mongoose = require("mongoose");
const { CoursesPricing } = require("db-schema");

const CoursePricing = mongoose.model("CoursePricing", CoursesPricing);

module.exports = CoursePricing;
