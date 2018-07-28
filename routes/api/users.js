const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const keys = require('../../config/keys');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login')

// @route   Get api/users/
// @desc    get all users
// @access  public
router.get("/", (req, res) =>
    res.json({
        msg: "Users Works"
    })
);

// @route   Get api/users/register
// @desc    register user
// @access  public
router.post("/register", (req, res) => {
    // return res.json(req.body);
    const {
        errors,
        isValid
    } = validateRegisterInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            errors.email = "Email already exists";
            res.status(400).json(errors);
        } else {
            // const avatar = gravatar.url(req.body.email, {
            //   //problem
            //   s: "200",
            //   r: "pg",
            //   d: "mm"
            // });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
                // avatar
            });
            bcrypt.genSalt(10, (err, salt) => {
                if (!err) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                }
            });
        }
    });
});

// @route   Get api/users/login
// @desc    Login user - return JWT
// @access  public
router.post("/login", (req, res) => {
    // return res.json(req.body);
    const {
        errors,
        isValid
    } = validateLoginInput(req.body);
    if (!isValid) return res.status(400).json(errors);
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            errors.email = "User not found";
            return res.status(404).json(errors);
        } else {
            bcrypt
                .compare(req.body.password, user.password)
                .then((isMatch) => {
                    if (isMatch) {
                        const {
                            id,
                            name
                        } = user;
                        const payload = {
                            id,
                            name
                        };
                        const jwtSecret = keys.jwtSecret;
                        jwt.sign(
                            payload,
                            jwtSecret, {
                                expiresIn: 3600
                            },
                            (err, token) => {
                                if (err) {
                                    res.status(500).json({
                                        msg: "Something went wrong"
                                    })
                                } else {
                                    res.json({
                                        success: true,
                                        token: `Bearer ${ token }`
                                    })
                                }
                            });
                    } else {
                        errors.password = "Password Incorrect";
                        return res.status(400).json(errors)
                    }
                })
        }
    })
});

// @route   Get api/users/current
// @desc    Return current user
// @access  private 
router.get('/current', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    res.json(req.user);
});

module.exports = router;