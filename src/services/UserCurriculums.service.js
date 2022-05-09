const logger = require("../configs/logs/logger");
const fs = require("fs");
const htmlToPdf = require("html-pdf-node");
const Mustache = require("mustache");
const UserCurriculums = require("../configs/database/models/UserCurriculums");
const { renderWorkExperience, renderEducationExperience, renderReference, renderLanguage, renderSkill } = require("../templates/ce/template-utils");

const UserCurriculumService = {
  getUserCurriculum: async function (id) {
    try {
      var userCurriculums = await UserCurriculums.findOne({'curriculums._id':id}).exec();
      for (var i = 0; i < userCurriculums?.curriculums?.length; i++) {
        if (userCurriculums.curriculums[i]._id.toString() === id) {
          return userCurriculums.curriculums[i];
        }
      }
      throw new Error('Not found');
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }

  },
  getUserCurriculums: async function (page,filters,user_id) {
    console.log('User_id',user_id);
    let userCurriculums = await UserCurriculums.findOne({ user_id }).exec();
    var curriculums = userCurriculums?.curriculums || [];
    if (!curriculums.length) {
      return {
        curriculums: [],
        pagination: {
          page: 1,
          last_page: 0
        }
      }
    }
    for (key in filters) {
      if (key !== 'search') {
        var name;
        switch (key) {
          case 'states':
            name = 'state';
            break;
          case 'cities':
            name = 'city';
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
        for (var i = curriculums.length - 1; i >= 0; i--) {
          if (filters[key] && filters[key].length) {
            var found = false;
            for (var j = 0; j < filters[key].length; j++) {
              if (curriculums[i][name]?.name === filters[key][j]) {
                found = true;
                break;
              }
            }
            if (!found) {
              curriculums.splice(i,1);
            }
          }
        }
      } else if (key === 'search') {
        for (var i = curriculums.length - 1; i >= 0; i--) {
          if (filters[key] && filters[key].length) {
            var found = false;
            for (var j = 0; j < filters[key].length; j++) {
              if (curriculums[i].profession?.name.toLowerCase().includes(filters[key].toLowerCase()) || curriculums[i].industry?.name.toLowerCase().includes(filters[key].toLowerCase()) || curriculums[i].country?.name.toLowerCase().includes(filters[key].toLowerCase()) || curriculums[i].state?.name.toLowerCase().includes(filters[key].toLowerCase()) || curriculums[i].city?.name.toLowerCase().includes(filters[key].toLowerCase())) {
                found = true;
                break;
              }
            }
            if (!found) {
              curriculums.splice(i,1);
            }
          }
        }
      }
    }
    var l = Math.ceil(curriculums.length / 10);
    if (page > l) {page = l;}
    var p = !page ? 0 : Number(page) - 1;
    return {
      curriculums: curriculums.slice(p * 10,p * 10 + 10),
      pagination: {
        page: (!page ? 1 : page),
        last_page: l
      }
    };
  },
  saveCurriculum: async function (data,user_id) {
    console.log('User',user_id);
    console.log('Data',data);
    try {
      console.log('Creating PDF');
      const options = { format: "A4" };
      const path = `${process.cwd()}/src/templates/ce/curriculum-simple.mustache`;
      const template = fs.readFileSync(path).toString("utf-8");
      var image = "";
      if (data.image?.buffer) {
        console.log('image');
        image = `data:${data.image.type};charset=utf-8;base64,${data.image.buffer}`;
      }
      var languages = "";
      for (var j = 0; j < data.languages?.length; j++) {
        languages += renderLanguage(data.languages[j]);
      }
      var skills = "";
      for (var j = 0; j < data.skills?.length; j++) {
        skills += renderSkill(data.skills[j]);
      }
      var work = "";
      for (var j = 0; j < data.work?.length; j++) {
        work += renderWorkExperience(data.work[j]);
      }
      var education = "";
      for (var j = 0; j < data.education?.length; j++) {
        education += renderEducationExperience(data.education[j]);
      }
      var references = "";
      for (var j = 0; j < data.references?.length; j++) {
        references += renderReference(data.references[j]);
      }
      const rendered = Mustache.render(template, {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone?.code + data.phone?.number,
        linkedin: data.linkedin,
        profession: data.profession?.name,
        country: data.country?.name,
        state: data.state?.name,
        city: data.city?.name,
        about: data.about,
        image,
        languages,
        skills,
        education,
        references
      });
      const pdfBuffer = await htmlToPdf.generatePdf(
        { content: rendered },
        options
        );
      data.file = {
        buffer: pdfBuffer.toString("base64"),
        size: 1024,
        type: 'application/pdf',
        name: 'Resume.pdf'
      };
      console.log('Created PDF');
      var userCurriculums = await UserCurriculums.findOne({ user_id }).exec();
      if (userCurriculums !== null) {
        if (data._id) {
          for (var i = 0; i < userCurriculums.curriculums.length; i++) {
            if (userCurriculums.curriculums[i]._id.toString() === data._id) {
              userCurriculums.curriculums[i] = data;
              userCurriculums = await userCurriculums.save();
              console.log('Updated curriculum');
              return userCurriculums.curriculums[i];
            }
          }
          throw new Error('Not found');
        } else {
          await UserCurriculums.updateOne({ user_id },{ $push: { curriculums: data } });
          console.log('Added curriculum');
        }
      } else {
        await UserCurriculums.create({ user_id, curriculums: data });
        console.log('Created curriculum');
      }
      var userCurriculums = await UserCurriculums.findOne({ user_id }).exec();
      console.log(userCurriculums);
      return userCurriculums.curriculums[userCurriculums.curriculums.length - 1];
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
  deleteCurriculum: async function (id, user_id) {
    let userCurriculums = await UserCurriculums.findOne({ user_id }).exec();
    for (var i = 0; i < userCurriculums?.curriculums.length; i++) {
      if (userCurriculums.curriculums[i]._id.toString() === id) {
        await userCurriculums.curriculums.pull({ _id: id });
        await userCurriculums.save();
        return 'Deleted user curriculum';
      }
    }
    throw new Error('Not found');
  },
};

module.exports = UserCurriculumService;
