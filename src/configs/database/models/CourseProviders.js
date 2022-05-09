const mongoose = require("mongoose");
const { CourseProvidersSchema } = require("db-schema");

const CourseProviders = mongoose.model("CourseProviders", CourseProvidersSchema);

module.exports = CourseProviders;
