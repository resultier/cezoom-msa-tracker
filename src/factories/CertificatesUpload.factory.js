const fs = require("fs");
const CompanyCertificates = require("../configs/database/models/CompanyCertificates");
const UserFilesService = require("../services/UserFiles.service");
const { convertFile, generateCurriculumAlias } = require("../utils/utils");

const CertificatesUploadFactory = {
  type: "",
  uploadFile: function (files, user, fields) {
    switch (this.type) {
      case "certificate-company-logo":
        return this.uploadCompanyLogo(files, user, fields);
      case "certificate-signature":
        return this.uploadSignature(files, user, fields);
      case "certificate-additional-images":
        return this.uploadAdditionalImages(files, user, fields);
      default:
        return {
          success: false,
          message:
            this.type.length > 0
              ? "No type upload detected by : " + this.type
              : "Not type upload defined",
        };
    }
  },
  convertFile: function (file) {
    const { path, name, size, type } = file;
    return {
      buffer: fs.readFileSync(path).toString("base64"),
      name,
      size,
      type,
    };
  },
  getCertificate: async function (id, certificateId) {
    const getCertificates = await CompanyCertificates.findOne(
      { user_id: id },
      "certificates"
    );
    if (!getCertificates) throw new Error("No certificates found for company");
    const getCertificate = getCertificates.certificates.filter(
      (cert) => cert._id.toString() === certificateId.toString()
    );
    if (getCertificate.length === 0)
      throw new Error("Certificate doesn't exists");

    return getCertificate;
  },
  retrieveCertificate: function (certificates, certificateId) {
    const getCertificate = certificates.filter(
      (certificate) => certificate._id.toString() === certificateId.toString()
    );
    if (getCertificate.length === 0)
      throw new Error("Certificate doesn't exists");

    return getCertificate[0];
  },
  prepareFile: async function (company_id, certificateId, file, certComponent) {
    let getCertificates = await CompanyCertificates.findOne(
      { company_id },
      "certificates"
    );
    if (!getCertificates) throw new Error("No certificates found for company");
    const getCertificate = this.retrieveCertificate(
      getCertificates.certificates,
      certificateId
    );
    const { header, signature } = getCertificate;
    let preparedFile = {};
    const certificateFile = convertFile(file);
    const ext = certificateFile.name.toString().split(".")[1];
    const fileAlias = `${generateCurriculumAlias()}.${ext}`;

    let component = null;
    switch (certComponent) {
      case "header":
        component = header?.company_logo;
        break;
      case "signature":
        component = signature?.signature;
        break;
    }

    if (component) {
      preparedFile = {
        ...certificateFile,
        alias: fileAlias,
        file_id: component.file_id,
      };
    } else preparedFile = { ...certificateFile, alias: fileAlias };
    const userFile = await UserFilesService.upsertUserFile(
      company_id,
      preparedFile,
      "company-certificates"
    );

    return { certificates: getCertificates, file: userFile };
  },
  uploadCompanyLogo: async function ({ file }, { id }, { certificateId, url }) {
    let { file: preparedFile, certificates } = await this.prepareFile(
      id,
      certificateId,
      file,
      "header"
    );

    certificates = certificates.certificates.map((certificate) => {
      if (certificate._id.toString() === certificateId.toString()) {
        certificate = {
          ...certificate.toObject(),
          header: {
            ...certificate.header.toObject(),
            company_logo: {
              ...certificate.header?.company_logo?.toObject(),
              file_id: preparedFile._id,
              ...preparedFile,
            },
          },
        };
        return certificate;
      } else return certificate;
    });
    await CompanyCertificates.findOneAndUpdate(
      { company_id: id },
      { certificates: certificates },
      { new: true }
    );

    return {
      certificatesUpdated: 1,
      filesAdded: 1,
      type: this.type,
      path: `${url}/certificate/company-logo/${id}/${preparedFile._id.toString()}`,
    };
  },
  uploadSignature: async function ({ file }, { id }, { certificateId, url }) {
    let { file: preparedFile, certificates } = await this.prepareFile(
      id,
      certificateId,
      file,
      "signature"
    );

    certificates = certificates.certificates.map((certificate) => {
      if (certificate._id.toString() === certificateId.toString()) {
        certificate = {
          ...certificate.toObject(),
          signature: {
            ...certificate.signature.toObject(),
            signature: {
              file_id: preparedFile._id,
              ...preparedFile,
            },
          },
        };
        return certificate;
      } else return certificate;
    });
    await CompanyCertificates.findOneAndUpdate(
      { company_id: id },
      { certificates: certificates },
      { new: true }
    );

    return {
      certificatesUpdated: 1,
      filesAdded: 1,
      type: this.type,
      path: `${url}/certificate/signature/${id}/${preparedFile._id.toString()}`,
    };
  },
  uploadAdditionalImages: async function (
    { files },
    { id: company_id },
    { certificateId, url }
  ) {
    let certificates = await CompanyCertificates.findOne(
      { company_id },
      "certificates"
    );
    if (!certificates) throw new Error("No certificates found for company");
    const getCertificate = this.retrieveCertificate(
      certificates.certificates,
      certificateId
    );
    if (!getCertificate) throw new Error("No certificate found with id");

    const convertedFiles = files.map((file) => convertFile(file));
    let userFiles = await UserFilesService.upsertManyUserFiles(
      company_id,
      convertedFiles,
      "certificates-additional-images",
      `/certificate/additional-images`
    );
    certificates = certificates.certificates.map((certificate) => {
      if (certificate._id.toString() === certificateId.toString())
        certificate = {
          ...certificate.toObject(),
          additional_images: {
            ...certificate.additional_images.toObject(),
            images: userFiles,
          },
        };

      return certificate;
    });
    await CompanyCertificates.findOneAndUpdate(
      { company_id },
      { certificates },
      { new: true }
    );
    userFiles = userFiles.map((userFile) => ({
      name: userFile.name,
      size: userFile.size,
      path: `${url}${userFile.path}`,
    }));

    return {
      certificatesUpdated: 1,
      filesAdded: files.length,
      type: this.type,
      paths: userFiles,
    };
  },
};

module.exports = CertificatesUploadFactory;
