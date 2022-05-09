const CertificateService = require("../../services/certificate.service");

module.exports = {
  Query: {
    certificates: async (_source, {page, filters, company_id}, { user: { id } }) => {
      if (!company_id) {
        company_id = "2";
      }
      return CertificateService.getCertificates(page, filters, id, company_id);
    },
    certificate: async (_source, { _id, company_id }, { user }) => {
      if (!company_id) {
        company_id = "2";
      }
      return CertificateService.getCertificateById(_id, user, company_id);
    },
    userCertificates: async (_source, {page, filters}, { user: { id } }) => {
      return CertificateService.getCertificates(page, filters, id);
    },
    userCertificate: async (_source, { _id }, { user }) => {
      return CertificateService.getCertificateById(_id, user);
    }
  },
  Mutation: {
    certificate: async (_source, { input, company_id }, { user: { id } }) => {
      if (!company_id) {
        company_id = "2";
      }
      return CertificateService.saveCertificate(input, id, company_id);
    },
    deleteCertificate: async (_source, { _id, company_id }, { user: { id } }) => {
      if (!company_id) {
        company_id = "2";
      }
      return CertificateService.deleteCertificate(_id, id, company_id);
    },
    userCertificate: async (_source, { input }, { user: { id } }) => {
      return CertificateService.saveCertificate(input, id);
    },
    addLicenseToCertificate: async (_source, { certificate_id, license }, { user: { id } }) => {
      return CertificateService.addLicenseToCertificate(certificate_id, license, id);
    },
    userCourseCertificate: async (_source, { course_id }, { user }) => {
      return CertificateService.createUserCourseCertificate(course_id,user);
    },
    deleteUserCertificate: async (_source, { _id }, { user: { id } }) => {
      return CertificateService.deleteCertificate(_id, id);
    }
  }
};