const DeaLicense = require("../configs/database/models/DeaLicense");
const UserDeaLicenses = require("../configs/database/models/UserDeaLicenses");

const DeaLicensesService = {
  getDeaLicenseById: async function (id) {
    return DeaLicense.findById(id).exec();
  },
  getAllDeaLicenses: async function (page,filters) {
    console.log('Page',page);
    console.log('Filters',filters);
    var f = {};
    if (filters) {
      if (typeof filters.search !== 'undefined') {
        f.name = { $regex: filters.search, $options: 'i' };
      }
      if (typeof filters.states !== 'undefined' && filters.states.length) {
        f['state.name'] = {$in: filters.states};
      }
      if (typeof filters.countries !== 'undefined' && filters.countries.length) {
        f['country.name'] = {$in: filters.countries};
      }
      if (typeof filters.industries !== 'undefined' && filters.industries.length) {
        f['industry.name'] = {$in: filters.industries};
      }
      if (typeof f.name === 'undefined' && typeof f['state.name'] === 'undefined' && typeof f['country.name'] === 'undefined' && typeof f['industry.name'] === 'undefined') {
        f = undefined;
      }
    }
    console.log('F',f);
    var count = await DeaLicense.countDocuments(f).exec();
    console.log('Count',count);
    var l = Math.ceil(count / 10);
    if (page > l) {page = l;}
    var p = !page ? 0 : Number(page) - 1;
    return {
      dea_licenses: DeaLicense.find(f).skip(p*10).limit(10).exec(),
      pagination: {
        page: (!page ? 1 : page),
        last_page: l
      }
    };
  },
  getDeaLicensesByUser: async function (page,filters,user_id) {
    console.log('Page',page);
    console.log('Filters',filters);
    console.log('User_id',user_id);
    let licences = await UserDeaLicenses.findOne({ user_id }).exec();
    if (!licences) {
      return {
        dea_licenses: [],
        pagination: {
          page: 1,
          last_page: 0
        }
      }
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
        }
        for (var i = licences.dea_licenses.length - 1; i >= 0; i--) {
          if (filters[key] && filters[key].length) {
            var found = false;
            for (var j = 0; j < filters[key].length; j++) {
              if (licences.dea_licenses[i].license[name] && licences.dea_licenses[i].license[name].name === filters[key][j]) {
                found = true;
                break;
              }
            }
            if (!found) {
              licences.dea_licenses.splice(i,1);
            }
          }
        }
      } else if (key === 'search') {
        for (var i = licences.dea_licenses.length - 1; i >= 0; i--) {
          if (filters[key] && filters[key].length) {
            var found = false;
            for (var j = 0; j < filters[key].length; j++) {
              if ((licences.dea_licenses[i].license.name && licences.dea_licenses[i].license.name.toLowerCase().includes(filters[key].toLowerCase())) || (licences.dea_licenses[i].license.state && licences.dea_licenses[i].license.state.name.toLowerCase().includes(filters[key].toLowerCase())) || (licences.dea_licenses[i].license.country && licences.dea_licenses[i].license.country.name.toLowerCase().includes(filters[key].toLowerCase())) || (licences.dea_licenses[i].license.industry && licences.dea_licenses[i].license.industry.name.toLowerCase().includes(filters[key].toLowerCase())) || (licences.dea_licenses[i].detail.dea_license_number && licences.dea_licenses[i].detail.dea_license_number.toLowerCase().includes(filters[key].toLowerCase()))) {
                found = true;
                break;
              }
            }
            if (!found) {
              licences.dea_licenses.splice(i,1);
            }
          }
        }
      } else if (key === 'status' && filters[key].length < 2) {
        for (var i = licences.dea_licenses.length - 1; i >= 0; i--) {
          if (filters[key][0]?.toLowerCase() === 'active') {
            if (licences.dea_licenses[i].detail && licences.dea_licenses[i].detail.expiration_date < Number(new Date()) / 1000) {
              licences.dea_licenses.splice(i,1);
            }
          } else if (filters[key][0]?.toLowerCase() === 'expired') {
            if (licences.dea_licenses[i].detail && Number(new Date()) / 1000 <= licences.dea_licenses[i].detail.expiration_date) {
              licences.dea_licenses.splice(i,1);
            }
          }
        }
      }
    }
    var l = Math.ceil(licences.dea_licenses.length / 10);
    if (page > l) {page = l;}
    var p = !page ? 0 : Number(page) - 1;
    return {
      dea_licenses: licences.dea_licenses.slice(p * 10,p * 10 + 10),
      pagination: {
        page: (!page ? 1 : page),
        last_page: l
      }
    };
  },
  createDeaLicense: async function (data, page) {
    console.log('Data',data);
    if (data._id) {
      return DeaLicense.findOneAndUpdate({_id:data._id},data);
    } else {
      return DeaLicense.create(data);
    }
  },
  deleteLicenseToUser: async function (id, user_id, page) {
    let userDeaLicense = await UserDeaLicenses.findOne({ user_id }).exec();
    if (userDeaLicense !== null) {
      await userDeaLicense.dea_licenses.pull({ _id: id });
      await userDeaLicense.save();
    }
    return 'OK';
    /*const { dea_licenses } = await UserDeaLicenses.findOne(
      { user_id },
      "dea_licenses"
    );
    userDeaLicense = dea_licenses.map((deaLicense) => ({
      _id: deaLicense._id,
      license: deaLicense.license,
      detail: deaLicense.detail,
    }));
    var l = Math.ceil(userDeaLicense.length / 10);
    if (page > l) {page = l;}
    var p = !page ? 0 : Number(page) - 1;
    return {
      dea_licenses: userDeaLicense.slice(p * 10,p * 10 + 10),
      pagination: {
        page: (!page ? 1 : page),
        last_page: l
      }
    };*/
  },
  addDeaLicenseToUser: async function (id, user_id, data, page) {
    console.log('Data',data);
    var licence;
    var userDeaLicense = await UserDeaLicenses.findOne({ user_id }).exec();
    if (userDeaLicense !== null) {
      var found = false;
      for (var i = 0; i < userDeaLicense.dea_licenses.length; i++) {
        if (userDeaLicense.dea_licenses[i]._id.toString() === id) {
          userDeaLicense.dea_licenses[i].license = data.license;
          userDeaLicense.dea_licenses[i].detail = data.detail;
          licence = await userDeaLicense.save();
          console.log('Updated licence');
          return userDeaLicense.dea_licenses[i];
        }
      }
      if (!found) {
        await UserDeaLicenses.updateOne({ user_id },{ $push: { dea_licenses: data } });
        console.log('Added licence');
      }
    } else {
      await UserDeaLicenses.create({ user_id, dea_licenses: data });
      console.log('Created licence');
    }
    var userDeaLicense = await UserDeaLicenses.findOne({ user_id }).exec();
    return userDeaLicense.dea_licenses[userDeaLicense.dea_licenses.length - 1];
    /*const { dea_licenses } = await UserDeaLicenses.findOne(
      { user_id },
      "dea_licenses"
    );
    userDeaLicense = dea_licenses.map((deaLicense) => ({
      _id: deaLicense._id,
      license: deaLicense.license,
      detail: deaLicense.detail,
    }));
    var l = Math.ceil(userDeaLicense.length / 10);
    if (page > l) {page = l;}
    var p = !page ? 0 : Number(page) - 1;
    return {
      dea_licenses: userDeaLicense.slice(p * 10,p * 10 + 10),
      pagination: {
        page: (!page ? 1 : page),
        last_page: l
      }
    };*/
  },
};

module.exports = DeaLicensesService;