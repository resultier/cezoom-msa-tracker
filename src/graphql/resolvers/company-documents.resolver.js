const CompanyDocumentsService = require("../../services/CompanyDocuments.service");

module.exports = {
  Query: {
    companyDocuments: (_source, { filters }, { user: { id } }) => {
      return CompanyDocumentsService.getCompanyDocuments(filters, id);
    },
    companyDocument: (_source, { id }, { user: { id: company_id } }) => {
      return CompanyDocumentsService.getCompanyDocument(id, company_id);
    },
  },
  Mutation: {
    addCompanyDocument: (
      _source,
      { input },
      { user: { id, first_name, last_name } }
    ) => {
      input.company_id = id;
      input.user_name = `${first_name} ${last_name}`;
      return CompanyDocumentsService.addCompanyDocument(input);
    },
    updateCompanyDocument: (
      _source,
      { id, input },
      { user: { id: company_id, first_name, last_name } }
    ) => {
      input.company_id = company_id;
      input.user_name = `${first_name} ${last_name}`;
      return CompanyDocumentsService.updateCompanyDocument(id, input);
    },
    deleteCompanyDocument: (_source, { id }, { user: { id: company_id } }) => {
      return CompanyDocumentsService.deleteCompanyDocument(id, company_id);
    },
    addCompanyDocumentReply: (
      _source,
      { document_id, reply },
      { user: { id: company_id, first_name, last_name } }
    ) => {
      reply.company_id = company_id;
      reply.user_name = `${first_name} ${last_name}`;
      return CompanyDocumentsService.addCompanyDocumentReply(
        document_id,
        reply
      );
    },
  },
};
