const UserProfessionalLicencesService = require("../../services/UserProfessionalLicencesService");

module.exports = {
  Query: {
    userProfessionalLicences: (_source, {page, filters}, context) => {
      return UserProfessionalLicencesService.getUserProfessionalLicences(page,filters,context.user.id);
    },
    userProfessionalLicense: (_source, { _id }, context) => {
      return UserProfessionalLicencesService.getUserProfessionalLicenseById(_id,context.user.id);
    }
  },
  Mutation: {
    userProfessionalLicense: (_source, { professional_license }, context) => {
      return UserProfessionalLicencesService.saveUserProfessionalLicense(professional_license,context.user.id);
    },
    deleteUserProfessionalLicense: (_source, { _id }, context) => {
      return UserProfessionalLicencesService.deleteUserProfessionalLicense(_id,context.user.id);
    }
  },
};
