const formidable = require("formidable");
const logger = require("../configs/logs/logger");
const UploadFactory = require("../factories/Upload.factory");

const UploadService = {
  upload: async function (req, res, type) {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      try {
        const {
          user,
          protocol,
          originalUrl,
          params: { licenseId },
        } = req;
        const url = protocol + "://" + req.get("host");
        const getPath = originalUrl.split("/");
        let type = "user-license";
        if (getPath[1] === "dea") type = "user-dea-license";
        else if (getPath[1] === "membership") type = "user-membership";

        UploadFactory.type = type;
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
};

module.exports = UploadService;
