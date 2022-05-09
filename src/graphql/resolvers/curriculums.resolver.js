const UserCurriculumsService = require("../../services/UserCurriculums.service");

const UserCurriculumsResolver = {
  Query: {
    userCurriculum: (_source, { _id }) => {
      console.log('ID',_id);
      return UserCurriculumsService.getUserCurriculum(_id);
    },
    userCurriculums: (_source, { page, filters }, { user: { id } }) => {
      return UserCurriculumsService.getUserCurriculums(page,filters,id);
    },
  },
  Mutation: {
    saveUserCurriculum: (_source, { curriculum }, { user: { id } }) => {
      return UserCurriculumsService.saveCurriculum(curriculum,id);
    },
    deleteUserCurriculum: (_source, { _id }, { user: { id } }) => {
      return UserCurriculumsService.deleteCurriculum(_id,id);
    },
  },
};

module.exports = UserCurriculumsResolver;
