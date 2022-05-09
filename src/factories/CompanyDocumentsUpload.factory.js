const UserFilesService = require("../services/UserFiles.service");
const CompanyDocuments = require("../configs/database/models/CompanyDocuments");
const { generateCurriculumAlias, convertFile } = require("../utils/utils");

const CompanyDocumentsUploadFactory = {
  type: "",
  uploadFile: function (files, user, fields) {
    switch (this.type) {
      case "add-company-documents":
        return this.addCompanyDocument(files, user, fields);
      case "add-company-documents-reply":
        return this.addCompanyDocumentReply(files, user, fields);
      default:
        return {
          success: false,
          message:
            this.type.length > 0
              ? `No type upload detected by: ${this.type}`
              : "No type upload defined",
        };
    }
  },
  getCompanyDocument: async function (company_id, document_id) {
    const getCompanyDocuments = await CompanyDocuments.findOne(
      { company_id },
      "documents"
    );
    if (!getCompanyDocuments) throw new Error("No documents found for company");
    const getDocument = getCompanyDocuments.documents.filter(
      (document) => document._id.toString() === document_id.toString()
    );
    if (getDocument.length === 0)
      throw new Error("No document found for company");

    return {
      getCompanyDocuments: getCompanyDocuments.documents,
      getCompanyDocument: getDocument[0],
    };
  },
  getCompanyDocumentReply: function (replies = [], replyId) {
    const getReply = replies.filter(
      (reply) => reply._id.toString() === replyId.toString()
    );
    if (!getReply) throw new Error("Reply not found");

    return getReply[0];
  },
  prepareUserFile: async function (
    file,
    company_id,
    { documentId, alias, replyId, isReply = false }
  ) {
    let { getCompanyDocument, getCompanyDocuments } =
      await this.getCompanyDocument(company_id, documentId);

    const documentFile = convertFile(file);
    const ext = documentFile.name.toString().split(".")[1];
    const documentAlias = alias
      ? `${alias}.${ext}`
      : `${generateCurriculumAlias()}.${ext}`;

    let preparedFile = {
      ...documentFile,
      is_public: getCompanyDocument.is_accesible,
      alias: documentAlias,
    };

    if (isReply) {
      const getReply = this.getCompanyDocumentReply(
        getCompanyDocument?.replies,
        replyId
      );
      preparedFile.is_public = getReply.is_accesible;
      if (getReply?.attachment)
        preparedFile.file_id = getReply.attachment.file_id;
    } else if (getCompanyDocument?.attachment)
      preparedFile.file_id = getCompanyDocument.attachment.file_id;

    const userFile = await UserFilesService.upsertUserFile(
      company_id,
      preparedFile,
      "company-documents"
    );
    delete userFile.buffer;

    return { getCompanyDocuments, userFile };
  },
  addCompanyDocument: async function (
    { file },
    { id: company_id },
    { documentId, alias, url }
  ) {
    let { getCompanyDocuments, userFile: getUserFile } =
      await this.prepareUserFile(file, company_id, {
        documentId,
        alias,
      });
    getCompanyDocuments = getCompanyDocuments.map((document) => {
      if (document._id.toString() === documentId.toString()) {
        document = {
          ...document.toObject(),
          attachment: { file_id: getUserFile._id, ...getUserFile },
        };
      }
      return document;
    });

    await CompanyDocuments.findOneAndUpdate(
      { company_id },
      { documents: getCompanyDocuments },
      { new: true }
    );

    return {
      company_document_url: `${url}/company/documents/${company_id}/${getUserFile._id.toString()}`,
    };
  },
  addCompanyDocumentReply: async function (
    { file },
    { id: company_id },
    { documentId, replyId, alias, url }
  ) {
    const companyDocuments = [];
    let companyDocument = {};
    let { getCompanyDocuments, userFile: getUserFile } =
      await this.prepareUserFile(file, company_id, {
        documentId,
        alias,
        replyId,
        isReply: true,
      });
    getCompanyDocuments.map((document) => {
      if (document._id.toString() === documentId.toString())
        companyDocument = document.toObject();
      else companyDocuments.push(document);
    });
    companyDocument.replies = companyDocument?.replies.map((reply) => {
      if (reply._id.toString() === replyId.toString())
        reply = {
          ...reply,
          attachment: { file_id: getUserFile._id, ...getUserFile },
        };

      return reply;
    });
    companyDocuments.push(companyDocument);

    await CompanyDocuments.findOneAndUpdate(
      { company_id },
      { documents: companyDocuments },
      { new: true }
    );

    return {
      company_document_reply_url: `${url}/company/documents/reply/${company_id}/${getUserFile._id.toString()}`,
    };
  },
};

module.exports = CompanyDocumentsUploadFactory;
