const mongoose = require("mongoose");
const { ContactUsSchema } = require("db-schema");

const ContactUs = mongoose.model("ContactUs", ContactUsSchema);

module.exports = ContactUs;
