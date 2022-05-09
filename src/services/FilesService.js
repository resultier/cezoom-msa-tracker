const formidable = require("formidable");
const FileType = require("file-type");
const logger = require("../configs/logs/logger");
const FileFactory = require("../factories/File.factory");
const global = require("../../globalConfig.json");

const FilesService = {
  getFiles: async (req, res) => {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields) => {
      try {
        FileFactory.type = "user-license";
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

module.exports = FilesService;
