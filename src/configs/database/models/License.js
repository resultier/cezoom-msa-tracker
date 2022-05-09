const mongoose = require("mongoose");
const { LicenseSchema } = require("db-schema");

LicenseSchema.virtual("state_complete", {
  ref: "State",
  localField: "state.name",
  foreignField: "name",
  justOne: true,
});

const License = mongoose.model("License", LicenseSchema, "licenses");

module.exports = License;
