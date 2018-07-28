const Validator = require('validator');
// const isEmpty = require('./is-empty');
const _ = require('lodash');

module.exports = function validateRegisterInput(data) {
    let errors = {};
    data.name = !_.isEmpty(data.name) ? data.name : '';
    data.email = !_.isEmpty(data.email) ? data.email : '';
    data.password = !_.isEmpty(data.password) ? data.password : '';
    data.password2 = !_.isEmpty(data.password2) ? data.password2 : '';
    if (!Validator.isLength(data.name, {
            min: 3,
            max: 30
        })) {
        errors.name = "Name must be between 3 and 30 characters"
    }
    //Name validation
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field cannot be empty";
    }
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
        errors.pasword = "Password must be atleast 30 characters"
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field cannot be empty";
    }
    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm Password field cannot be empty";
    }
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }

    return {
        errors,
        isValid: _.isEmpty(errors)
    }
}