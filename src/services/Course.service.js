const QuestionAnswer = require("../configs/database/models/QuestionAnswer");
const Question = require("../configs/database/models/Question");

const CoursePricing = require("../configs/database/models/CoursePricing");
const CourseSurvey = require("../configs/database/models/CourseSurvey");
const CourseProviders = require("../configs/database/models/CourseProviders");

const axios = require('axios');

const CourseService = {
  getPricing: async function (course_id) {
    console.log('course_id',course_id);
    var course_pricing = await CoursePricing.findOne({course_id}).exec();
    if (!course_pricing) {
      throw new Error("Course pricing not found");
    }
    return course_pricing;
  },
  getProviders: async function (course_id) {
    console.log('course_id',course_id);
    var course_providers = await CourseProviders.findOne({course_id}).exec();
    if (!course_providers) {
      throw new Error("Course providers not found");
    }
    return course_providers;
  },
  getSurvey: async function (course_id,user_id) {
    console.log('course_id',course_id);
    var course_survey = await CourseSurvey.findOne({course_id}).exec();
    if (!course_survey) {
      throw new Error("Course survey not found");
    }
    course_survey.questions = await Question.find({course_id}).sort('order').exec();
    console.log('questions',course_survey.questions);
    var answers = await QuestionAnswer.find({
      user_id,
      course_id: course_id
    });
    console.log('answers',answers);
    for (var i = 0; i < course_survey.questions.length; i++) {
      for (var j = 0; j < answers.length; j++) {
        if (course_survey.questions[i]._id.toString() === answers[j].question_id) {
          course_survey.questions[i].user_answer = answers[j].answer;
          break;
        }
      }
    }
    return course_survey;
  },
  saveCourseSurvey: async function (data) {
    var course_survey = await CourseSurvey.findOneAndUpdate({course_id:data.course_id},data);
    if (!course_survey) {
      course_survey = await CourseSurvey.create(data);
    }
    return course_survey;
  },
  saveCourseSurveyQuestion: async function (data) {
    switch (data.type) {
      case 'matrix_grid':
        if (!data.keys || !data.keys.length || !data.options || !data.options.length || data.options.length === 1) {
          throw new Error('Invalid format for: ' + data.type);
        }
        break;
      case 'multiple_text_boxes':
        if (!data.keys || !data.keys.length || data.keys.length === 1 || (data.options && data.options.length)) {
          throw new Error('Invalid format for: ' + data.type);
        }
        break;
      case 'rating_scale':
      case 'multiple_choice':
      case 'dropdown':
      case 'checkbox':
        if ((data.keys && data.keys.length) || !data.options.length || data.options.length === 1) {
          throw new Error('Invalid format for: ' + data.type);
        }
        break;
      case 'comment_box':
      case 'single_text_box':
        if ((data.keys && data.keys.length) || (data.options && data.options.length)) {
          throw new Error('Invalid format for: ' + data.type);
        }
        break;
      default:
        throw new Error('Invalid type: ' + data.type);
    }
    console.log('Question',data);
    if (data._id) {
      return Question.findOneAndUpdate({_id:data._id},data);
    } else {
      return Question.create(data);
    }
  },
  answerSurveyQuestion: async function (data,user_id) {
    data.user_id = user_id;
    var question = await Question.findById(data.question_id).exec();
    if (!question) {
      throw new Error('Course question not found');
    }
    data.course_id = question.course_id;
    var course_survey = await CourseSurvey.findOne({course_id: data.course_id}).exec();
     if (!course_survey) {
      throw new Error('Course survey not found');
    }
    for (var i = 0; i < data.answer.length; i++) {
      if (question.options.length) {
        var found = false;
        for (var j = 0; j < question.options.length; j++) {
          if (question.options[j] === data.answer[i].value) {
            found = true;
            break;
          }
        }
        if (!found) {
          throw new Error('Invalid answer value: ' + data.answer[i].value);
        }
      } else {
        data.answer[i].value = undefined;
      }
      if (question.keys.length) {
        var found = false;
        for (var j = 0; j < question.keys.length; j++) {
          if (question.keys[j] === data.answer[i].key) {
            found = true;
            break;
          }
        }
        if (!found) {
          throw new Error('Invalid answer key: ' + data.answer[i].key);
        }
        if (question.keys.length !== data.answer.length) {
          throw new Error('Missing answer keys');
        }
      } else {
        data.answer[i].key = undefined;
      }
    }
    var userAnswer = await QuestionAnswer.findOneAndUpdate({
      user_id: user_id,
      question_id: data.question_id,
      course_id: data.course_id,
    },data);
    if (!userAnswer) {
      userAnswer = await QuestionAnswer.create(data);
    }
    question.user_answer = userAnswer.answer;
    console.log('Answer',question.user_answer);
    return question;
  },
};

module.exports = CourseService;