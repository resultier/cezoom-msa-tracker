const formidable = require("formidable");
const FileType = require("file-type");
const logger = require("../configs/logs/logger");
const Providers = require("../configs/database/models/UserProvider");
const UploadFactory = require("../factories/Upload.factory");
const FileFactory = require("../factories/File.factory");
const UserFilesService = require("../services/UserFiles.service");
const {
  isActualDateGreater,
  getProviderValidState,
} = require("../utils/utils");

const ProviderService = {
  getAllProviders: async (user_id, keywords, state) => {
    let providers = await Providers.findOne({ user_id }, "providers");
    const userFiles = await UserFilesService.getUserFiles(
      "user-providers"
    );
    providers = providers?.providers.filter((provider) => {
      const validState = getProviderValidState(state, {
        is_active: provider?.is_active,
        expiration_date: provider?.affiliation_end_date,
        start_date: provider?.affiliation_start_date,
      });
      if (
        provider.affiliation
          .toString()
          .toLowerCase()
          .search(keywords?.toLowerCase()) !== -1 &&
        validState
      )
        return provider;
    });
    providers = providers?.map((provider) => {
      const objProvider = {
        ...provider.toObject(),
        is_expired: isActualDateGreater(provider.affiliation_end_date),
      };
      const fileId = provider.affiliation_logo?.file_id;
      if (fileId && userFiles?.files) {
        objProvider.affiliation_logo = {
          ...objProvider.affiliation_logo,
          path: `/provider/logo/${user_id}/${objProvider.affiliation_logo.file_id.toString()}`,
        };
      }

      return objProvider;
    });

    return providers;
  },
  retrieveProviders: (providers = [], filterProviders = []) => {
    let filteredProviders = [];
    filterProviders.map((fProvider) => {
      const getProvider = providers.filter(
        (provider) => provider._id.toString() === fProvider._id.toString()
      );
      if (getProvider[0]?.affiliation_logo)
        filteredProviders.push(getProvider[0].affiliation_logo);
    });

    return filteredProviders;
  },
  getProvider: async (user_id, id) => {
    const { providers } = await Providers.findOne({ user_id }, "providers");
    const provider = providers.filter((prov) => prov._id.toString() === id);
    const objProvider = provider[0].toObject();
    if (objProvider.affiliation_logo?.file_id) {
      objProvider.affiliation_logo = {
        ...objProvider.affiliation_logo,
        path: `/provider/logo/${user_id}/${objProvider.affiliation_logo.file_id.toString()}`,
      };
    }

    return objProvider;
  },
  addProvider: async (data) => {
    return Providers.findOneAndUpdate(
      { user_id: data.user_id },
      { $push: { providers: data } },
      { new: true, upsert: true }
    );
  },
  updateProvider: async (data) => {
    const {
      user_id,
      id,
      country,
      industry,
      affiliation,
      affiliation_start_date,
      affiliation_end_date,
      disclaimer,
      logo_display,
      provider_statement,
    } = data;
    let isUpdated = false;
    let getProviders = await Providers.findOne({ user_id }, "providers");
    if (!getProviders) throw new Error("No providers found for user");

    getProviders = getProviders.providers.map((provider) => {
      if (provider._id.toString() === id.toString()) {
        provider = {
          ...provider.toObject(),
          country,
          industry,
          affiliation,
          affiliation_start_date,
          affiliation_end_date,
          disclaimer,
          logo_display,
          provider_statement,
        };
        isUpdated = true;

        return provider;
      } else return provider;
    });
    if (!isUpdated) throw new Error("No provider found");

    return Providers.findOneAndUpdate(
      { user_id },
      { providers: getProviders },
      { new: true, upsert: true }
    );
  },
  uploadLogo: async function (req, res) {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      try {
        const user = req.user;
        const url = req.protocol + "://" + req.get("host");

        UploadFactory.type = "provider-logo";
        const uploadRes = await UploadFactory.uploadFile(files, user, {
          ...fields,
          url,
        });

        res.json({
          success: true,
          process: uploadRes,
        });
      } catch (error) {
        logger.error(error.message);
        res.json({
          success: false,
          message: error.message,
        });
      }
    });
  },
  getLogo: async function (req, res) {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields) => {
      try {
        FileFactory.type = "provider-logo";
        const { buffer } = await FileFactory.getFile(req.params);

        const file = Buffer.from(buffer, "base64");
        const { mime } = await FileType.fromBuffer(file);

        res.writeHead(200, {
          "Content-type": mime,
          "Content-length": file.length,
        });
        res.end(file);
      } catch (error) {
        logger.error(error.message);
        res.json({
          success: false,
          message: error.message,
        });
      }
    });
  },
  deleteProvider: async (id, user_id) => {
    let getProviders = await Providers.findOne({ user_id }, "providers"),
      fileId = null;
    if (!getProviders) throw new Error("No providers found for user");
    getProviders = getProviders.providers.filter((provider) => {
      if (provider._id.toString() === id.toString()) {
        fileId = provider?.affiliation_logo?.file_id;
      } else return provider;
    });

    const updatedProviders = await Providers.findOneAndUpdate(
      { user_id },
      { providers: getProviders },
      { new: true, upsert: true }
    );
    await UserFilesService.deleteUserFile(fileId, "user-providers");
    return updatedProviders;
  },
  inactiveProvider: async (id, user_id) => {
    let isUpdated = false;
    let getProviders = await Providers.findOne({ user_id }, "providers");
    if (!getProviders) throw new Error("No providers found for user");

    getProviders = getProviders.providers.map((provider) => {
      if (provider._id.toString() === id.toString()) {
        if (!provider.is_active)
          throw new Error("Provider is already inactive");

        provider = { ...provider.toObject(), is_active: false };
        isUpdated = true;
      }
      return provider;
    });
    if (!isUpdated) throw new Error("No provider found with id");
    await Providers.findOneAndUpdate(
      { user_id },
      { providers: getProviders },
      { new: true }
    );

    return isUpdated;
  },
  getProviderStatistics: async (user_id) => {
    const providerStatistics = {
      provider_affiliations: 0,
      active_providers: 0,
      expired_providers: 0,
      upcoming_providers: 0,
    };
    const providerAffiliations = [];
    const getProviders = await Providers.findOne({ user_id }, "providers");
    if (getProviders?.providers) {
      getProviders.providers.map((provider) => {
        const getAffiliation = providerAffiliations.filter(
          (affiliation) =>
            affiliation.toString() === provider?.affiliation.toString()
        );
        if (getAffiliation?.length === 0)
          providerAffiliations.push(provider.affiliation);

        if (provider.is_active && !provider.is_expired)
          providerStatistics.active_providers += 1;

        if (isActualDateGreater(provider.affiliation_end_date))
          providerStatistics.expired_providers += 1;

        if (
          !isActualDateGreater(provider.affiliation_start_date) &&
          provider.is_active
        )
          providerStatistics.upcoming_providers += 1;
      });
      providerStatistics.provider_affiliations = providerAffiliations.length;
    }
    return providerStatistics;
  },
};

module.exports = ProviderService;
