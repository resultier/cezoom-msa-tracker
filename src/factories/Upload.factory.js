const fs = require("fs");
const { convertFile, generateCurriculumAlias } = require("../utils/utils");
const UserLicenses = require("../configs/database/models/UserIndustries");
const UserDeaLicenses = require("../configs/database/models/UserDeaLicenses");
const UserMemberships = require("../configs/database/models/UserMemberships");
const UserModel = require("../configs/database/models/User");
const UserProviders = require("../configs/database/models/UserProvider");
const UserFilesService = require("../services/UserFiles.service");

const UploadFactory = {
  type: "",
  uploadFile: function (files, user, fields) {
    switch (this.type) {
      case "user-license":
        return this.uploadUserLicense(files, user, fields);
      case "user-dea-license":
        return this.uploadUserDeaLicense(files, user, fields);
      case "user-membership":
        return this.uploadUserMembership(files, user, fields);
      case "user-avatar":
        return this.uploadAvatar(files, user, fields);
      case "provider-logo":
        return this.uploadProviderLogo(files, user, fields);
      case "presenter-avatar":
        return this.uploadAvatar(files, user, fields);
      case "sponsor-avatar":
        return this.uploadAvatar(files, user, fields);
      case "course-handout":
        return this.uploadCourseHandout(files, user, fields);
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
  uploadUserLicense: async function (
    { files },
    { id: user_id },
    { licenseId: id, url }
  ) {
    const getUserIndustries = await UserLicenses.findOne({ user_id });
    if (!getUserIndustries) throw new Error("No industries found for user");

    let industries = getUserIndustries?.industries.toObject();
    let filesAdded = 0,
      licensesUpdated = 0,
      paths = [];
    files = files.map((file) => {
      return convertFile(file);
    });
    const getUserFiles = await UserFilesService.upsertManyUserFiles(
      user_id,
      files,
      "user-licenses"
    );
    filesAdded = getUserFiles.length;

    industries = industries.map((industry) => {
      industry?.licenses.filter((license) => {
        if (license._id.toString() === id.toString()) {
          licensesUpdated += 1;
          license.detail.urls = getUserFiles;
        }
      });

      return industry;
    });

    await UserLicenses.findOneAndUpdate(
      { user_id },
      { industries: industries },
      { new: true, upsert: true }
    );
    paths = getUserFiles.map((file) => {
      return `${url}/licenses/files/${user_id}/${file._id.toString()}`;
    });

    return {
      licensesUpdated,
      filesAdded,
      paths,
    };
  },
  uploadUserDeaLicense: async function (files, user, fields) {
    const userDeaLicense = await UserDeaLicenses.findOne(
      {
        user_id: user.id,
      },
      "dea_licenses"
    ).exec();
    const licenses = userDeaLicense.dea_licenses.toObject();
    let filesAdded,
      licensesUpdated = 0;
    licenses.map(function (item, index) {
      const id = item.license._id.toString();
      if (id == fields.id) {
        Object.assign(licenses[index].detail, {
          urls: files.files.map(function (file) {
            return {
              buffer: fs.readFileSync(file.path).toString("base64"),
              name: file.name,
              size: file.size,
              type: file.type,
            };
          }),
        });
        licensesUpdated += 1;
        filesAdded = licenses[index].detail.urls.length;
      }
    });

    await UserDeaLicenses.findOneAndUpdate(
      { user_id: user.id },
      { dea_licenses: licenses }
    );
    return {
      licensesUpdated,
      filesAdded,
      type: this.type,
    };
  },
  uploadUserMembership: async function (files, user, fields) {
    const userMembership = await UserMemberships.findOne(
      {
        user_id: user.id,
      },
      "memberships"
    ).exec();
    const memberships = userMembership.memberships.toObject();
    let filesAdded,
      memberhipsUpdated = 0;
    memberships.map(function (item, index) {
      const id = item.membership._id.toString();
      if (id == fields.id) {
        Object.assign(memberships[index].detail, {
          urls: files.files.map(function (file) {
            return {
              buffer: fs.readFileSync(file.path).toString("base64"),
              name: file.name,
              size: file.size,
              type: file.type,
            };
          }),
        });
        memberhipsUpdated += 1;
        filesAdded = memberships[index].detail.urls.length;
      }
    });

    await UserMemberships.findOneAndUpdate(
      { user_id: user.id },
      { memberships: memberships }
    );
    return {
      memberhipsUpdated,
      filesAdded,
      type: this.type,
    };
  },
  uploadUserAvatar: async function (file, user, params) {
    const { id: user_id } = user;
    const { url } = params;
    const userModel = await UserModel.findOne({ id: user_id });
    const userAvatar = convertFile(file);
    if (userModel?.avatar)
      userAvatar.file_id = userModel.avatar?.file_id.toString();
    const userFile = await UserFilesService.upsertUserFile(
      user_id,
      userAvatar,
      "user-avatar"
    );
    if (userModel) {
      userModel.avatar = { file_id: userFile._id };
      await UserModel.findOneAndUpdate(
        { user_id },
        { avatar: userModel.avatar },
        { new: true }
      );
    } else
      await UserModel.create({
        id: user_id,
        avatar: { file_id: userFile._id },
      });

    return { avatar_url: `${url}/user/avatar/${user_id}/${userFile._id}` };
  },
  uploadAvatar: async function ({ file }, user, params) {
    const { type } = params;
    if (type === "presenter-avatar") user = { id: params?.presenterId };
    else if (type === "sponsor-avatar") user = { id: params?.sponsorId };

    return this.uploadUserAvatar(file, user, params);
  },
  uploadProviderLogo: async function ({ file }, { id }, { providerId, url }) {
    let getProviders = await UserProviders.findOne(
        { user_id: id },
        "providers"
      ),
      preparedFile = {};
    if (!getProviders) throw new Error("No providers found for user");
    let getProvider = getProviders.providers.filter(
      (provider) => provider._id.toString() === providerId.toString()
    );
    if (!getProvider) throw new Error("No provider found");

    const providerLogo = convertFile(file);
    const ext = providerLogo.name.toString().split(".")[1];
    const fileAlias = `${generateCurriculumAlias()}.${ext}`;
    if (getProvider[0]?.affiliation_logo) {
      preparedFile = {
        ...providerLogo,
        alias: fileAlias,
        file_id: getProvider[0].affiliation_logo.file_id,
      };
    } else {
      preparedFile = { ...providerLogo, alias: fileAlias };
    }
    const userFile = await UserFilesService.upsertUserFile(
      id,
      preparedFile,
      "user-providers"
    );

    getProviders = getProviders.providers.map((provider) => {
      if (provider._id.toString() === providerId.toString()) {
        provider = {
          ...provider.toObject(),
          affiliation_logo: { file_id: userFile._id, ...userFile },
        };

        return provider;
      } else return provider;
    });

    await UserProviders.findOneAndUpdate(
      { user_id: id },
      { providers: getProviders },
      { new: true }
    );

    return {
      provider_logo_url: `${url}/provider/logo/${id}/${userFile._id.toString()}`,
    };
  },
  uploadCourseHandout: async function (
    { file },
    { id: user_id },
    { courseId, url }
  ) {
    const courseHandoutFile = convertFile(file);
    const ext = courseHandoutFile.name.toString().split(".")[1];
    const fileAlias = `${generateCurriculumAlias()}.${ext}`;
    courseHandoutFile.alias = fileAlias;

    const userFile = await UserFilesService.upsertUserFile(
      user_id,
      courseHandoutFile,
      "course-handout"
    );

    return { avatar_url: `${url}/course/handout/${user_id}/${userFile._id}` };
  },
};

module.exports = UploadFactory;
