const IndustriesService = require("../../services/IndustriesService");

module.exports = {
  Query: {
    industries: () => {
      return IndustriesService.getAllIndustries();
    },
    industry: (_source, { id }) => {
      return IndustriesService.getIndustryById(id);
    },
    licensesByState: (_source, { industry_code, state_code }) => {
      return IndustriesService.getLicensesByState(industry_code, state_code);
    },
    industryByName: (_source, { name }) => {
      return IndustriesService.getIndustryByName(name);
    },
    industriesById: (_source, { ids }, context) => {
      return IndustriesService.getIndustriesById(ids);
    },
    /*industriesByPresenter: (_source, { id }) => {
      return IndustriesService.getIndustriesByPresenter(id);
    },
    industriesByEmployee: (_source, { id }) => {
      return IndustriesService.getIndustriesByEmployee(id);
    },
    userIndustriesByUser: (_source, { }, { user: { id } }) => {
      return IndustriesService.getIndustriesByProfessional(id);
    },
    industryUserLicenseById: (_source, { industry, license }, context) => {
      return IndustriesService.getIndustryUserLicenseById(
        industry,
        license,
        context.user.id
      );
    },
    
    industryEmployeeLicenseById: (_source, { industry, license }, context) => {
      return IndustriesService.getIndustryEmployeeLicenseById(
        industry,
        license,
        context.user.id
      );
    },
    industryPresenterLicenseById: (_source, { industry, license }, context) => {
      return IndustriesService.getIndustryPresenterLicenseById(
        industry,
        license,
        context.user.id
      );
    },
    industriesByCompany: (_source, { id }, context) => {
      return IndustriesService.getIndustriesByCompany(id);
    },
    industryUserLicenses: (_source, {}, context) => {
      return IndustriesService.getIndustryUserLicenses(context.user.id);
    },
    industriesById: (_source, { ids }, context) => {
      return IndustriesService.getIndustriesById(ids);
    },*/
    userIndustryLicenses: (_source, {page, filters}, { user: { id } }) => {
      return IndustriesService.getUserIndustryLicenses(page,filters,id);
    },
    userIndustryLicensesByIndustry: (_source, { }, { user: { id } }) => {
      return IndustriesService.getUserIndustryLicensesByIndustry(id);
    },
  },
  Mutation: {
    addIndustry: (_source, { name }) => {
      return IndustriesService.createIndustry(name);
    },
    addTopicsToIndustry: (_source, { input }) => {
      return IndustriesService.createTopicsToIndustry(input);
    },
    updateTopicToIndustry: (_source, { input }) => {
      return IndustriesService.updateTopicToIndustry(input);
    },
    deleteTopicToIndustry: (_source, { input }) => {
      return IndustriesService.deleteTopicToIndustry(input);
    },
    addLicenseToIndustry: (_source, { input }) => {
      return IndustriesService.addLicenseToIndustry(input);
    },
    updateLicenseToIndustry: (_source, { input }) => {
      return IndustriesService.updateLicenseToIndustry(input);
    },
    deleteLicenseToIndustry: (_source, { input }) => {
      return IndustriesService.deleteLicenseToIndustry(input);
    },
    addIndustryPresenter: (_source, { data }, context) => {
      return IndustriesService.createIndustryPresenter(data, context.user.id);
    },
    addIndustryEmployee: (_source, { data }, context) => {
      return IndustriesService.createIndustryEmployee(data, context.user.id);
    },
    addIndustriesCompany: (_source, { input }, context) => {
      input.user_id = context.user.id;
      return IndustriesService.createIndustriesCompany(input);
    },
    /*addIndustryPresenter: (_source, { data }, context) => {
      return IndustriesService.createIndustryPresenter(data, context.user.id);
    },
    addIndustryEmployee: (_source, { data }, context) => {
      return IndustriesService.createIndustryEmployee(data, context.user.id);
    },
    addIndustriesUser: (_source, { input }, context) => {
      return IndustriesService.createUserIndustries(input, context.user.id);
    },
    
    addIndustriesCompany: (_source, { input }, context) => {
      input.user_id = context.user.id;
      return IndustriesService.createIndustriesCompany(input);
    },*/
    addMultipleIndustriesUserLicense: async (_source, { industries }, { user: { id } }) => {
      console.log('Industries',industries);
      for (var i = 0; i < industries.length; i++) {
        console.log(industries[i]);
        for (var j = 0; j < industries[i].licenses.length; j++) {
          console.log(industries[i].licenses[j]);
          await IndustriesService.saveUserIndustryLicense({
            name: industries[i].name,
            license: {
              industry: {
                _id: industries[i]._id,
                name: industries[i].name
              },
              profession: {
                _id: industries[i].licenses[j]._id,
                name: industries[i].licenses[j].name
              },
              state: industries[i].licenses[j].state,
              detail: {

              }
            }
          },id);
        }
      }
      return 'OK';
    },
    addIndustryUserLicense: (_source, { input }, { user: { id } }) => {
      return IndustriesService.saveUserIndustryLicense(input,id);
    },
    deleteIndustryUserLicense: (_source, { _id }, { user: { id } }) => {
      return IndustriesService.deleteUserIndustryLicense(_id,id);
    },
    /*updateIndustryUserLicense: (_source, { is_renewed, input }, context) => {
      input.user_id = context.user.id;
      return IndustriesService.updateUserIndustryLicense(is_renewed, input);
    },
    addIndustryEmployeeLicense: (_source, { input }, context) => {
      return IndustriesService.addIndustryEmployeeLicense(
        input,
        context.user.id
      );
    },
    updateIndustryEmployeeLicense: (
      _source,
      { is_renewed, input },
      context
    ) => {
      return IndustriesService.updateIndustryEmployeeLicense(
        input,
        is_renewed,
        context.user.id
      );
    },
    addIndustryPresenterLicense: (_source, { input }, context) => {
      return IndustriesService.addIndustyPresenterLicense(
        input,
        context.user.id
      );
    },
    updateIndustryPresenterLicense: (
      _source,
      { is_renewed, input },
      context
    ) => {
      return IndustriesService.updateIndustryPresenterLicense(
        input,
        is_renewed,
        context.user.id
      );
    },*/
  },
};
