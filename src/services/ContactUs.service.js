const ContactUs = require("../configs/database/models/ContactUs");
const NotificationIntance = require("../configs/request/NotificationRequest");

const ContactUsService = {
  create: async function (data) {
    const res = await NotificationIntance.post(
      "/api/v1/notification/external",
      {
        provider: "cezoom-tracker",
        vias: ["mail"],
        template: "ContactUs",
        data: {
          email: data.email,
        },
        database: {
          message: "Contact us",
        },
      }
    );
    return ContactUs.create(data);
  },
  getAll: async function () {
    return ContactUs.find();
  },
};

module.exports = ContactUsService;
