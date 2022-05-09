const Terms = require("../configs/database/models/Terms");

const TermsService = {
  UpdateTerms: async function (data) {
    const ToUpdate = {};
    if (data.privacy_policy) {
      ToUpdate.privacy_policy = data.privacy_policy;
      ToUpdate.privacy_policy_updated = new Date();
    }
    if (data.terms_of_service) {
      ToUpdate.terms_of_service = data.terms_of_service;
      ToUpdate.terms_of_service_updated = new Date();
    }
    if (data.payment_agreement) {
      ToUpdate.payment_agreement = data.payment_agreement;
      ToUpdate.payment_agreement_updated = new Date();
    }
    if (data.our_story) {
      ToUpdate.our_story = data.our_story;
    }
    return Terms.findOneAndUpdate({}, ToUpdate, {
      upsert: true,
      new: true,
    }).exec();
  },
  terms: async function () {
    return Terms.findOne().exec();
  },
};

module.exports = TermsService;
