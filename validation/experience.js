const Validator = require('validator');
const _ = require('lodash');

module.exports = function validateExperienceInput(data) {
    let errors = {};
    data.title = !_.isEmpty(data.title) ? data.title : '';
    data.company = !_.isEmpty(data.company) ? data.company : '';
    data.from = !_.isEmpty(data.from) ? data.from : '';
    //title validation
    if (!Validator.isLength(data.title, {
            min: 6,
            max: 30
        })) {
        errors.title = "Job Title must be between 6 and 40 characters"
    }
    if (Validator.isEmpty(data.title)) {
        errors.title = "Title field cannot be empty";
    }
    //company validation
    if (!Validator.isLength(data.company, {
            min: 6,
            max: 30
        })) {
        errors.company = "Company Name must be between 6 and 40 characters"
    }
    if (Validator.isEmpty(data.company)) {
        errors.company = "Company field cannot be empty";
    }
    //from validation
    if (Validator.isEmpty(data.from)) {
        errors.from = "From Date field cannot be empty";
    }
    if (!_.isDate(data.from)) {
        errors.from = "Not a valid date";
    }

    return {
        errors,
        isValid: _.isEmpty(errors)
    }
}