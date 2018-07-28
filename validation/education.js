const Validator = require('validator');
const _ = require('lodash');

module.exports = function validateEducationInput(data) {
    let errors = {};

    data.school = !_.isEmpty(data.school) ? data.school : '';
    data.degree = !_.isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !_.isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
    data.from = !_.isEmpty(data.from) ? data.from : '';

    //school validation
    if (!Validator.isLength(data.school, {
            min: 2,
            max: 30
        })) {
        errors.school = "School Name must be between 2 and 40 characters"
    }
    if (Validator.isEmpty(data.school)) {
        errors.school = "School field cannot be empty";
    }
    //degree validation
    if (!Validator.isLength(data.degree, {
            min: 2,
            max: 30
        })) {
        errors.degree = "Degree Name must be between 2 and 40 characters"
    }
    if (Validator.isEmpty(data.degree)) {
        errors.degree = "Degree field cannot be empty";
    }
    //fieldofstudy validation
    if (!Validator.isLength(data.fieldofstudy, {
            min: 2,
            max: 30
        })) {
        errors.fieldofstudy = "Field of Study Name must be between 2 and 40 characters"
    }
    if (Validator.isEmpty(data.fieldofstudy)) {
        errors.fieldofstudy = "Degree field cannot be empty";
    }
    //from validation
    if (Validator.isEmpty(data.from)) {
        errors.from = "From Date field cannot be empty";
    }


    return {
        errors,
        isValid: _.isEmpty(errors)
    }
}