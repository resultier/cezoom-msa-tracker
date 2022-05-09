const UserFiles = require("../../../src/configs/database/models/UserFiles");

const createUserFiles = (user_id, files = [], collection_type = "") => {
  return UserFiles.create({ user_id, files, collection_type });
};

const userFilesData = [
  {
    name: "test-file.pdf",
    size: "66316",
    type: "application/pdf",
    alias: "test-alias.pdf",
    path: "/test-path",
  },
];

export { createUserFiles, userFilesData };
