const UserDeaLicences = require("../configs/database/models/UserDeaLicenses");
const UserMemberships = require("../configs/database/models/UserMemberships");
const UserFiles = require("../configs/database/models/UserFiles");
const UserIndustries = require("../configs/database/models/UserIndustries");

const AnalyticsService = {
  expirations: async function (from, to) {
  	try {
	  	var users = [];
	  	var userDeaLicences = await UserDeaLicences.find().exec();
	  	var dea_licences = [];
	  	for (var i = 0; i < userDeaLicences?.length; i++) {
	  		for (var j = 0; j < userDeaLicences[i].dea_licenses?.length; j++) {
	  			if (from <= userDeaLicences[i].dea_licenses[j].detail?.expiration_date && userDeaLicences[i].dea_licenses[j].detail?.expiration_date <= to) {
	  				userDeaLicences[i].dea_licenses[j].user_id = userDeaLicences[i].user_id;
	  				dea_licences.push(userDeaLicences[i].dea_licenses[j]);
	  			}
	  		}
	  	}
	  	var userMemberships = await UserMemberships.find().exec();
	  	var memberships = [];
	  	for (var i = 0; i < userMemberships?.length; i++) {
	  		for (var j = 0; j < userMemberships[i].memberships?.length; j++) {
	  			if (from <= userMemberships[i].memberships[j].detail?.expiration_date && userMemberships[i].memberships[j].detail?.expiration_date <= to) {
	  				userMemberships[i].memberships[j].user_id = userMemberships[i].user_id;
	  				memberships.push(userMemberships[i].memberships[j]);
	  			}
	  		}
	  	}
	  	var userFiles = await UserFiles.find().exec();
	  	var custom_documents = [];
	  	for (var i = 0; i < userFiles?.length; i++) {
	  		for (var j = 0; j < userFiles[i].files?.length; j++) {
	  			if (from <= userFiles[i].files[j].expiration && userFiles[i].files[j].expiration <= to) {
	  				userFiles[i].files[j].user_id = userFiles[i].user_id;
	  				custom_documents.push(userFiles[i].files[j]);
	  			}
	  		}
	  	}
	  	var userIndustryLicences = await UserIndustries.find().exec();
	  	var industry_licences = [];
	  	for (var i = 0; i < userIndustryLicences?.length; i++) {
	  		for (var j = 0; j < userIndustryLicences[i].industries?.length; j++) {
	  			for (var k = 0; k < userIndustryLicences[i].industries?.licenses?.length; k++) {
		  			if (from <= userIndustryLicences[i].industries[j].licenses[k].detail?.expiration_date && userIndustryLicences[i].industries[j].licenses[k].detail?.expiration_date <= to) {
		  				userIndustryLicences[i].industries[j].licenses[k].user_id = userIndustryLicences[i].user_id;
		  				industry_licences.push(userIndustryLicences[i].industries[j].licenses[k]);
		  			}
		  		}
	  		}
	  	}
	  	var users = [];
	  	for (var i = 0; i < dea_licences.length; i++) {
	  		var found = false;
	  		for (var j = 0; j < users.length; j++) {
	  			if (users[k].id === dea_licences[i].user_id) {
	  				users[j].dea_licences.push(dea_licences[i]);
	  				found = true;
	  				break;
	  			}
	  		}
	  		if (!found) {
	  			users[j] = {
	  				user_id: dea_licences[i].user_id,
	  				dea_licences: [dea_licences[i]],
	  				memberships: [],
	  				custom_documents: [],
	  				industry_licences: []
	  			}
	  		}
	  	}
	  	for (var i = 0; i < memberships.length; i++) {
	  		var found = false;
	  		for (var j = 0; j < users.length; j++) {
	  			if (users[k].id === memberships[i].user_id) {
	  				users[j].memberships.push(memberships[i]);
	  				found = true;
	  				break;
	  			}
	  		}
	  		if (!found) {
	  			users[j] = {
	  				user_id: memberships[i].user_id,
	  				dea_licences: [],
	  				memberships: [memberships[i]],
	  				custom_documents: [],
	  				industry_licences: []
	  			}
	  		}
	  	}
	  	for (var i = 0; i < custom_documents.length; i++) {
	  		var found = false;
	  		for (var j = 0; j < users.length; j++) {
	  			if (users[k].id === custom_documents[i].user_id) {
	  				users[j].custom_documents.push(custom_documents[i]);
	  				found = true;
	  				break;
	  			}
	  		}
	  		if (!found) {
	  			users[j] = {
	  				user_id: custom_documents[i].user_id,
	  				dea_licences: [],
	  				memberships: [],
	  				custom_documents: [custom_documents[i]],
	  				industry_licences: []
	  			}
	  		}
	  	}
	  	for (var i = 0; i < industry_licences.length; i++) {
	  		var found = false;
	  		for (var j = 0; j < users.length; j++) {
	  			if (users[k].id === industry_licences[i].user_id) {
	  				users[j].industry_licences.push(industry_licences[i]);
	  				found = true;
	  				break;
	  			}
	  		}
	  		if (!found) {
	  			users[j] = {
	  				user_id: industry_licences[i].user_id,
	  				dea_licences: [],
	  				memberships: [],
	  				custom_documents: [],
	  				industry_licences: [industry_licences[i]]
	  			}
	  		}
	  	}
	  	console.log(users);
	  	return users;
	} catch (error) {
		console.error(error);
		throw new Error('Something went wrong');
	}
  }
};

module.exports = AnalyticsService;