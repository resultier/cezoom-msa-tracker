const { uploader, api } = require("../configs/cloudinary");

module.exports = {
  upload: async function (file, folder = null, overwrite = false) {
    return await uploader.upload(file, {
      folder,
      overwrite,
    });
  },

  info: async function (publicId) {
    return await api.resource(publicId);
  },
};
