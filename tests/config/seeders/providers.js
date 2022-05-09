const Providers = require("../../../src/configs/database/models/UserProvider");

const createProviders = async (user_id, providers = []) => {
  return Providers.create({ user_id, providers });
};

export { createProviders };
