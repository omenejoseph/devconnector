const Validator = require('validator');
// const isEmpty = require('./is-empty');
const _ = require('lodash');

module.exports = function validatePostInput(data) {
    let errors = {};
    data.text = !_.isEmpty(data.text) ? data.text : '';

    //Text validation
    if (!Validator.isLength(data.text, {
            min: 3,
            max: 300
        })) {
        errors.text = "Post Text must be between 3 and 300 characters"
    }
    if (Validator.isEmpty(data.text)) {
        errors.text = "Text field cannot be empty";
    }

    return {
        errors,
        isValid: _.isEmpty(errors)
    }
}