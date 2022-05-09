const SurveyService = require("../../services/Survey.service");

module.exports = {
  Query: {
    surveys: (_source, { page, filters }, context) => {
      return SurveyService.getSurveys(page,filters);
    },
    survey: (_source, { id }, context) => {
      return SurveyService.getSurvey(id,context.user);
    },
    surveysByCourse: (_source, { id, page, filters }, context) => {
      return SurveyService.getSurveysByCourse(id,page,filters);
    },
    surveysByUser: (_source, { page, filters }, context) => {
      return SurveyService.getAllSurveyByUser(page,filters,context.user,context.token);
    },
    surveysByIds: (_source, { user_id, ids }, context) => {
      return SurveyService.getUserSurveysByIds(user_id,ids);
    },
  },
  Mutation: {
    survey: (_source, { input }, context) => {
      return SurveyService.saveSurvey(input);
    },
    surveyQuestion: (_source, { input }, context) => {
      return SurveyService.saveSurveyQuestion(input);
    },
    answerSurveyQuestion: (_source, { input }, context) => {
      return SurveyService.answerSurveyQuestion(input,context.user);
    },
    finishSurvey: (_source, { _id }, {user: { id } }) => {
      return SurveyService.finishSurvey(_id,id);
    }
  }
};