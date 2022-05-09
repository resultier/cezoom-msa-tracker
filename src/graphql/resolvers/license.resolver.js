const LicensesService = require("../../services/LicensesService");

module.exports = {
  Query: {
    licenses: () => {
      return LicensesService.getAllLicenses();
    },
    license: (_source, { id }) => {
      return LicensesService.getLicenseById(id);
    },
    licensesByUser: (_source, { user_id }) => {
      return LicensesService.getLicensesByUser(user_id);
    },
  },
  Mutation: {
    addLicense: (_source, { data }, context) => {
      return LicensesService.createLicense(data);
    },
    addUserLicenses: (_source, { input }, context) => {
      return LicensesService.createUserLicenses(input);
    },
    addLicenseToUser: (_source, { user_id, license }, context) => {
      return LicensesService.addLicenseToUser(user_id, license);
    },
  },
};
