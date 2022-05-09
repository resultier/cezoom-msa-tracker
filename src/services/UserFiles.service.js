const UserFiles = require("../configs/database/models/UserFiles");

const UserFilesService = {
  getUserFiles: async (collection_type, page, filters, user_id, company_id) => {
    if (!user_id) {
      user_id = company_id;
    }
    console.log('User',user_id);
    let user_files = await UserFiles.findOne({ user_id, collection_type }).exec();
    if (user_files) {
      user_files = user_files.files;
    }
    console.log(user_files);
    if (!user_files) {
      return {
        files: [],
        pagination: {
          page: 1,
          last_page: 0
        }
      }
    }
    if (filters.search) {
      for (var i = user_files.length - 1; i >= 0; i--) {
        var found = false;
        if ((user_files[i].name && user_files[i].name.toLowerCase().includes(filters.search.toLowerCase())) || (user_files[i].notes && user_files[i].notes.toLowerCase().includes(filters.search.toLowerCase()))) {
          found = true;
        }
        if (!found) {
          user_files.splice(i,1);
        }
      }
    }
    console.log('UserFiles',user_files)
    if (filters?.status?.length > 0 && filters?.status?.length < 2) {
      for (var i = user_files.length - 1; i >= 0; i--) {
        if (filters.status[0]?.toLowerCase() === 'active') {
          if (user_files[i].expiration && user_files[i].expiration < Number(new Date()) / 1000) {
            user_files.splice(i,1);
          }
        } else if (filters.status[0]?.toLowerCase() === 'expired') {
          if (user_files[i].expiration && Number(new Date()) / 1000 < user_files[i].expiration) {
            user_files.splice(i,1);
          }
        }
      }
    }
    var l = Math.ceil(user_files.length / 10);
    if (page > l) {page = l;}
    var p = !page ? 0 : Number(page) - 1;
    return {
      files: user_files.slice(p * 10,p * 10 + 10),
      pagination: {
        page: (!page ? 1 : page),
        last_page: l
      }
    };
  },
  getUserFileById: async (file_id, collection_type, user_id, company_id) => {
    if (!user_id) {
      user_id = company_id;
    }
    console.log('User',user_id);
    const getUserFiles = await UserFiles.findOne(
      { user_id, collection_type },
      "files"
    );
    if (!getUserFiles) throw new Error("No files found for user");
    const getFile = getUserFiles.files.filter(
      (file) => file._id.toString() === file_id.toString()
    );
    if (!getFile) throw new Error("File not found");

    return getFile[0];
  },
  saveUserFile: async (file, collection_type, user_id, company_id) => {
    if (!user_id) {
      user_id = company_id;
    }
    console.log('User',user_id);
    let getUserFile = {},
      isInsert = false;
    let getUserFiles = await UserFiles.findOne({
      user_id,
      collection_type,
    });
    if (!getUserFiles) getUserFiles = { files: [] };
    if (file?._id) {
      getUserFiles.files = getUserFiles.files.map((getFile) => {
        if (getFile._id.toString() === file._id.toString()) {
          const fileId = getFile._id;
          getFile = { _id: fileId, ...file };
          getUserFile = getFile;
        }
        return getFile;
      });
    } else {
      isInsert = true;
      getUserFiles.files.push(file);
    }

    const upsetedFiles = await UserFiles.findOneAndUpdate(
      { user_id, collection_type },
      { files: getUserFiles.files },
      { new: true, upsert: true }
    );
    if (isInsert) {
      getUserFile = upsetedFiles.files[upsetedFiles.files.length - 1];
      getUserFile = getUserFile.toObject();
    }

    return getUserFile;
  },
  deleteUserFile: async (file_id, collection_type, user_id, company_id) => {
    if (!user_id) {
      user_id = company_id;
    }
    console.log('User',user_id);
    await UserFiles.findOneAndUpdate(
      { user_id, collection_type },
      { $pull: { files: { _id: file_id } } },
      { new: true, upsert: true }
    );
    return 'Deleted file'
  }
};

module.exports = UserFilesService;
