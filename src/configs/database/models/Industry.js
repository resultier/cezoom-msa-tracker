const mongoose = require("mongoose");
const { IndustrySchema } = require("db-schema");

const Industry = mongoose.model("industry", IndustrySchema);

module.exports = Industry;
