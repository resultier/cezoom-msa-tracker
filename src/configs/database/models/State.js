const mongoose = require("mongoose");
const { StateSchema } = require("db-schema");

StateSchema.virtual("country", {
  ref: "Country",
  localField: "country_code",
  foreignField: "alpha2Code",
  justOne: true,
});

const State = mongoose.model("State", StateSchema);

module.exports = State;
