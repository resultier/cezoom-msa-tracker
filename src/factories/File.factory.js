const UserLicenses = require("../configs/database/models/UserIndustries");
const UserDeaLicenses = require("../configs/database/models/UserDeaLicenses");
const UserMemberships = require("../configs/database/models/UserMemberships");
const UserModel = require("../configs/database/models/User");
const UserProvider = require("../configs/database/models/UserProvider");
const UserFilesService = require("../services/UserFiles.service");

const FileFactory = {
  type: "",
  getFile: function (params, licenseId, user) {
    switch (this.type) {
      case "user-license":
        return this.getUserFile(params, "user-licenses");
      case "user-dea-license":
        return this.getDeaLicenseFile(params, licenseId, user);
      case "user-membership":
        return this.getUserMembership(params, licenseId, user);
      case "user-avatar":
        return this.getUserFile(params, "user-avatar");
      case "provider-logo":
        return this.getUserFile(params, "user-providers");
      case "get-company-document":
        return this.getUserFile(params, "company-documents");
      case "get-curriculum":
        return this.getUserFile(params, "user-curriculums");
      case "get-certificate":
        return this.getUserFile(params, "company-certificates");
      case "get-course-handout":
        return this.getUserFile(params, "course-handout");
      case "get-certificate-additional-images":
        return this.getUserFile(params, "certificates-additional-images");

      default:
        return {
          success: false,
          message:
            this.type.length > 0
              ? "No type file detected by : " + this.type
              : "Not type file defined",
        };
    }
  },
  getUserLicenseFile: async function (fileId, licenseId, user) {
    const userLicenses = await UserLicenses.findOne(
      { user_id: user.id },
      "industries"
    ).exec();
    let licenseFile = {};
    if (userLicenses?.industries.length > 0) {
      const licenses = userLicenses?.industries.toObject();
      licenses.map((item) => {
        const license = item.licenses.filter(
          (obj) => obj._id.toString() === licenseId.toString()
        );

        if (license) {
          licenseFile = license[0].detail.urls?.filter(
            (url) => url._id.toString() === fileId.toString()
          );
          if (licenseFile.length < 0)
            throw new Error("No file found for license");
        } else {
          throw new Error("No licenses found for user");
        }
      });

      return licenseFile[0];
    } else {
      throw new Error("No licenses found for user");
    }
  },
  getDeaLicenseFile: async function (fileId, licenseId, user) {
    const userDeaLicense = await UserDeaLicenses.findOne(
      {
        user_id: user.id,
      },
      "dea_licenses"
    ).exec();
    if (userDeaLicense?.dea_licenses.length > 0) {
      const license = userDeaLicense.dea_licenses.filter(
        (dea) => dea.license.id === licenseId
      );

      const licenseFile = license[0]?.detail.urls.filter(
        (file) => file.id === fileId
      );
      if (licenseFile?.length > 0) {
        return licenseFile[0];
      } else {
        throw new Error("No files found for license");
      }
    } else {
      throw new Error("No licenses found for user");
    }
  },
  getUserMembership: async function (fileId, membershipId, user) {
    const userMembership = await UserMemberships.findOne(
      {
        user_id: user.id,
      },
      "memberships"
    ).exec();
    if (userMembership?.memberships.length > 0) {
      const membership = userMembership.memberships.filter(
        (dea) => dea.membership.id === membershipId
      );

      const membershipFile = membership[0]?.detail.urls.filter(
        (file) => file.id === fileId
      );
      if (membershipFile?.length > 0) {
        return membershipFile[0];
      } else {
        throw new Error("No files found for license");
      }
    } else {
      throw new Error("No licenses found for user");
    }
  },
  getUserFile: async function ({ userId, fileId }, collection_type) {
    const getUserFile = await UserFilesService.getUserFileById(
      userId,
      fileId,
      collection_type
    );
    if (!getUserFile.is_public) throw new Error("File requested it's private");

    return getUserFile;
  },
};

module.exports = FileFactory;
