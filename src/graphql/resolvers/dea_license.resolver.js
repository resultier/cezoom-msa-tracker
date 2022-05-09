const DeaLicensesService = require("../../services/DeaLicensesService");

module.exports = {
  Query: {
    deaLicense: (_source, { id }) => {
      return DeaLicensesService.getDeaLicenseById(id);
    },
    deaLicenses: (_source, {page, filters}, context) => {
      console.log('Page',page);
      console.log('Filters',filters);
      return DeaLicensesService.getAllDeaLicenses(page,filters);
    },
    deaLicensesByUser: (_source, {page, filters}, context) => {
      console.log('Page',page);
      console.log('Filters',filters);
      console.log('Context',context.user);
      return DeaLicensesService.getDeaLicensesByUser(page,filters,context.user.id);
    },
  },
  Mutation: {
    addDeaLicense: (_source, { dea_license }, context) => {
      return DeaLicensesService.createDeaLicense(dea_license);
    },
    addDeaLicenseToUser: (_source, { _id, dea_license, page }, context) => {
      return DeaLicensesService.addDeaLicenseToUser(_id,context.user.id,dea_license,page);
    },
    deleteDeaLicenseToUser: (_source, { _id }, context) => {
      return DeaLicensesService.deleteLicenseToUser(_id, context.user.id);
    },
  },
};
