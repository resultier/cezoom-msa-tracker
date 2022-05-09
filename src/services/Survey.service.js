const QuestionAnswer = require("../configs/database/models/QuestionAnswer");
const Question = require("../configs/database/models/Question");
const Survey = require("../configs/database/models/Survey");
const UserSurvey = require("../configs/database/models/UserSurvey");
const UserService = require("./UserService");
const axios = require('axios');

const SurveyService = {
  getSurveys: async function (page,filters) {
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
    var count = await Survey.countDocuments(f).exec();
    console.log('Count',count);
    var l = Math.ceil(count / 10);
    if (page > l) {page = l;}
    var p = !page ? 0 : Number(page) - 1;
    return {
      surveys: Survey.find(f).skip(p*10).limit(10).exec(),
      pagination: {
        page: (!page ? 1 : page),
        last_page: l
      }
    };
  },
  getSurveysByCourse: async function (id,page,filters) {
    console.log('Page',page);
    console.log('Filters',filters);
    var f = {
      course_id: id
    };
    if (filters) {
      if (typeof filters.search !== 'undefined') {
        f.name = { $regex: filters.search, $options: 'i' };
      }
      if (typeof filters.required !== 'undefined') {
        f.required = filters.required;
      }
    }
    console.log('F',f);
    var count = await Survey.countDocuments(f).exec();
    console.log('Count',count);
    var l = Math.ceil(count / 10);
    if (page > l) {page = l;}
    var p = !page ? 0 : Number(page) - 1;
    return {
      surveys: Survey.find(f).skip(p*10).limit(10).exec(),
      pagination: {
        page: (!page ? 1 : page),
        last_page: l
      }
    };
  },
  getAllSurveyByUser: async function (page,filters,user,token) {
    console.log('User',user);
    console.log('Page',page);
    console.log('Filters',filters);
    var courses = await UserService.getEnrolledCourses(token);
    console.log('Courses',courses);
    var courses_ids = [];
    for (var i = 0; i < courses.length; i++) {
      courses_ids.push(courses[i].id);
    }
    console.log('Courses',courses_ids);
    var f = {
      course_id: {$in: courses_ids}
    };
    if (filters) {
      if (typeof filters.search !== 'undefined') {
        f.name = { $regex: filters.search, $options: 'i' };
      }
      if (typeof filters.required !== 'undefined') {
        f.required = filters.required;
      }
    }
    console.log('F',f);
    var count = await Survey.countDocuments(f).exec();
    var l = Math.ceil(count / 10);
    if (page > l) {page = l;}
    var p = !page ? 0 : Number(page) - 1;
    var surveys = await Survey.find(f).skip(p*10).limit(10).exec();
    for (var i = 0; i < surveys.length; i++) {
      var userSurvey = await UserSurvey.findOne({user_id: user.id,survey_id: surveys[i]._id}).exec();
      if (userSurvey) {
        surveys[i].progress = userSurvey.progress;
        surveys[i].completed = userSurvey.completed;
      }
    }
    for (var i = surveys.length - 1; i >= 0; i--) {
      if (surveys[i].completed) {
        surveys.splice(i,1);
      }
    }
    return {
      surveys: surveys,
      pagination: {
        page: (!page ? 1 : page),
        last_page: l
      }
    };
  },
  getUserSurveysByIds: async function(user_id,surveys_ids){
    var surveys = await Survey.find({ '_id': { $in: surveys_ids } });
    for (var i = 0; i < surveys.length; i++) {
      var userSurvey = await UserSurvey.findOne({user_id: user_id,survey_id: surveys[i]._id}).exec();
      if (userSurvey) {
        surveys[i].completed = userSurvey.completed;
        surveys[i].progress = userSurvey.progress;
      }
    }
    return surveys;
  },
  getSurvey: async function (id,user) {
    var survey = await Survey.findById(id).exec();
    console.log('Presenter',survey.presenters)
    survey.questions = await Question.find({survey_id: id}).sort('order').exec();
    console.log(survey.questions)
    var answers = await QuestionAnswer.find({
      user_id: user.id,
      survey_id: id
    });
    for (var i = 0; i < survey.questions.length; i++) {
      for (var j = 0; j < answers.length; j++) {
        if (survey.questions[i]._id.toString() === answers[j].question_id) {
          survey.questions[i].user_answer = answers[j].answer;
          break;
        }
      }
    }
    var userSurvey = await UserSurvey.findOne({user_id: user.id,survey_id: id}).exec();
    if (userSurvey) {
      survey.progress = userSurvey.progress;
      survey.completed = userSurvey.completed;
    }
    return survey;
  },
  saveSurvey: async function (data) {
    if (data.deadline && new Date(data.deadline * 1000) < new Date()) {
      throw new Error('Invalid deadline');
    }
    var survey;
    if (data._id) {
      survey = await Survey.findOneAndUpdate({_id:data._id},data);
    } else {
      survey = await Survey.create(data);
    }
    return survey;
  },
  saveSurveyQuestion: async function (data) {
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
    if (data._id) {
      return Question.findOneAndUpdate({_id:data._id},data);
    } else {
      return Question.create(data);
    }
  },
  answerSurveyQuestion: async function (data,user) {
    data.user_id = user.id;
    var question = await Question.findById(data.question_id).exec();
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
      }
    }
    data.survey_id = question.survey_id;
    var userAnswer = await QuestionAnswer.findOneAndUpdate({
      user_id: user.id,
      question_id: data.question_id,
      survey_id: data.survey_id,
    },data);
    if (!userAnswer) {
      userAnswer = await QuestionAnswer.create(data);
    }
    question.user_answer = userAnswer.answer;
    console.log('Answer',question.user_answer);
    var survey = await Survey.findById(data.survey_id).exec();
    survey.questions = await Question.find({survey_id: data.survey_id});
    var answers = await QuestionAnswer.find({
      user_id: user.id,
      survey_id: data.survey_id
    }).exec();
    var userSurvey = await UserSurvey.findOne({user_id: user.id,survey_id: data.survey_id}).exec();
    if (!userSurvey) {
      userSurvey = await UserSurvey.create({
        user_id: user.id,
        survey_id: data.survey_id
      });
    }
    await UserSurvey.findOneAndUpdate({user_id: user.id,survey_id: data.survey_id},{progress:Math.ceil(answers.length / survey.questions.length * 100)});
    return question;
  },
  finishSurvey: async function (survey_id,user_id) {
    console.log('Survey',survey_id);
    console.log('User',user_id);
    var survey = await Survey.findById(survey_id).exec();
    var questions = await Question.find({survey_id: survey_id});
    var answers = await QuestionAnswer.find({ user_id, survey_id }).exec();
    console.log(answers);
    var complete = false;
    for (var i = 0; i < questions.length; i++) {
      var found = false;
      for (var j = 0; j < answers.length; j++) {
        if (questions[i]._id.toString() === answers[j].question_id) {
          found = true;
          break;
        }
      }
      if (!found && questions[i].required) {
        complete = false;
        throw new Error('Required question missing')
      }
    }
    await UserSurvey.findOneAndUpdate({ user_id, survey_id },{
      progress: Math.ceil(answers.length / questions.length * 100),
      completed: true
    });
    return true;
  }
};

module.exports = SurveyService;