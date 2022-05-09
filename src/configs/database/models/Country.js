const mongoose = require("mongoose");
const { CountrySchema } = require("db-schema");

const Country = mongoose.model("Country", CountrySchema);

module.exports = Country;
