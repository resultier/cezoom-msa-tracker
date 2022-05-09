const fs = require("fs");
const FileType = require("file-type");
const UserCurriculums = require("../configs/database/models/UserCurriculums");
const UserFilesService = require("../services/UserFiles.service");
const { generateCurriculumAlias, convertFile } = require("../utils/utils");

const UserCurriculumsUploadFactory = {
  type: "",
  uploadFile: function (files, user, fields) {
    switch (this.type) {
      case "add-curriculum":
        return this.addUserCurriculum(files, user, fields);
      case "update-curriculum":
        return this.updateUserCurriculum(files, user, fields);
      default:
        return {
          success: false,
          message:
            this.type.length > 0
              ? `No type upload detected by: ${this.type}`
              : "No type upload defined",
        };
    }
  },
  getUserCurriculum: async function (user_id, curriculumId) {
    const getUserCurriculums = await UserCurriculums.findOne(
      { user_id },
      "curriculums"
    );
    if (!getUserCurriculums) throw new Error("No curriculums found for user");
    const getCurriculum = getUserCurriculums.curriculums.filter(
      (curriculum) => curriculum._id.toString() === curriculumId.toString()
    );
    if (!getCurriculum) throw new Error("No curriculum found for user");

    return getCurriculum[0];
  },
  addUserCurriculum: async function ({ file }, { id }, { alias, url }) {
    const curriculumFile = convertFile(file);
    const ext = curriculumFile.name.toString().split(".")[1];
    const curriculumAlias = alias
      ? `${alias}.${ext}`
      : `${generateCurriculumAlias()}.${ext}`;
    const userFile = await UserFilesService.upsertUserFile(
      id,
      {
        ...curriculumFile,
        alias: curriculumAlias,
      },
      "user-curriculums"
    );
    const fileId = userFile._id.toString();

    const userCurriculum = await UserCurriculums.findOneAndUpdate(
      { user_id: id },
      { $push: { curriculums: { file_id: userFile._id, ...userFile } } },
      { new: true, upsert: true }
    );
    const curriculumAdded =
      userCurriculum.curriculums[
        userCurriculum.curriculums.length - 1
      ].toObject();
    curriculumAdded.curriculumId = curriculumAdded._id.toString();
    delete curriculumAdded._id;
    delete curriculumAdded.file_id;
    delete userFile._id;
    delete userFile.buffer;

    return {
      curiculumsAdded: 1,
      path: `${url}/user/curriculum/${id}/${fileId}`,
      metadata: { ...curriculumAdded, ...userFile },
    };
  },
  updateUserCurriculum: async function (
    { file },
    { id },
    { curriculumId, alias, url }
  ) {
    const convertedFile = convertFile(file);
    const ext = convertedFile.name.toString().split(".")[1];
    convertedFile.alias = alias
      ? `${alias}.${ext}`
      : `${generateCurriculumAlias()}.${ext}`;
    const { file_id } = await this.getUserCurriculum(id, curriculumId);
    convertedFile.file_id = file_id;
    await UserFilesService.updateUserFile(
      id,
      convertedFile,
      "user-curriculums"
    );
    delete convertedFile.buffer;
    delete convertedFile.file_id;

    return {
      curiculumsAdded: 1,
      path: `${url}/user/curriculum/${id}/${file_id}`,
      metadata: {
        curriculumId,
        ...convertedFile,
      },
    };
  },
};

module.exports = UserCurriculumsUploadFactory;
