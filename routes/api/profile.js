const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
// const keys = require('../../config/keys');
const passport = require("passport");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// @route   Get api/profile/
// @desc    get current user's profile
// @access  private 
router.get('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const errors = {};
    Profile
        .findOne({
            user: req.user.id
        })
        .populate('user', ['name', 'email'])
        .then((profile) => {
            if (!profile) {
                errors.noprofile = "Profile not found"
                return res.status(400).json(errors);
            }
            return res.json(profile);
        })
        .catch(err => res.status(404).json(err))
});

// @route   Get api/profile/handle/:handle
// @desc    get user's profile by handle
// @access  public 
router.get('/handle/:handle', (req, res) => {
    const errors = {};
    Profile
        .findOne({
            handle: req.params.handle
        })
        .populate('user', ['name', 'email'])
        .then((profile) => {
            if (!profile) {
                errors.noprofile = "Profile not found"
                return res.status(400).json(errors);
            }
            return res.json(profile);
        })
        .catch(err => res.status(404).json(err))
});
// @route   Get api/profile/user/:user_id
// @desc    get user's profile by id
// @access  public 
router.get('/user/:user_id', (req, res) => {
    const errors = {};
    Profile
        .findOne({
            _id: req.params.user_id
        })
        .populate('user', ['name', 'email'])
        .then((profile) => {
            if (!profile) {
                errors.noprofile = "Profile not found"
                return res.status(400).json(errors);
            }
            return res.json(profile);
        })
        .catch(err => res.status(404).json({
            profile: "Profile not found"
        }))
});
// @route   Get api/profile/all
// @desc    get all user's profile 
// @access  public 
router.get('/all', (req, res) => {
    const errors = {};
    Profile
        .find()
        .populate('user', ['name', 'email'])
        .then((profiles) => {
            if (!profiles) {
                errors.noprofile = "No Profile found"
                return res.status(400).json(errors);
            }
            return res.json(profiles);
        })
        .catch(err => res.status(404).json({
            profile: "No Profile found"
        }))
});

// @route   Post api/profile/
// @desc    Create or update user's profile
// @access  private 
router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    // validate using validator
    const {
        errors,
        isValid
    } = validateProfileInput(req.body);
    if (!isValid) return res.status(400).json(errors);
    //set create empty profilefield object to add fields to
    const profileFields = {};
    //set profileFields user to the user id from passport jwt strategy
    profileFields.user = req.user.id;
    //check for requests that came and set values for them in
    //profileFields object
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    //check if skills came and split skills into array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }
    //create an object to collect social requests
    profileFields.social = {};
    //check if social request came and set values to profileFields.social
    //accordingly
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram
    //check if profile already exists and update if it does
    Profile.findOne({
        user: req.user.id
    }).then((profile) => {
        if (profile) {
            Profile.findOneAndUpdate({
                    user: req.user.id
                }, {
                    $set: profileFields
                }, {
                    new: true
                }).then((profile) => res.json(profile))
                .catch(err => res.status(400).json({
                    error: "Something went wrong"
                }));
        } else {
            //profile doesnt exist so check if handle exists and
            // return error if handle exists else create profile
            Profile.findOne({
                handle: req.body.handle
            }).then((handle) => {
                if (handle) {
                    errors.handle = "Handle already exists";
                    return res.status(400).json(errors);
                }
                new Profile(profileFields)
                    .save()
                    .then((profile) => res.json(profile))
                    .catch(err => res.status(400).json({
                        error: "Something went wrong"
                    }));
            }).catch(err => res.status(400).json({
                error: "Something went wrong"
            }));
        }
    }).catch(err => res.status(400).json({
        error: "Something went wrong"
    }));

});
// @route   Post api/profile/experience
// @desc    Add experience
// @access  private
router.post('/experience', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validateExperienceInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        if (!profile) return res.status(400).json({
            error: "Please create a profile"
        })
        const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description,
        }
        profile
            .experience
            .unshift(newExp);
        profile
            .save()
            .then(profile => res.json(profile))
            .catch(err => res.status(400).json({
                error: "Something went wrong"
            }));
    }).catch(err => res.status(400).json({
        error: "Something went wrong"
    }));
});
// @route   Post api/profile/education
// @desc    Add education
// @access  private
router.post('/education', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validateEducationInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        if (!profile) return res.status(400).json({
            error: "Please create a profile"
        })
        const newEdu = {
            school: req.body.school,
            degree: req.body.degree,
            fieldofstudy: req.body.fieldofstudy,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description,
        }
        profile
            .education
            .unshift(newEdu);
        profile
            .save()
            .then(profile => res.json(profile))
            .catch(err => res.status(400).json({
                error: "Something went wrong"
            }));
    }).catch(err => res.status(400).json({
        error: "Something went wrong"
    }));
});

// @route   Delete api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  private
router.delete('/experience/:exp_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        if (!profile) return res.status(400).json({
            error: "Please create a profile"
        })
        const removeIndex = profile
            .experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);
        profile
            .experience
            .splice(removeIndex, 1);
        profile
            .save()
            .then(profile => res.json(profile))
            .catch(err => res.status(400).json({
                error: "Something went wrong"
            }));
    }).catch(err => res.status(400).json({
        error: "Something went wrong"
    }));;
});

// @route   Delete api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  private
router.delete('/education/:edu_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        if (!profile) return res.status(400).json({
            error: "Please create a profile"
        });
        const removeIndex = profile
            .education
            .map(item => item.id)
            .indexOf(req.params.edu_id);
        profile
            .education
            .splice(removeIndex, 1);
        profile
            .save()
            .then(profile => res.json(profile))
            .catch(err => res.status(400).json({
                error: "Something went wrong"
            }));
    }).catch(err => res.status(400).json({
        error: "Something went wrong"
    }));;
});

// @route   Delete api/profile/
// @desc    Delete user and profile
// @access  private
router.delete('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    Profile.findOneAndRemove({
        user: req.user.id
    }).then(() => {
        User
            .findOneAndRemove({
                _id: req.user.id
            })
            .then(() => res.json({
                success: true
            }))
            .catch(err => res.status(400).json({
                error: "Something went wrong"
            }));

    }).catch(err => res.status(400).json({
        error: "Something went wrong"
    }));

});

module.exports = router;