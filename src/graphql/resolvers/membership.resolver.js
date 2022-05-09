const MembershipService = require("../../services/MembershipService");

module.exports = {
  Query: {
    membership: (_source, { id }) => {
      return MembershipService.membership(id);
    },
    memberships: (page, filters) => {
      return MembershipService.memberships(page,filters);
    },
    userMemberships: (_source, { page, filters }, context) => {
      return MembershipService.userMemberships(page,filters,context.user.id);
    }
  },
  Mutation: {
    membership: (_source, { input }, context) => {
      return MembershipService.saveMembership(input);
    },
    deleteMembership: (_source, { id }, context) => {
      return MembershipService.deleteMembership(id);
    },
    userMembership: (_source, { input }, context) => {
      return MembershipService.saveUserMembership(input,context.user.id);
    },
    deleteUserMembership: (_source, { id }, context) => {
      return MembershipService.deleteUserMembership(id,context.user.id);
    }
  }
};