const UserProfessionalLicences = require("../configs/database/models/UserProfessionalLicences");

const UserProfessionalLicencesService = {
  getUserProfessionalLicences: async function (page,filters,user_id) {
    try {
      console.log('Page',page);
      console.log('Filters',filters);
      console.log('User_id',user_id);
      let licences = await UserProfessionalLicences.findOne({ user_id }).exec();
      if (!licences) {
        return {
          professional_licences: [],
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
            case 'professions':
              name = 'profession';
              break;
          }
          for (var i = licences.professional_licences.length - 1; i >= 0; i--) {
            if (filters[key] && filters[key].length) {
              var found = false;
              for (var j = 0; j < filters[key].length; j++) {
                if (licences.professional_licences[i][name] && licences.professional_licences[i][name].name === filters[key][j]) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                licences.professional_licences.splice(i,1);
              }
            }
          }
        } else if (key === 'search') {
          for (var i = licences.professional_licences.length - 1; i >= 0; i--) {
            if (filters[key] && filters[key].length) {
              var found = false;
              for (var j = 0; j < filters[key].length; j++) {
                if ((licences.professional_licences[i].name && licences.professional_licences[i].name.toLowerCase().includes(filters[key].toLowerCase())) || (licences.professional_licences[i].state && licences.professional_licences[i].state.name.toLowerCase().includes(filters[key].toLowerCase())) || (licences.professional_licences[i].country && licences.professional_licences[i].country.name.toLowerCase().includes(filters[key].toLowerCase())) || (licences.professional_licences[i].industry && licences.professional_licences[i].industry.name.toLowerCase().includes(filters[key].toLowerCase())) || (licences.professional_licences[i].profession && licences.professional_licences[i].profession.name.toLowerCase().includes(filters[key].toLowerCase())) || (licences.professional_licences[i].license_number && licences.professional_licences[i].license_number.toLowerCase().includes(filters[key].toLowerCase()))) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                licences.professional_licences.splice(i,1);
              }
            }
          }
        } else if (key === 'status' && filters[key].length < 2) {
          for (var i = licences.professional_licences.length - 1; i >= 0; i--) {
            if (filters[key].length > 1) {
              //Me pidio Active e Expired, asi que no filtramos
            } else if (filters[key][0] === 'Active') {
              if (!licences.professional_licences[i].is_renewed && (licences.professional_licences[i].expiration_date && licences.professional_licences[i].expiration_date < Number(new Date()))) {
                licences.professional_licences.splice(i,1);
              }
            } else if (filters[key][0] === 'Expired') {
              if (licences.professional_licences[i].is_renewed || (licences.professional_licences[i].expiration_date && Number(new Date()) <= licences.professional_licences[i].expiration_date)) {
                licences.professional_licences.splice(i,1);
              }
            }
          }
        }
      }
      var l = Math.ceil(licences.professional_licences.length / 10);
      if (page > l) {page = l;}
      var p = !page ? 0 : Number(page) - 1;
      return {
        professional_licences: licences.professional_licences.slice(p * 10,p * 10 + 10),
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
  getUserProfessionalLicenseById: async function (id,user_id) {
    let userProfessionalLicences = await UserProfessionalLicences.findOne({ user_id }).exec();
    if (userProfessionalLicences !== null) {
      for (var i = 0; i < userProfessionalLicences.professional_licences.length; i++) {
        if (userProfessionalLicences.professional_licences[i]._id.toString() === id) {
          return userProfessionalLicences.professional_licences[i];
        }
      }
    }
    throw new Error('Not Found');
    
  },
  saveUserProfessionalLicense: async function (data, user_id) {
    var userProfessionalLicences = await UserProfessionalLicences.findOne({ user_id }).exec();
    if (userProfessionalLicences !== null) {
      var found = false;
      for (var i = 0; i < userProfessionalLicences.professional_licences.length; i++) {
        if (userProfessionalLicences.professional_licences[i]._id.toString() === data._id) {
          found = true;
          if (!userProfessionalLicences.professional_licences[i].is_renewed && data.is_renewed) {
            console.log('Renewing licence');
            userProfessionalLicences.professional_licences[i].is_renewed = true;
            await userProfessionalLicences.save();
            data._id = undefined;
            await UserProfessionalLicences.updateOne({ user_id },{ $push: { professional_licences: data } });
          } else {
            console.log('Updating licence');
            userProfessionalLicences.professional_licences[i] = data;
            await userProfessionalLicences.save();
          }
          break;
        }
      }
      if (!found) {
        await UserProfessionalLicences.updateOne({ user_id },{ $push: { professional_licences: data } });
        console.log('Added licence');
      }
    } else {
      await UserProfessionalLicences.create({ user_id, professional_licences: data });
      console.log('Created licence');
    }
    var userProfessionalLicences = await UserProfessionalLicences.findOne({ user_id }).exec();
    return userProfessionalLicences.professional_licences[userProfessionalLicences.professional_licences.length - 1];
  },
  deleteUserProfessionalLicense: async function (id, user_id) {
    let userProfessionalLicences = await UserProfessionalLicences.findOne({ user_id }).exec();
    if (userProfessionalLicences !== null) {
      await userProfessionalLicences.professional_licences.pull({ _id: id });
      await userProfessionalLicences.save();
    }
    return "Deleted professional license"
  }
};

module.exports = UserProfessionalLicencesService;