const UserIndustries = require("../../../src/configs/database/models/UserIndustries");

const createUserIndustry = async (user_id, industries = []) => {
  return UserIndustries.create({
    user_id,
    industries,
  });
};

const getUserIndustry = async (user_id) => {
  return UserIndustries.find({ user_id });
};

export { getUserIndustry, createUserIndustry };
