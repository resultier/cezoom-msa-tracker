const ContactUsService = require("../../services/ContactUs.service");

const contactUsResolver = {
  Query: {
    getAllContactUs: (_source, {}, context) => {
      return ContactUsService.getAll();
    },
  },
  Mutation: {
    createContactUs: (_source, { input }, context) => {
      return ContactUsService.create(input);
    },
  },
};

module.exports = contactUsResolver;
