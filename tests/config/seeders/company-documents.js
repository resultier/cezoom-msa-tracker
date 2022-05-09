const CompanyDocuments = require("../../../src/configs/database/models/CompanyDocuments");

const createCompanyDocuments = async (company_id, documents = []) => {
  return CompanyDocuments.insertMany({ company_id, documents });
};

export { createCompanyDocuments };
