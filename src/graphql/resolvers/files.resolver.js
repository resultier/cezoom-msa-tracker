const UserFiles = require("../../services/UserFiles.service");

module.exports = {
  Query: {
    //USER
    userFiles: async (_source, { collection_type, page, filters }, { user: { id } }) => {
      return UserFiles.getUserFiles(collection_type, page, filters, id);
    },
    userFile: async (_source, { _id, collection_type }, { user: { id } }) => {
      return UserFiles.getUserFileById(_id, collection_type, id);
    },
    //COMPANY
    companyFiles: async (_source, { collection_type, page, filters, company_id }, { user: { id } }) => {
      return UserFiles.getUserFiles(collection_type, page, filters, undefined, company_id);
    },
    companyFile: async (_source, { _id, collection_type }, { user: { id } }) => {
      return UserFiles.getUserFileById(_id, collection_type, undefined, company_id);
    }
  },
  Mutation: {
    //USER
    saveUserFile: async (_source, { file, collection_type }, { user: { id } }) => {
      return UserFiles.saveUserFile(file, collection_type, id);
    },
    deleteUserFile: async (_source, { _id, collection_type }, { user: { id } }) => {
      return UserFiles.deleteUserFile(_id, collection_type, id);
    },
    //COMPANY
    saveCompanyFile: async (_source, { file, collection_type }, { user: { id } }) => {
      return UserFiles.saveCompanyFile(file, collection_type, undefined, company_id);
    },
    deleteCompanyFile: async (_source, { _id, collection_type }, { user: { id } }) => {
      return UserFiles.deleteCompanyFile(_id, collection_type, undefined, company_id);
    }
  },
};
