const mongoose = require("mongoose");
const { TermsSchema } = require("db-schema");

const Terms = mongoose.model("Terms", TermsSchema);

module.exports = Terms;