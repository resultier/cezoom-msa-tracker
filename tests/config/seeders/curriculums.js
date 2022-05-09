const UserCurriculums = require("../../../src/configs/database/models/UserCurriculums");

const createCurriculums = async (user_id, curriculums = []) => {
  return UserCurriculums.create({ user_id, curriculums });
};

export { createCurriculums };
