const CompanyCertificates = require("../../../src/configs/database/models/CompanyCertificates");

const createCertificates = async (company_id, certificates = []) => {
  return CompanyCertificates.create({ company_id, certificates });
};

export { createCertificates };
