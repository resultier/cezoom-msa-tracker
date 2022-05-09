const License = require("../configs/database/models/License");

const LicensesService = {
  getAllLicenses: async function () {
    return License.find().exec();
  },
  getLicenseById: async function (id) {
    return License.findById(id).exec();
  },
  getLicensesByUser: async function (user_id) {
    let res = await UserLicenses.findOne({ user_id }).exec();
    return res.licenses;
  },
  createLicense: async function (data) {
    return License.create(data);
  },
  addLicenseToUser: async function (user_id, license) {
    return null
  },
};

module.exports = LicensesService;
