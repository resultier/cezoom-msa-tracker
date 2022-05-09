const html_to_pdf = require("html-pdf-node");
const fs = require("fs");
const formidable = require("formidable");
const Mustache = require("mustache");
const axios = require("axios");
const FileType = require("file-type");
const logger = require("../configs/logs/logger");
const CompanyCertificates = require("../configs/database/models/CompanyCertificates");
const UserCertificates = require("../configs/database/models/UserCertificates");
const UserIndustries = require("../configs/database/models/UserIndustries");
const CertificatesUploadFactory = require("../factories/CertificatesUpload.factory");
const FileFactory = require("../factories/File.factory");
const UserFilesService = require("../services/UserFiles.service");
const ProviderService = require("../services/ProviderService");
const {
  renderProvidersLogos,
  renderSignature,
} = require("../templates/ce/template-utils");
const { certificates } = require("../../data/certificates.fake.json");
const { NODE_ENV } = require("../utils/constants");

const CertificateService = {
  getCertificates: async (page, filters, user_id, company_id) => {
    console.log('User',user_id);
    console.log('Company',company_id);
    var certificates;
    if (company_id) {
      certificates = await CompanyCertificates.findOne({ company_id }).exec();
    } else {
      certificates = await UserCertificates.findOne({ user_id }).exec();
    }
    console.log('Certificates',certificates);
    if (certificates) {
      certificates = certificates.certificates;
    }
    if (!certificates) {
      return {
        certificates: [],
        pagination: {
          page: 1,
          last_page: 0
        }
      }
    }
    if (filters?.license) {
      for (key in filters.license) {
        for (var i = certificates.length - 1; i >= 0; i--) {
          for (var j = 0; j < certificates.licences.length; j++) {
            if (!certificates[i].licences[j][key]?.name?.toLowerCase().includes(filters.license[key].toLowerCase())) {
              certificates.splice(i,1);
            }
          }
        }
      }
    }
    if (filters?.valid_from) {
      for (var i = certificates.length - 1; i >= 0; i--) {
        for (var j = 0; j < certificates.licences.length; j++) {
          if (certificates[i].licences[j].detail.issue_date < filters.valid_from) {
            certificates.splice(i,1);
          }
        }
      }
    }
    if (filters?.valid_to) {
      for (var i = certificates.length - 1; i >= 0; i--) {
        for (var j = 0; j < certificates.licences.length; j++) {
          if (filters.valid_to < (certificates[i].licences[j].detail.extended_date || certificates[i].licences[j].detail.expiration_date)) {
            certificates.splice(i,1);
          }
        }
      }
    }
    if (filters?.search) {
      for (var i = certificates.length - 1; i >= 0; i--) {
        if (!certificates[i]?.name.toLowerCase().includes(search.toLowerCase())) {
          certificates.splice(i,1);
        }
      }
    }
    var l = Math.ceil(certificates.length / 10);
    if (page > l) {page = l;}
    var p = !page ? 0 : Number(page) - 1;
    return {
      certificates: certificates.slice(p * 10,p * 10 + 10),
      pagination: {
        page: (!page ? 1 : page),
        last_page: l
      }
    };
  },
  getCertificateById: async (id, user, company_id) => {
    console.log('Id',id);
    console.log('User',user);
    console.log('Company',company_id);
    var certificates;
    if (company_id) {
      certificates = await CompanyCertificates.findOne(
        { company_id },
        "certificates"
      );
    } else {
      certificates = await UserCertificates.findOne(
        { user_id: user.id },
        "certificates"
      );
    }
    if (!certificates) {
      throw new Error('Not found');
    }
    const certificate = certificates.certificates.filter((certificate) => certificate._id.toString() === id)[0];
    if (!certificate) {
      throw new Error('Not found');
    }
    if (certificate.company_id) {
      console.log('Generating PDF');
      try {
        const options = { format: "A4" };
        const { id: user_id, first_name, last_name } = user;
        const path = `${process.cwd()}/src/templates/ce/certificate-simple.mustache`;

        const { header, signature, providers, additional_images, additional_info } = certificate;
        const template = fs.readFileSync(path).toString("utf-8");
        // Files
        var companyLogo = "";
        var certificateSigner = "";
        var providersLogos = "";
        if (header?.company_logo?.buffer) {
          companyLogo = `data:${header.company_logo.type};charset=utf-8;base64,${header.company_logo.buffer}`;
        }
        if (signature?.signature?.buffer) {
          certificateSigner = renderSignature(
            signature.is_display_signature,
            `data:${signature.signature.type};charset=utf-8;base64,${signature.signature.buffer}`,
            signature.signer);
        }
        const rendered = Mustache.render(template, {
          companyLogo,
          companyName: header.company_name,
          companyEmail: header.company_email,
          userName: `${first_name} ${last_name}`,
          certificateSigner,
          disclaimer: additional_info.disclaimer_statement,
          providersLogos,
        });
        const pdfBuffer = await html_to_pdf.generatePdf(
          { content: rendered },
          options
        );
        /*await this.increaseIssuedCounter(
          getCertificates.certificates,
          certificateId,
          user_id
        );*/
        certificate.file = {
          buffer: pdfBuffer.toString("base64"),
          size: 1024,
          type: 'application/pdf',
          name: 'Certificate.pdf'
        }
      } catch (error) {
        console.error(error);
        throw new Error(error);
      }
    }
    return certificate;
  },
  createUserCourseCertificate: async (course_id, user) => {
    console.log('CourseID',course_id);
    console.log('UserID',user.id);
    var certificates = await CompanyCertificates.findOne({ user_id: user.id });
    certificates = certificates.certificates;
    console.log('Certificates',certificates);
    var certificate;
    for (var i = 0; i < certificates.length; i++) {
      if (certificates[i].course?.course_id === course_id) {
        certificate = certificates[i];
      }
    }
    console.log('Certificate',certificate);
    var userIndustries = await UserIndustries.findOne({ user_id: user.id });
    var licences = [];
    for (var i = 0; i < userIndustries.industries.length; i++) {
      licences.push(...userIndustries.industries[i].licenses);
    }
    console.log('Licences',licences);
    certificate.licences = licences;
    certificate.earn_date = Math.round(Number(new Date()) / 1000);
    console.log('Generating PDF');
    try {
      const options = { format: "A4" };
      const path = `${process.cwd()}/src/templates/ce/certificate-simple.mustache`;
      const { header, signature, providers, additional_images, additional_info } = certificate;
      const template = fs.readFileSync(path).toString("utf-8");
      var companyLogo = "";
      var certificateSigner = "";
      var providersLogos = "";
      if (header?.company_logo?.buffer) {
        companyLogo = `data:${header.company_logo.type};charset=utf-8;base64,${header.company_logo.buffer}`;
      }
      if (signature?.signature?.buffer) {
        certificateSigner = renderSignature(
          signature.is_display_signature,
          `data:${signature.signature.type};charset=utf-8;base64,${signature.signature.buffer}`,
          signature.signer);
      }
      const rendered = Mustache.render(template, {
        companyLogo,
        companyName: header.company_name,
        companyEmail: header.company_email,
        userName: user.first_name + ' ' + user.last_name,
        certificateSigner,
        disclaimer: additional_info.disclaimer_statement,
        providersLogos,
      });
      const pdfBuffer = await html_to_pdf.generatePdf(
        { content: rendered },
        options
      );
      certificate.certificate = {
        buffer: pdfBuffer.toString("base64"),
        size: 1024,
        type: 'application/pdf',
        name: 'Certificate.pdf'
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
    console.log('Certificate',certificate);
    certificates = await UserCertificates.findOneAndUpdate(
      { user_id: user.id },
      { $push: { certificates: certificate } },
      { new: true, upsert: true }
    );
    return certificates.certificates[certificates.certificates.length - 1];
  },
  saveCertificate: async (data, user_id, company_id) => {
    var certificates;
    if (company_id) {
      console.log('Saving company certificate');
      certificates = await CompanyCertificates.findOne({ company_id });
    } else {
      console.log('Saving user certificate');
      certificates = await UserCertificates.findOne({ user_id });
    }
    if (data._id) {
      if (certificates && certificates.certificates) {
        for (var i = 0; i < certificates.certificates.length; i++) {
          if (certificates.certificates[i]._id.toString() === data._id) {
            console.log('Updating certificate');
            certificates.certificates[i] = data;
            await certificates.save();
            return certificates.certificates[i];
          }
        }
      }
      throw new Error('Not found');
    }
    console.log('Creating certificate');
    if (company_id) {
      certificates = await CompanyCertificates.findOneAndUpdate(
        { company_id },
        { $push: { certificates: data } },
        { new: true, upsert: true }
      );
    } else {
      certificates = await UserCertificates.findOneAndUpdate(
        { user_id },
        { $push: { certificates: data } },
        { new: true, upsert: true }
      );
    }
    return certificates.certificates[certificates.certificates.length - 1];
  },
  addLicenseToCertificate: async (certificate_id, license, user_id) => {
    var certificates = await UserCertificates.findOne({ user_id });
    if (certificates && certificates.certificates) {
      for (var i = 0; i < certificates.certificates.length; i++) {
        if (certificates.certificates[i]._id.toString() === certificate_id) {
          console.log('Adding license to certificate');
          certificates.certificates[i].licences.push(license);
          await certificates.save();
          return certificates.certificates[i];
        }
      }
    }
    throw new Error('Not found');
  },
  deleteCertificate: async function (id, user_id, company_id) {
    var certificates;
    if (company_id) {
      certificates = await CompanyCertificates.findOne({ company_id }).exec();
    } else {
      certificates = await UserCertificates.findOne({ user_id }).exec();
    }
    if (certificates !== null) {
      await certificates.certificates.pull({ _id: id });
      await certificates.save();
    }
    return "Deleted certificate"
  },
  getUserCertificates: async (page,filters,user,token) => {
    try {
      console.log('User',user);
      console.log('Page',page);
      console.log('Filters',filters);
      var courses = await axios.get('https://courses.cezoom.resultier.dev/api/v1/course?enrolled=true', {
        headers: {
          'authorization': token
        }
      });
      courses = courses.data.data.courses.data;
      console.log('Courses',courses);
      var courses_ids = [];
      var presenters_ids = [];
      for (var i = 0; i < courses.length; i++) {
        for (var j = 0; j < courses[i].course_presenter.length; j++) {
         presenters_ids.push(courses[i].course_presenter[j].presenter_id);
        }
        courses_ids.push(courses[i].id);
      }
      console.log('Courses ids',courses_ids);
      console.log('Presenters ids',presenters_ids);
      var presenters = await axios.post('https://users.cezoom.resultier.dev/api/v1/user/presenter/ids',{
          ids: presenters_ids
        },{
        headers: {
          'authorization': token
        }
      });
      presenters = presenters.data.data;
      console.log('Presenters',presenters);
      for (var i = 0; i < courses.length; i++) {
        for (var j = 0; j < courses[i].course_presenter.length; j++) {
          for (var k = 0; k < presenters.length; k++) {
            console.log(courses[i].course_presenter[j].presenter_id,presenters[k].id)
            if (courses[i].course_presenter[j].presenter_id === presenters[k].id) {
              courses[i].course_presenter[j] = presenters[k];
              courses[i].course_presenter[j]._id = presenters[k].id;
              break;
            }
          }
        }
      }
      var f = {
        'certificates.course_id': {$in: courses_ids}
      };
      var companyCertificates = await CompanyCertificates.find(f).exec();
      var certificates = [];
      for (var i = 0; i < companyCertificates.length; i++) {
        for (var j = 0; j < companyCertificates[i].certificates.length; j++) {
          for (var k = 0; k < courses.length; k++) {
            if (companyCertificates[i].certificates[j].course_id === courses[k].id) {
              companyCertificates[i].certificates[j].type = courses[k].type;
              companyCertificates[i].certificates[j].ce_credits = courses[k].credit_hours;
              companyCertificates[i].certificates[j].presenters = courses[k].course_presenter;
              if (!companyCertificates[i].certificates[j].presenters.length) {
                companyCertificates[i].certificates[j].presenters = [{
                  "_id": "95dfc3b2-8549-40e8-8e04-428b1253ada6",
                  "first_name": "Test",
                  "last_name": "Test",
                  "email": "presenter@presenter.com",
                  "avatar": "https://users.cezoom.resultier.dev/default/user.jpg"
                }];
              }
              certificates.push(companyCertificates[i].certificates[j]);
              break;
            }
          }
        }
      }
      var l = Math.ceil(certificates.length / 10);
      if (page > l) {page = l;}
      var p = !page ? 0 : Number(page) - 1;
      certificates = certificates.slice(p * 10,p * 10 + 10);
      var user_certificates = await UserCertificates.findOne({ user_id: user.id }).exec();
      if (user_certificates) {
        user_certificates = user_certificates.certificates;
      } else {
        user_certificates = [];
      }
      console.log('User certificates',user_certificates);
      for (var i = certificates.length - 1; i >= 0; i--) {
        var found = false;
        for (var j = 0; j < user_certificates.length; j++) {
          console.log(certificates[i]._id.toString(),user_certificates[j].certificate_id)
          if (certificates[i]._id.toString() === user_certificates[j].certificate_id) {
            certificates[i].earn_date = user_certificates[j].earn_date;
            certificates[i].status = 'earned';
            found = true;
            break;
          }
        }
        if (!found) {
          certificates[i].status = 'pending';
        }
      }
      return {
        certificates: certificates,
        pagination: {
          page: (!page ? 1 : page),
          last_page: l
        }
      };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },

  updateCertificate: async function (data) {
    const {
      company_id,
      id,
      header,
      signature,
      providers,
      additional_images,
      additional_info,
    } = data;
    let getCertificates = await CompanyCertificates.findOne(
      { company_id },
      "certificates"
    );
    if (!getCertificates) throw new Error("No certificates found for company");

    providers.providers = providers?.providers.map((provider) => ({
      _id: provider.id,
      ...provider,
    }));

    getCertificates = getCertificates.certificates.map((certificate) => {
      if (certificate._id.toString() === id.toString()) {
        certificate = {
          ...certificate.toObject(),
          header: { ...certificate.header.toObject(), ...header },
          signature: { ...certificate.signature.toObject(), ...signature },
          providers: { ...providers },
          additional_images: { ...additional_images },
          additional_info: { ...additional_info },
        };
        return certificate;
      } else return certificate;
    });

    return CompanyCertificates.findOneAndUpdate(
      { company_id },
      { certificates: getCertificates },
      { new: true, upsert: true }
    );
  },
  uploadFile: async function (req, res) {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      try {
        const { user, path } = req;
        const relative = path.split("/");
        const url = req.protocol + "://" + req.get("host");

        CertificatesUploadFactory.type = `certificate-${relative[2]}`;
        const uploadRes = await CertificatesUploadFactory.uploadFile(
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
  getFile: async function (req, res) {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields) => {
      try {
        const { params, path } = req;
        const relative = path.split("/");

        FileFactory.type =
          relative[2] === "additional-images"
            ? `get-certificate-${relative[2]}`
            : "get-certificate";
        const { buffer } = await FileFactory.getFile(params);

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
  increaseIssuedCounter: async function (
    certificates = [],
    certificate_id,
    company_id
  ) {
    certificates = certificates.map((certificate) => {
      if (certificate._id.toString() === certificate_id.toString())
        certificate.total_issued_certificates += 1;
      return certificate;
    });

    await CompanyCertificates.findOneAndUpdate(
      { company_id },
      { certificates },
      { new: true }
    );
  },
  getIssuedCertificates: async function (company_id) {
    let totalIssued = 0;
    const getCertificates = await CompanyCertificates.findOne(
      { company_id },
      "certificates"
    );
    if (!getCertificates) return 0;

    getCertificates.certificates.map(
      (certificate) => (totalIssued += certificate.total_issued_certificates)
    );

    return totalIssued;
  },
  duplicateCertificate: async (certificateId, name, company_id) => {
    let getCertificates = await CompanyCertificates.findOne(
      { company_id },
      "certificates"
    );
    if (!getCertificates) throw new Error("No certificates found for company");

    let getCertificate = getCertificates.certificates.filter(
      (certificate) => certificate._id.toString() === certificateId.toString()
    );
    if (!getCertificate.length < 0)
      throw new Error("No certificate found for duplicate");
    getCertificate = getCertificate[0].toObject();
    delete getCertificate._id;

    const duplicatedCertificate = { ...getCertificate, name };
    getCertificates.certificates.push(duplicatedCertificate);
    return CompanyCertificates.findOneAndUpdate(
      { company_id },
      { certificates: getCertificates.certificates },
      { new: true }
    );
  },
  inactiveCertificate: async (certificateId, company_id) => {
    let getCertificates = await CompanyCertificates.findOne(
        { company_id },
        "certificates"
      ),
      isInactive = false;
    if (!getCertificates) throw new Error("No certificates found for company");

    getCertificates = getCertificates.certificates.map((certificate) => {
      if (
        certificate._id.toString() === certificateId.toString() &&
        certificate.is_active
      ) {
        certificate = { ...certificate.toObject(), is_active: false };
        isInactive = true;
      }
      return certificate;
    });
    await CompanyCertificates.findOneAndUpdate(
      { company_id },
      { certificates: getCertificates },
      { new: true }
    );

    return isInactive;
  },
};

module.exports = CertificateService;
