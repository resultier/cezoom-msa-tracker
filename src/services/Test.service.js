const QuestionAnswer = require("../configs/database/models/QuestionAnswer");
const Question = require("../configs/database/models/Question");
const Test = require("../configs/database/models/Test");
const UserTest = require("../configs/database/models/UserTest");
const UserService = require("./UserService");
const axios = require('axios');

const TestService = {
  getTests: async function (page,user_id,company_id,course_id,filters,token) {
    console.log('Page',page);
    console.log('Filters',filters);
    console.log('User',user_id);
    console.log('Course',course_id);
    console.log('Company',company_id);
    console.log('Token',token);
    var f = {};
    if (user_id) {
      var courses = await UserService.getEnrolledCourses(token);
      for (var i = 0; i < courses.length; i++) {
        courses[i] = courses[i].id;
      }
      f.course_id = {$in: courses}
    } else if (course_id) {
      f.course_id = course_id;
    } else if (company_id) {
      f.company_id = company_id;
    }
    if (filters) {
      if (typeof filters.search !== 'undefined') {
        f.name = { $regex: filters.search, $options: 'i' };
      }
      if (typeof filters.required !== 'undefined') {
        f.required = filters.required;
      }
      if (filters.status?.length === 1) {
        f.status = filters.status[0].toLowerCase();
      }
      /*if (typeof f.name === 'undefined' && typeof f.required === 'undefined' && typeof f.status === 'undefined') {
        f = undefined;
      }*/
    }
    console.log('F',f);
    var count = await Test.countDocuments(f).exec();
    console.log('Count',count);
    var l = Math.ceil(count / 10);
    if (page > l) {page = l;}
    var p = !page ? 0 : Number(page) - 1;
    var tests = await Test.find(f).skip(p*10).limit(10).exec();
    if (user_id) {
      for (var i = 0; i < tests.length; i++) {
        var userTest = await UserTest.findOne({user_id: user_id,test_id: tests[i]._id}).exec();
        if (userTest) {
          tests[i].approved = userTest.approved;
          tests[i].attempts = userTest.attempts;
          tests[i].progress = userTest.progress;
          tests[i].grade = userTest.grade;
        }
      }
      for (var i = tests.length - 1; i >= 0; i--) {
        if (tests[i].approved || (tests[i].maximum_attempts && tests[i].attempts >= tests[i].maximum_attempts)) {
          tests.splice(i,1);
        }
      }
    }
    return {
      tests: tests,
      pagination: {
        page: (!page ? 1 : page),
        last_page: l
      }
    };
  },
  getUserTestsByIds: async function(user_id,test_ids){
    var tests = await Test.find({ '_id': { $in: test_ids } });
    for (var i = 0; i < tests.length; i++) {
      var userTest = await UserTest.findOne({user_id: user_id,test_id: tests[i]._id}).exec();
      if (userTest) {
        tests[i].approved = userTest.approved;
        tests[i].attempts = userTest.attempts;
        tests[i].progress = userTest.progress;
        tests[i].grade = userTest.grade;
      }
    }
    return tests;
  },
  getTest: async function (id,user) {
    console.log('ID',id)
    var test = await Test.findById(id).exec();
    if (!test) {
      throw new Error('Test not found');
    }
    test.questions = await Question.find({test_id: id}).sort('order').exec();
    console.log('Questions',test.questions);
    var answers = await QuestionAnswer.find({
      user_id: user.id,
      test_id: id
    });
    for (var i = 0; i < test.questions.length; i++) {
      for (var j = 0; j < answers.length; j++) {
        if (test.questions[i]._id.toString() === answers[j].question_id) {
          test.questions[i].user_answer = answers[j].answer;
          break;
        }
      }
      test.questions[i].answer = [];
    }
    var userTest = await UserTest.findOne({user_id: user.id,test_id: test._id}).exec();
    if (userTest) {
      test.approved = userTest.approved;
      test.attempts = userTest.attempts;
      test.progress = userTest.progress;
      test.grade = userTest.grade;
      if (test.progress > 0) {
        console.log('Continuing test');
      } else {
        console.log('Starting test');
        await UserTest.findOneAndUpdate({user_id: user.id,test_id: id},{
          started_at: Number(new Date()),
          finished_at: undefined
        });
      }
    } else {
      console.log('Creating and starting test');
      userTest = await UserTest.create({
        user_id: user.id,
        test_id: id,
        attempts: 0,
        started_at: Number(new Date())
      });
    }
    return test;
  },
  saveTest: async function (data) {
    console.log('Test',data);
    if (data.deadline && new Date(data.deadline * 1000) < new Date()) {
      throw new Error('Invalid deadline');
    }
    var test;
    if (data._id) {
      test = await Test.findOneAndUpdate({_id:data._id},data);
    } else {
      test = await Test.create(data);
    }
    return test;
  },
  saveTestQuestion: async function (data) {
    console.log('Question',data);
    switch (data.type) {
      case 'matrix_grid':
      case 'matching_questions':
        if (!data.keys || !data.keys.length || !data.options || !data.options.length || data.options.length === 1) {
          throw new Error('Invalid format for: ' + data.type);
        }
        break;
      case 'multiple_text_boxes':
        if (!data.keys || !data.keys.length || data.keys.length === 1 || (data.options && data.options.length)) {
          throw new Error('Invalid format for: ' + data.type);
        }
        break;
      case 'pic_choice':
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
  answerTestQuestion: async function (data,user) {
    data.user_id = user.id;
    var question = await Question.findById(data.question_id).exec();
    if (!question) {
      throw new Error('Not found');
    }
    data.test_id = question.test_id;
    var test = await Test.findById(data.test_id).exec();
    var userTest = await UserTest.findOne({user_id: user.id,test_id: data.test_id}).exec();
    if (!userTest) {
      throw new Error('Test was not started');
    }
    /*if (test.maximum_time && Number(userTest.started_at) + test.maximum_time * 60000 < Number(new Date())) {
      throw new Error('Maximum time reached');
    }*/
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
      user_id: user.id,
      question_id: data.question_id,
      test_id: data.test_id,
    },data);
    if (!userAnswer) {
      userAnswer = await QuestionAnswer.create(data);
    }
    question.user_answer = userAnswer.answer;
    console.log('Answer',question.user_answer);
    test.questions = await Question.find({test_id: data.test_id});
    var answers = await QuestionAnswer.find({
      user_id: user.id,
      test_id: data.test_id
    }).exec();
    await UserTest.findOneAndUpdate({user_id: user.id,test_id: data.test_id},{progress:Math.ceil(answers.length / test.questions.length * 100)});
    return question;
  },
  finishTest: async function (id,user) {
    var test = await Test.findById(id).exec();
    if (!test) {
      throw new Error('Test not found');
    }
    var userTest = await UserTest.findOne({user_id: user.id,test_id: id}).exec();
    if (!userTest) {
      throw new Error('Test was not started');
    }
    if (test.maximum_attempts && userTest.attempts + 1 > test.maximum_attempts) {
      throw new Error('Max attempts reached');
    }
    test.questions = await Question.find({test_id: id});
    console.log('Questions',test.questions);
    var answers = await QuestionAnswer.find({
      user_id: user.id,
      test_id: id
    }).exec();
    console.log('Answers',answers);
    var correct_questions = 0;
    for (var i = 0; i < test.questions.length; i++) {
      test.questions[i].user_answer = [];
      var correct = true;
      for (var j = 0; j < test.questions[i].answer.length; j++) {
        var found = false;
        for (var k = 0; k < answers.length; k++) {
          if (test.questions[i]._id.toString() === answers[k].question_id) {
            test.questions[i].user_answer = answers[k].answer;
            for (var l = 0; l < answers[k].answer.length; l++) {
              var valid = false;
              if ((!test.questions[i].answer[j].key || test.questions[i].answer[j].key === answers[k].answer[l].key) && (!test.questions[i].answer[j].value || test.questions[i].answer[j].value === answers[k].answer[l].value)) {
                found = true;
                break;
              }
            }
          }
        }
        if (!found) {
          correct = false;
          break;
        }
      }
      if (correct) {
        test.questions[i].user_correct = true;
        correct_questions += 1;
      } else {
        test.questions[i].user_correct = false;
      }
      test.questions[i].answer = [];
    }
    var approved = false;
    var grade = Math.ceil(correct_questions / test.questions.length * 100);
    if (test.minimum_grade <= grade) {
      approved = true;
    }
    await UserTest.findOneAndUpdate({user_id: user.id,test_id: id},{
      progress: 0,
      approved: approved,
      grade: grade,
      finished_at: Number(new Date()),
      attempts: userTest.attempts + 1
    });
    await QuestionAnswer.deleteMany({user_id: user.id, test_id: id});
    return {
      attempts: userTest.attempts + 1,
      maximum_attempts: test.maximum_attempts,
      approved: approved,
      grade: grade,
      questions: test.questions
    };
  },
  getTestAtendees: async function (test_id,page,filters,token) {
    console.log('Page',page);
    console.log('Filters',filters);
    console.log('Test ID',test_id);
    var test = await Test.findById(test_id).exec();
    console.log('Test',test);
    if (!test) {
      throw new Error('Test not found');
    }
    var attendees = await axios.get('https://courses.cezoom.resultier.dev/api/v1/company/course/attendees/'+test.course_id,{
      headers: {
        'authorization': token
      }
    });
    attendees = attendees.data;
    console.log('Attendees',attendees);
    var userTests = await UserTest.find({test_id}).skip().limit().exec();
    console.log('userTest',userTests);
    for (var i = 0; i < attendees.length; i++) {
      attendees[i]._id = attendees[i].user_id;
      attendees[i] = {
        user: attendees[i],
        test: test
      }
      for (var j = 0; j < userTests.length; j++) {
        console.log(userTests[j].user_id,attendees[i].user.user_id);
        if (userTests[j].user_id === attendees[i].user.user_id) {
          attendees[i].approved = userTests[j].approved;
          attendees[i].attempts = userTests[j].attempts;
          attendees[i].progress = userTests[j].progress;
          attendees[i].grade = userTests[j].grade;
          break;
        }
      }
    }
    var l = Math.ceil(attendees.length / 10);
    if (page > l) {page = l;}
    var p = !page ? 0 : Number(page) - 1;
    return {
      attendees: attendees.slice(p * 10,p * 10 + 10),
      pagination: {
        page: (!page ? 1 : page),
        last_page: l
      }
    };
  },
  getTestAtendeeAnswers: async function(user_id,test_id){
    console.log('UserId',user_id);
    console.log('TestId',test_id);
    var test = await Test.findById(test_id);
    if (!test) {
      throw new Error('Test not found');
    }
    test.questions = await Question.find({test_id}).sort('order').exec();
    var userAnswers = await QuestionAnswer.find({user_id,test_id});
    for (var i = 0; i < test.questions.length; i++) {
      for (var j = 0; j < userAnswers.length; j++) {
        if (test.questions[i]._id.toString() === userAnswers[j].question_id) {
          test.questions[i].user_answer = userAnswers[j].answer;
          break;
        }
      }
    }
    var userTest = await UserTest.findOne({user_id,test_id}).exec();
    if (userTest) {
      test.approved = userTest.approved;
      test.attempts = userTest.attempts;
      test.progress = userTest.progress;
      test.grade = userTest.grade;
    }
    return test;
  },
  getTestAnalytics: async function (test_id,page,filters,token) {
    try {
      console.log('Page',page);
      console.log('Filters',filters);
      console.log('Test ID',test_id);
      var test = await Test.findById(test_id).exec();
      console.log('Test',test);
      if (!test) {
        throw new Error('Test not found');
      }
      var course_attendees = await axios.get('https://courses.cezoom.resultier.dev/api/v1/company/course/attendees/'+test.course_id,{
        headers: {
          'authorization': token
        }
      });
      course_attendees = course_attendees.data;
      console.log('Course',course_attendees);
      var attendees = await UserTest.find({test_id}).exec();
      var approved = 0;
      var completed = 0;
      var incompleted = 0;
      var average_grade = 0;
      var average_attempts = 0;
      var average_time = 0;
      for (var i = 0; i < attendees.length; i++) {
        if (attendees[i].finished_at || attendees[i].attempts > 0) {
          completed += 1;
          average_grade += attendees[i].grade;
          average_attempts += attendees[i].attempts;
          average_time += (attendees[i].finished_at - attendees[i].started_at);
          if (attendees[i].approved) {
            approved += 1;
          }
        } else {
          incompleted += 1;
        }
      }
      return {
        attendees: course_attendees.length,
        approved: approved,
        completed: completed,
        incompleted: incompleted,
        average_grade: average_grade / completed || 0,
        average_attempts: average_attempts / completed || 0,
        average_time: average_time / completed || 0
      };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
};

module.exports = TestService;