const CourseService = require("../../services/Course.service");

module.exports = {
  Query: {
    courseProviders: (_source, { _id }) => {
      return CourseService.getProviders(_id);
    },
    courseSurvey: (_source, { _id }, {user: { id } }) => {
      return CourseService.getSurvey(_id);
    },
    coursePricing: (_source, { id }) => {
      return CourseService.getPricing(_id);
    }
  },
  Mutation: {
    /*courseSaveProvider: (_source, { input }, context) => {
      return CourseService.saveProvider(input);
    },
    courseDeleteProvider: (_source, { _id }, context) => {
      return CourseService.deleteProvider(input);
    },
    courseSaveSurveyQuestion: (_source, { input }, context) => {
      return CourseService.saveSurveyQuestion(input);
    },
    courseDeleteSurveyQuestion: (_source, { input }, context) => {
      return CourseService.deleteSurveyQuestion(input);
    },*/
    courseAnswerSurveyQuestions:async  (_source, { answers }, {user: { id } }) => {
      for (var i = 0; i < answers.length; i++) {
        await CourseService.answerSurveyQuestion(answers,id);
      }
      return 'OK'
    },
  }
};