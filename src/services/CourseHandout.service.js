const formidable = require("formidable");
const logger = require("../configs/logs/logger");
const FileType = require("file-type");
const FileFactory = require("../factories/File.factory");
const UserFileService = require("./UserFiles.service");
const UploadFactory = require("../factories/Upload.factory");

const CourseHandoutService = {
  uploadHandout: (req, res) => {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      try {
        const { user, protocol } = req;
        const url = protocol + "://" + req.get("host");

        UploadFactory.type = "course-handout";
        const uploadRes = await UploadFactory.uploadFile(files, user, {
          ...fields,
          url,
        });

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
        FileFactory.type = "get-course-handout";
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

module.exports = CourseHandoutService;
