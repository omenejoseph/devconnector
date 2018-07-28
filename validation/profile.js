const Validator = require('validator');
// const isEmpty = require('./is-empty');
const _ = require('lodash');

module.exports = function validateProfileInput(data) {
    let errors = {};
    data.handle = !_.isEmpty(data.handle) ? data.handle : '';
    data.status = !_.isEmpty(data.status) ? data.status : '';
    data.skills = !_.isEmpty(data.skills) ? data.skills : '';

    //Handle validation
    if (!Validator.isLength(data.handle, {
            min: 4,
            max: 30
        })) {
        errors.handle = "Handle must be between 4 and 30 characters"
    }
    if (Validator.isEmpty(data.handle)) {
        errors.handle = "Profile Handle is required";
    }
    //status validation
    if (Validator.isEmpty(data.status)) {
        errors.status = "Status field is required";
    }
    //skills validation
    if (Validator.isEmpty(data.skills)) {
        errors.skills = "Skills field is required";
    }
    //website validation
    if (!_.isEmpty(data.website)) {
        if (!Validator.isURL(data.website)) {
            errors.website = "Not a valid URL";
        }
    }
    //linkedin validation
    if (!_.isEmpty(data.linkedin)) {
        if (!Validator.isURL(data.linkedin)) {
            errors.linkedin = "Not a valid URL";
        }
    }
    //instagram validation
    if (!_.isEmpty(data.instagram)) {
        if (!Validator.isURL(data.instagram)) {
            errors.instagram = "Not a valid URL";
        }
    }
    //youtube validation
    if (!_.isEmpty(data.youtube)) {
        if (!Validator.isURL(data.youtube)) {
            errors.youtube = "Not a valid URL";
        }
    }
    //twitter validation
    if (!_.isEmpty(data.twitter)) {
        if (!Validator.isURL(data.twitter)) {
            errors.twitter = "Not a valid URL";
        }
    }
    //facebook validation
    if (!_.isEmpty(data.facebook)) {
        if (!Validator.isURL(data.facebook)) {
            errors.facebook = "Not a valid URL";
        }
    }


    return {
        errors,
        isValid: _.isEmpty(errors)
    }
}