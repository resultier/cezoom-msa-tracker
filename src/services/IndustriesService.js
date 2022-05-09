const Industry = require("../configs/database/models/Industry");
const License = require("../configs/database/models/License");
const UserIndustries = require("../configs/database/models/UserIndustries");
const PresenterIndustries = require("../configs/database/models/PresenterIndustries");
const EmployeeIndustries = require("../configs/database/models/EmployeeIndustries");
const CompanyIndustries = require("../configs/database/models/CompanyIndustries");

const { addDates } = require("../utils/utils");

const IndustriesService = {
  //ALL
  getAllIndustries: async function () {
    return Industry.find().exec();
  },
  getIndustryById: async function (id) {
    return Industry.findById(id).exec();
  },
  getIndustriesById: async function(ids)
  {
    return Industry.find().where('id').in(ids).exec();
  },
  getLicensesByState: async function (industry_code, code) {
    const industry = await Industry.findById(industry_code).exec();
    const licenses =
      industry.custom_licenses.length > 0
        ? industry.custom_licenses.find(function (item) {
            return item.state.state_code === code;
          })
        : [];
    return licenses.length > 0 ? licenses : industry.licenses;
  },
  getIndustryByName: async function (name) {
    return Industry.findOne({ name: name });
  },
  //ADMIN
  createIndustry: async function (name) {
    return Industry.create({ name: name, timestamp: new Date().getTime() });
  },
  createTopicsToIndustry: async function (data) {
    const { industry_id, topic } = data;
    const addedTopic = await Industry.updateOne(
      { _id: industry_id },
      { $push: { topics: topic } }
    );

    return addedTopic.nModified === 1
      ? Industry.findOne({ _id: industry_id })
      : new Error(`Topic not added`);
  },
  updateTopicToIndustry: async function (data) {
    const { industry_id, topic } = data;
    const { _id, name, subs } = topic;
    await Industry.updateOne(
      { _id: industry_id, "topics._id": _id },
      {
        $set: {
          "topics.$.name": name,
          "topics.$.subs": subs,
        },
      }
    );

    return Industry.findOne({ _id: industry_id });
  },
  deleteTopicToIndustry: async function (data) {
    const { industry_id, topic_id } = data;
    const getTopics = await Industry.findOne({ _id: industry_id }, "topics");
    const updatedTopics = getTopics.topics.filter(
      (topic) => topic._id.toString() !== topic_id.toString()
    );

    return Industry.findOneAndUpdate(
      { _id: industry_id },
      { topics: updatedTopics },
      { new: true }
    );
  },
  addLicenseToIndustry: async function (data) {
    const { industry_id, license } = data;
    const addedLicenses = await Industry.updateOne(
      { _id: industry_id },
      { $push: { licenses: license } }
    );

    return addedLicenses.nModified === 1
      ? Industry.findOne({ _id: industry_id })
      : new Error(`License not added`);
  },
  updateLicenseToIndustry: async function (data) {
    const { industry_id, license } = data;
    const { _id, name, detail, state } = license;
    await Industry.updateOne(
      { _id: industry_id, "licenses._id": _id },
      {
        $set: {
          "licenses.$.name": name,
          "licenses.$.detail": detail,
          "licenses.$.state": state,
        },
      }
    );

    return Industry.findOne({ _id: industry_id });
  },
  deleteLicenseToIndustry: async function (data) {
    const { industry_id, license_id } = data;
    const getLicenses = await Industry.findOne(
      { _id: industry_id },
      "licenses"
    );
    const updatedLicenses = getLicenses.licenses.filter(
      (license) => license._id.toString() !== license_id
    );

    return Industry.findOneAndUpdate(
      { _id: industry_id },
      { licenses: updatedLicenses },
      { new: true }
    );
  },
  //COMPANY
  createIndustriesCompany: async function (data) {
    const { user_id, industries, company_id } = data;
    return CompanyIndustries.findOneAndUpdate(
      { user_id },
      { industries, company_id },
      { new: true, upsert: true }
    );
  },
  getIndustriesByCompany: async function(company_id){
    return CompanyIndustries.findOne({company_id}).exec();
  },
  //USER
  /*updateUserIndustryLicense: async function (is_renewed, data) {
    const {
      user_id,
      industry: { _id, license },
    } = data;
    const {
      detail: { expiration_date, granted_extension },
    } = license;

    const getIndustries = await UserIndustries.findOne(
      { user_id: user_id },
      "industries"
    );

    const getIndustry = getIndustries.industries.filter(
      (industry) => industry._id.toString() === _id.toString()
    );
    if (getIndustry.length === 0)
      throw new Error("No industry found related to user");

    const newExtendedDate = addDates({ ...granted_extension, expiration_date });

    // Renew existing license
    if (is_renewed) {
      getIndustry[0].licenses.map((item, index) => {
        if (item._id.toString() === license._id.toString()) {
          const detail = { is_renewed: true, is_active: false };
          getIndustry[0].licenses[index].detail = getIndustry[0].licenses[index]
            .detail
            ? { ...getIndustry[0].licenses[index].detail.toObject(), ...detail }
            : detail;
        }
      });
      delete license._id;
      const updatedLicense = {
        ...license,
        detail: {
          ...license.detail,
          ...license.detail.granted_extension,
          is_active: true,
        },
      };
      if (newExtendedDate)
        updatedLicense.detail.expiration_date = newExtendedDate;
      getIndustry[0].licenses.push(updatedLicense);
    } else {
      getIndustry[0].licenses.map((item, index) => {
        if (item._id.toString() === license._id.toString()) {
          license.detail.urls = getIndustry[0].licenses[index]?.detail?.urls
            ? getIndustry[0].licenses[index]?.detail?.urls
            : [];
          getIndustry[0].licenses[index] = {
            ...license,
            detail: {
              ...license.detail,
              ...license.detail.granted_extension,
              is_active: true,
            },
          };
          if (newExtendedDate)
            getIndustry[0].licenses[index].detail.expiration_date =
              newExtendedDate;
        }
      });
    }

    return await UserIndustries.findOneAndUpdate(
      { user_id: user_id },
      { industries: getIndustries.industries },
      { new: true }
    );
  },*/
  saveUserIndustryLicense: async function (data, user_id) {
    console.log('Data',data);
    if (!data.name && data.license?.industry) {
      data.name = data.license.industry.name;
    }
    console.log('User',user_id);
    var userIndustries = await UserIndustries.findOne({ user_id });
    console.log('Industries',userIndustries);
    var userIndustry;
    if (userIndustries) {
      var industries = userIndustries.industries;
      var found_industry = false;
      for (var i = 0; i < industries.length; i++) {
        if (industries[i].name === data.name) {
          console.log(industries[i].name,data.name);
          found_industry = true;
          var found_license = false;
          for (var j = 0; j < industries[i].licenses.length; j++) {
            console.log(industries[i].licenses[j]._id.toString(),data.license._id);
            if (industries[i].licenses[j]._id.toString() === data.license._id) {
              if (!industries[i].licenses[j].detail.is_renewed && data.license.detail.is_renewed) {
                console.log('Renewing industry licence');
                industries[i].licenses[j].detail.is_active = false;
                industries[i].licenses[j].detail.is_renewed = true;
                data.license._id = undefined;
                data.license.detail.is_active = true;
                data.license.detail.is_renewed = false;
                industries[i].licenses.push(data.license);
              } else {
                console.log('Updating industry license');
                data.license._id = undefined;
                industries[i].licenses[j] = data.license;
              }
              found_license = true;
              break;
            }
          }
          if (!found_license) {
            for (var j = 0; j < industries[i].licenses.length; j++) {
              if (data.license.state?.name === industries[i].licenses[j].state?.name) {
                console.log('Duplicate STATE industry license');
                throw new Error('Duplicate STATE industry license');
              }
              if (!data.license.state && data.country?.name === industries[i].licenses[j].country?.name) {
                console.log('Duplicate COUNTRY industry license');
                throw new Error('Duplicate COUNTRY industry license');
              }
            }
            console.log('Adding industry license');
            industries[i].licenses.push(data.license);
          }
          break;
        }
      }
      if (!found_industry) {
        console.log('Adding industry');
        industries.push({
          name: data.name,
          licenses: [data.license]
        });
      }
      userIndustry = await UserIndustries.findOneAndUpdate({ user_id },{ industries });
    } else {
      console.log('Create industry');
      var industries = [{
        name: data.name,
        licenses: data.license
      }];
      userIndustry = await UserIndustries.create({ user_id, industries });
    }
    var userIndustries = await UserIndustries.findOne({ user_id }).exec();
    var industries = userIndustries.industries;
    for (var i = industries.length - 1; i >= 0; i--) {
      if (industries[i].name === data.name) {
        for (var j = industries[i].licenses.length - 1; j >= 0; j--) {
          if ((data.license._id && industries[i].licenses[j]._id.toString() === data.license._id) || (!data.license._id && industries[i].licenses[j].country?.name === data.license.country?.name && industries[i].licenses[j].state?.name === data.license.state?.name)) {
            return industries[i].licenses[j];
          }
        }
      }
    }
  },
  deleteUserIndustryLicense: async function (id, user_id) {
    let userIndustryLicenses = await UserIndustries.findOne({ user_id }).exec();
    if (userIndustryLicenses !== null) {
      for (var i = 0; i < userIndustryLicenses.industries.length; i++) {
        for (var j = userIndustryLicenses.industries[i].licenses.length - 1; j >= 0; j--) {
          if (userIndustryLicenses.industries[i].licenses[j]._id.toString() === id) {
            userIndustryLicenses.industries[i].licenses.splice(j,1);
            if (userIndustryLicenses.industries[i].licenses.length === 0) {
              userIndustryLicenses.industries.splice(1,1);
            }
            await UserIndustries.findOneAndUpdate({ user_id },{ industries: userIndustryLicenses.industries });
            return "Deleted industry license"
          }
        }
      }
    }
    throw new Error("Not found");
  },
  getUserIndustryLicenses: async function (page,filters,user_id) {
    try {
      console.log('Page',page);
      console.log('Filters',filters);
      console.log('User_id',user_id);
      let userIndustryLicenses = await UserIndustries.findOne({ user_id }).exec();
      if (!userIndustryLicenses || !userIndustryLicenses.industries.length) {
        return {
          licenses: [],
          pagination: {
            page: 1,
            last_page: 0
          }
        }
      }
      var licences = [];
      for (var i = 0; i < userIndustryLicenses.industries.length; i++) {
        licences.push(...userIndustryLicenses.industries[i].licenses);
      }
      for (var i = 0; i < licences.length; i++) {
        if (licences[i].detail.expiration_date && licences[i].detail.expiration_date < Number(new Date()) / 1000) {
          if (licences[i].detail.is_renewed && Number(new Date()) / 1000 < licences[i].detail.extended_date) {
            licences[i].detail.is_expired = false;
          } else {
            licences[i].detail.is_expired = true;
          }
        } else {
          licences[i].detail.is_expired = false;
        }
        console.log('License',licences[i]);
      }
      for (key in filters) {
        if (key !== 'search' && key !== 'status') {
          var name;
          switch (key) {
            case 'states':
              name = 'state';
              break;
            case 'countries':
              name = 'country';
              break;
            case 'industries':
              name = 'industry';
              break;
            case 'professions':
              name = 'profession';
              break;
          }
          for (var i = licences.length - 1; i >= 0; i--) {
            if (filters[key] && filters[key].length) {
              var found = false;
              for (var j = 0; j < filters[key].length; j++) {
                if (licences[i][name] && licences[i][name].name === filters[key][j]) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                licences.splice(i,1);
              }
            }
          }
        } else if (key === 'search') {
          for (var i = licences.length - 1; i >= 0; i--) {
            if (filters[key] && filters[key].length) {
              var found = false;
              for (var j = 0; j < filters[key].length; j++) {
                if ((licences[i].name && licences[i].name.toLowerCase().includes(filters[key].toLowerCase())) || (licences[i].state && licences[i].state.name.toLowerCase().includes(filters[key].toLowerCase())) || (licences[i].country && licences[i].country.name.toLowerCase().includes(filters[key].toLowerCase())) || (licences[i].industry && licences[i].industry.name.toLowerCase().includes(filters[key].toLowerCase())) || (licences[i].profession && licences[i].profession.name.toLowerCase().includes(filters[key].toLowerCase())) || (licences[i].detail && licences[i].detail.license_number && licences[i].detail.license_number.toLowerCase().includes(filters[key].toLowerCase()))) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                licences.splice(i,1);
              }
            }
          }
        } else if (key === 'status' && filters[key].length < 2) {
          for (var i = licences.length - 1; i >= 0; i--) {
            if (filters[key].length > 1) {
              break;
            } else if (filters[key][0]?.toLowerCase() === 'active' && (licences[i].detail.is_expired || licences[i].detail.is_active)) {
              licences.splice(i,1);
            } else if (filters[key][0]?.toLowerCase() === 'expired' && !licences[i].detail.is_expired && !licences[i].detail.is_active) {
              licences.splice(i,1);
            }
          }
        }
      }
      var l = Math.ceil(licences.length / 10);
      if (page > l) {page = l;}
      var p = !page ? 0 : Number(page) - 1;
      return {
        licences: licences.slice(p * 10,p * 10 + 10),
        pagination: {
          page: (!page ? 1 : page),
          last_page: l
        }
      };
    } catch(error) {
      console.error(error);
      throw new Error('Something went wrong');
    }
  },
  getUserIndustryLicensesByIndustry: async function (user_id) {
    try {
      console.log('User_id',user_id);
      let userIndustryLicenses = await UserIndustries.findOne({ user_id }).exec();
      if (!userIndustryLicenses || !userIndustryLicenses.industries.length) {
        return [];
      }
      var licences = [];
      for (var i = 0; i < userIndustryLicenses.industries.length; i++) {
        licences.push(...userIndustryLicenses.industries[i].licenses);
      }
      for (var i = 0; i < licences.length; i++) {
        console.log('License',licences[i]);
        if (licences[i].detail.expiration_date && licences[i].detail.expiration_date < Number(new Date()) / 1000) {
          if (licences[i].detail.is_renewed && Number(new Date()) / 1000 < licences[i].detail.extended_date) {
            licences[i].detail.is_expired = false;
          } else {
            licences[i].detail.is_expired = true;
          }
        } else {
          licences[i].detail.is_expired = false;
        }
      }
      var industries = [];
      for (var i = 0; i < licences.length; i++) {
        var found = false;
        for (var j = 0; j < industries.length; j++) {
          if (licences[i].industry._id === industries[j]._id) {
            industries[j].licenses.push(licences[i]);
            found = true;
            break;
          }
        }
        if (!found) {
          industries.push({
            _id: licences[i].industry._id,
            name: licences[i].industry.name,
            licenses: [licences[i]]
          });
        }
      }
      console.log('Industries',industries);
      return industries;
    } catch(error) {
      console.error(error);
      throw new Error(error);
    }
  },
  getIndustryUserLicenseById: async function (industryId, licenseId, user_id) {
    const getIndustries = await UserIndustries.findOne(
      { user_id: user_id },
      "industries"
    );
    const getIndustry = getIndustries.industries.filter(
      (industry) => industry._id.toString() === industryId.toString()
    );
    if (getIndustry.length === 0)
      throw new Error("No industry found related to user");

    const getLicense = getIndustry[0].licenses.filter(
      (industryLicense) =>
        industryLicense._id.toString() === licenseId.toString()
    );

    return getLicense[0];
  }
};

module.exports = IndustriesService;
