const formidable = require("formidable");
const logger = require("../configs/logs/logger");
const FileType = require("file-type");
const CompanyDocumentsUploadFactory = require("../factories/CompanyDocumentsUpload.factory");
const FileFactory = require("../factories/File.factory");
const CompanyDocuments = require("../configs/database/models/CompanyDocuments");
const UserFileService = require("./UserFiles.service");

const CompanyDocumentsService = {
  getCompanyDocuments: async function (filters, company_id) {
    let documents = [];
    let getDocuments = await CompanyDocuments.findOne({
      company_id,
    });
    getDocuments = getDocuments?.documents.map((document) => {
      document = this.getFilesPaths(document, company_id);
      if (document?.replies) {
        document.replies = document.replies.map((reply) => {
          return this.getFilesPaths(reply, company_id, true);
        });
      }

      return document;
    });
    if (!filters) return { company_id, documents: getDocuments };

    documents = getDocuments?.filter((document) => {
      if (
        (document.status.toString() === "read" && filters?.is_read) ||
        (document.status.toString() === "unread" && filters?.is_unread)
      )
        return document;
    });

    return { company_id, documents: !documents ? [] : documents };
  },
  getFilesPaths: function (document = {}, company_id, isReply = false) {
    document = !isReply ? document.toObject() : document;
    if (document?.attachment) {
      const path = !isReply
        ? `/company/documents/${company_id}/${document.attachment.file_id}`
        : `/company/documents/reply/${company_id}/${document.attachment.file_id}`;
      return {
        id: document._id.toString(),
        ...document,
        attachment: {
          ...document.attachment,
          path,
        },
      };
    } else return { id: document._id.toString(), ...document };
  },
  addCompanyDocument: (input) => {
    const { company_id } = input;
    input.published_date = Math.floor(new Date().getTime() / 1000);
    return CompanyDocuments.findOneAndUpdate(
      { company_id },
      { $push: { documents: input } },
      { new: true, upsert: true }
    );
  },
  getCompanyDocument: async (id, company_id) => {
    const getDocuments = await CompanyDocuments.findOne(
      { company_id },
      "documents"
    );
    if (!getDocuments) throw new Error("No documents found for company");
    const getDocument = getDocuments.documents.filter(
      (document) => document._id.toString() === id.toString()
    );
    if (!getDocument) throw new Error("No document found with id");

    return { company_id, documents: getDocument };
  },
  updateCompanyDocument: async (id, input) => {
    const { company_id } = input;
    let getDocuments = await CompanyDocuments.findOne(
        { company_id },
        "documents"
      ),
      updatedDocument = {},
      isContainAttachment = false;
    if (getDocuments.length === 0)
      throw new Error("No documents found for company");

    getDocuments = getDocuments.documents.map((document) => {
      if (document._id.toString() === id.toString()) {
        document = {
          ...document.toObject(),
          ...input,
        };
        isContainAttachment = document?.attachment ? true : false;
        updatedDocument = {
          ...document.attachment,
          is_public: input.is_accesible,
        };
      }
      return document;
    });

    if (isContainAttachment) {
      await UserFileService.updateUserFile(
        company_id,
        updatedDocument,
        "company-documents"
      );
    }

    return CompanyDocuments.findOneAndUpdate(
      { company_id },
      { documents: getDocuments },
      { new: true }
    );
  },
  deleteCompanyDocument: async (id, company_id) => {
    let getDocuments = await CompanyDocuments.findOne(
      { company_id },
      "documents"
    );
    if (!getDocuments) throw new Error("No documents found for company");

    getDocuments = getDocuments.documents.filter((document) => {
      if (document._id.toString() !== id.toString()) return document;
    });
    return CompanyDocuments.findOneAndUpdate(
      { company_id },
      { documents: getDocuments },
      { new: true }
    );
  },
  addCompanyDocumentReply: async (document_id, reply) => {
    const { company_id } = reply;
    let getDocuments = await CompanyDocuments.findOne(
      { company_id },
      "documents"
    );
    if (!getDocuments) throw new Error("No documents found for company");

    getDocuments = getDocuments.documents.map((document) => {
      if (document._id.toString() === document_id.toString()) {
        if (document?.replies) document.replies.push(reply);
        else document.replies = [reply];
      }
      return document;
    });
    return CompanyDocuments.findOneAndUpdate(
      { company_id },
      { documents: getDocuments },
      { new: true }
    );
  },
  uploadFile: (req, res) => {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      try {
        const { user, protocol } = req;
        const url = protocol + "://" + req.get("host");

        CompanyDocumentsUploadFactory.type = "add-company-documents";
        const uploadRes = await CompanyDocumentsUploadFactory.uploadFile(
          files,
          user,
          { ...fields, url }
        );

        res.json({
          success: true,
          process: uploadRes,
        });
      } catch (error) {
        logger.error(error.message);
        res.json({
          success: false,
          message: error.message,
        });
      }
    });
  },
  uploadFileReply: (req, res) => {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      try {
        const { user, protocol } = req;
        const url = protocol + "://" + req.get("host");

        CompanyDocumentsUploadFactory.type = "add-company-documents-reply";
        const uploadRes = await CompanyDocumentsUploadFactory.uploadFile(
          files,
          user,
          { ...fields, url }
        );

        res.json({
          success: true,
          process: uploadRes,
        });
      } catch (error) {
        logger.error(error.message);
        res.json({
          success: false,
          message: error.message,
        });
      }
    });
  },
  getFile: (req, res) => {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields) => {
      try {
        FileFactory.type = "get-company-document";
        const { buffer } = await FileFactory.getFile(req.params);

        const file = Buffer.from(buffer, "base64");
        const { mime } = await FileType.fromBuffer(file);

        res.writeHead(200, {
          "Content-type": mime,
          "Content-length": file.length,
        });
        res.end(file);
      } catch (error) {
        logger.error(error.message);
        res.json({
          success: false,
          message: error.message,
        });
      }
    });
  },
};

module.exports = CompanyDocumentsService;
