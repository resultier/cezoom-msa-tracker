const Membership = require("../configs/database/models/Membership");
const UserMemberships = require("../configs/database/models/UserMemberships");

const MembershipService = {
  memberships: async function (page,filters) {
    console.log('Page',page);
    console.log('Filters',filters);
    var f = {};
    if (filters) {
      if (typeof filters.search !== 'undefined') {
        f.name = { $regex: filters.search, $options: 'i' };
      }
      if (typeof filters.required !== 'undefined') {
        f.required = filters.required;
      }
      if (typeof f.name === 'undefined' && typeof f.required === 'undefined') {
        f = undefined;
      }
    }
    console.log('F',f);
    var count = await Membership.countDocuments(f).exec();
    console.log('Count',count);
    var l = Math.ceil(count / 10);
    if (page > l) {page = l;}
    var p = !page ? 0 : Number(page) - 1;
    return {
      memberships: Membership.find(f).skip(p*10).limit(10).exec(),
      pagination: {
        page: (!page ? 1 : page),
        last_page: l
      }
    };
  },
  membership: async function (id) {
    return Membership.findById(id);
  },
  userMemberships: async function (page,filters,user_id) {
    console.log('Page',page);
    console.log('Filters',filters);
    console.log('User_id',user_id);
    let user_memberships = await UserMemberships.findOne({ user_id }).exec();
    if (!user_memberships) {
      return {
        memberships: [],
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
        for (var i = user_memberships.memberships.length - 1; i >= 0; i--) {
          if (filters[key] && filters[key].length) {
            var found = false;
            for (var j = 0; j < filters[key].length; j++) {
              console.log(user_memberships.memberships[i].membership[name].name,filters[key][j]);
              if (user_memberships.memberships[i].membership[name] && user_memberships.memberships[i].membership[name].name === filters[key][j]) {
                found = true;
                break;
              }
            }
            if (!found) {
              user_memberships.memberships.splice(i,1);
            }
          }
        }
      } else if (key === 'search') {
        for (var i = user_memberships.memberships.length - 1; i >= 0; i--) {
          if (filters[key] && filters[key].length) {
            var found = false;
            for (var j = 0; j < filters[key].length; j++) {
              if ((user_memberships.memberships[i].membership.name && user_memberships.memberships[i].membership.name.toLowerCase().includes(filters[key].toLowerCase())) || (user_memberships.memberships[i].membership.state && user_memberships.memberships[i].membership.state.name.toLowerCase().includes(filters[key].toLowerCase())) || (user_memberships.memberships[i].membership.country && user_memberships.memberships[i].membership.country.name.toLowerCase().includes(filters[key].toLowerCase())) || (user_memberships.memberships[i].membership.industry && user_memberships.memberships[i].membership.industry.name.toLowerCase().includes(filters[key].toLowerCase())) || (user_memberships.memberships[i].detail.membership_number && user_memberships.memberships[i].detail.membership_number.toLowerCase().includes(filters[key].toLowerCase()))) {
                found = true;
                break;
              }
            }
            if (!found) {
              user_memberships.memberships.splice(i,1);
            }
          }
        }
      } else if (key === 'status' && filters[key].length < 2) {
        for (var i = user_memberships.memberships.length - 1; i >= 0; i--) {
          if (filters[key][0]?.toLowerCase() === 'active') {
            if (user_memberships.memberships[i].detail && user_memberships.memberships[i].detail.expiration_date < Number(new Date()) / 1000) {
              user_memberships.memberships.splice(i,1);
            }
          } else if (filters[key][0]?.toLowerCase() === 'expired') {
            if (user_memberships.memberships[i].detail && Number(new Date()) / 1000 <= user_memberships.memberships[i].detail.expiration_date) {
              user_memberships.memberships.splice(i,1);
            }
          }
        }
      }
    }
    var l = Math.ceil(user_memberships.memberships.length / 10);
    if (page > l) {page = l;}
    var p = !page ? 0 : Number(page) - 1;
    return {
      memberships: user_memberships.memberships.slice(p * 10,p * 10 + 10),
      pagination: {
        page: (!page ? 1 : page),
        last_page: l
      }
    };
  },
  saveMembership: async function (data) {
    console.log('Data',data)
    if (data._id) {
      return await Membership.findOneAndUpdate({_id:data._id},data);
    } else {
      return await Membership.create(data);
    }
  },
  deleteMembership: async function (id) {
    await Membership.findByIdAndRemove(id);
    return 'Deleted membership';
    
  },
  saveUserMembership: async function (data,user_id) {
    console.log('User',user_id);
    console.log('Data',data);
    var membership;
    var userMemberships = await UserMemberships.findOne({ user_id }).exec();
    if (userMemberships !== null) {
      var found = false;
      for (var i = 0; i < userMemberships.memberships.length; i++) {
        if (userMemberships.memberships[i]._id.toString() === data._id) {
          userMemberships.memberships[i].membership = data.membership;
          userMemberships.memberships[i].detail = data.detail;
          membership = await userMemberships.save();
          console.log('Updated membership');
          return userMemberships.memberships[i];
        }
      }
      found = false;
      if (!found) {
        await UserMemberships.updateOne({ user_id },{ $push: { memberships: data } });
        console.log('Added membership');
      }
    } else {
      await UserMemberships.create({ user_id, memberships: data });
      console.log('Created membership');
    }
    var userMemberships = await UserMemberships.findOne({ user_id }).exec();
    return userMemberships.memberships[userMemberships.memberships.length - 1];
  },
  deleteUserMembership: async function (id, user_id) {
    let userMemberships = await UserMemberships.findOne({ user_id }).exec();
    if (userMemberships !== null) {
      await userMemberships.memberships.pull({ _id: id });
      await userMemberships.save();
    }
    return 'Deleted user membership';
  }
};

module.exports = MembershipService;
