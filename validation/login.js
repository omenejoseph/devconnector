const Validator = require('validator');
// const isEmpty = require('./is-empty');
const _ = require('lodash');

module.exports = function validateLoginInput(data) {
    let errors = {};
    data.email = !_.isEmpty(data.email) ? data.email : '';
    data.password = !_.isEmpty(data.password) ? data.password : '';
    //email validation
    if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field cannot be empty";
    }

    //password validation
    if (!Validator.isLength(data.password, {
            min: 6,
            max: 30
        })) {
        errors.pasword = "Password must be between 6 and 30 characters"
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field cannot be empty";
    }

    return {
        errors,
        isValid: _.isEmpty(errors)
    }
}