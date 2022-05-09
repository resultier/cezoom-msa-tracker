const formidable = require("formidable");
const FileType = require("file-type");
const logger = require("../configs/logs/logger");
const UploadFactory = require("../factories/Upload.factory");
const FileFactory = require("../factories/File.factory");
const axios = require('axios');

const UserService = {
  uploadAvatar: async function (req, res) {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      try {
        const { user, protocol, originalUrl } = req;

        const url = protocol + "://" + req.get("host");
        const getPath = originalUrl.split("/");
        let type = req.params.type ? req.params.type : "user-avatar";
        if (getPath[1] === "presenter") type = "presenter-avatar";
        else if (getPath[1] === "sponsor") type = "sponsor-avatar";

        UploadFactory.type = type;
        const uploadRes = await UploadFactory.uploadFile(files, user, {
          url,
          type,
          ...fields,
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
  getAvatar: async function (req, res) {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields) => {
      try {
        FileFactory.type = "user-avatar";
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
  getEnrolledCourses: async function (token) {
    var response = await axios.get('https://courses.cezoom.resultier.dev/api/v1/course?enrolled=true', {
      headers: {
        'authorization': token
      }
    });
    console.log('Courses',response.data.data.courses);
    return response.data.data.courses;
  },
};

module.exports = UserService;
