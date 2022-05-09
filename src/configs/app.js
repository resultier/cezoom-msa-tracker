const { graphqlHTTP } = require("express-graphql");
const UploadService = require("../services/UploadService");
const UploadMiddleware = require("../middlewares/upload");
const HTTPFunction = require("./graphql/HTTPFunction");
const HTTPError = require("./rest/HTTPError");
const loggerViewer = require("../utils/logger-viewer");
const cors = require("cors");
const FilesService = require("../services/FilesService");
const UserService = require("../services/UserService");
const ProviderService = require("../services/ProviderService");
const SeedService = require("../services/Seed.service");
const CertificateService = require("../services/certificate.service");
const UserCurriculumsService = require("../services/UserCurriculums.service");
const UserCurriculums = require("./database/models/UserCurriculums");
const CompanyDocumentsService = require("../services/CompanyDocuments.service");
const CourseHandoutService = require("../services/CourseHandout.service");

const addAppConfigs = (app) => {
  // enable CORS - Cross Origin Resource Sharing
  app.use(cors());

  // INDEX
  app.get("/", function (req, res) {
    res.json("CEZOOM - Assets CDN API");
  });

  // LOGS
  app.get("/logs", function (req, res) {
    loggerViewer(res);
  });

  app.use("/graphql", graphqlHTTP(HTTPFunction));

  // Licenses files endpoints

  app.post("/licenses/files", UploadMiddleware, UploadService.upload);

  app.get("/licenses/files/:userId/:fileId", FilesService.getFiles);

  // Users avatar endpoints

  app.post("/user/avatar", UploadMiddleware, UserService.uploadAvatar);

  app.get("/user/avatar/:userId/:fileId", UserService.getAvatar);

  // Presenter avatars endpoints

  app.post("/presenter/avatar", UploadMiddleware, UserService.uploadAvatar);

  app.get("/presenter/avatar/:userId/:fileId", UserService.getAvatar);

  // Sponsor avatar endpoints

  app.post("/sponsor/avatar", UploadMiddleware, UserService.uploadAvatar);

  app.get("/sponsor/avatar/:userId/:fileId", UserService.getAvatar);

  // Providers logo enpoints

  app.post("/provider/logo", UploadMiddleware, ProviderService.uploadLogo);

  app.get("/provider/logo/:userId/:fileId", ProviderService.getLogo);

  app.post("/seed",SeedService.seed);

  // Certificates files endpoints

  app.post(
    "/certificate/company-logo",
    UploadMiddleware,
    CertificateService.uploadFile
  );

  app.get(
    "/certificate/company-logo/:userId/:fileId",
    CertificateService.getFile
  );

  app.post(
    "/certificate/signature",
    UploadMiddleware,
    CertificateService.uploadFile
  );

  app.get("/certificate/signature/:userId/:fileId", CertificateService.getFile);

  app.post(
    "/certificate/additional-images",
    UploadMiddleware,
    CertificateService.uploadFile
  );

  app.get(
    "/certificate/additional-images/:userId/:fileId",
    CertificateService.getFile
  );

  // User curriculums enpoints

  /*app.post(
    "/user/curriculum",
    UploadMiddleware,
    UserCurriculumsService.uploadFile
  );

  app.get("/user/curriculum/:userId/:fileId", UserCurriculumsService.getFile);

  app.put(
    "/user/curriculum/:userId/:curriculumId",
    UserCurriculumsService.uploadFile
  );*/

  // Company documents endpoints

  app.post(
    "/company/documents",
    UploadMiddleware,
    CompanyDocumentsService.uploadFile
  );

  app.get(
    "/company/documents/:userId/:fileId",
    CompanyDocumentsService.getFile
  );

  app.get(
    "/company/documents/reply/:userId/:fileId",
    CompanyDocumentsService.getFile
  );

  app.post(
    "/company/documents/reply",
    UploadMiddleware,
    CompanyDocumentsService.uploadFileReply
  );

  // Course handout endpoints

  app.post(
    "/course/handout",
    UploadMiddleware,
    CourseHandoutService.uploadHandout
  );

  app.get("/course/handout/:userId/:fileId", CourseHandoutService.getFile);

  app.use(HTTPError);

  return app;
};

module.exports = addAppConfigs;
