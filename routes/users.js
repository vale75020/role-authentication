const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/database");

router.post("/register", (req, res) => {
  // return res.json(
  //     req.body
  // );
  let newUser = new User({
    //userSchema
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact,
    password: req.body.password
  });
  User.addUser(newUser, (err, user) => {
    if (err) {
      let message = "";
      if (err.errors.username) message = "username is already taken";
      if (err.errors.email) message = "Email already exists";
      return res.json({
        success: false,
        message
      });
    } else {
      return res.json({
        success: true,
        message: "User registration is successful"
      });
    }
  });
});

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(
          {
            type: "user",
            data: {
              _id: user._id,
              username: user.username,
              name: user.name,
              email: user.email,
              contact: user.contact
            }
          },
          config.secret,
          {
            expiresIn: 604800 // 1 Week
          }
        );
        return res.json({
          success: true,
          token: "JWT " + token
        });
      } else {
        return res.json({
          success: true,
          message: "Wrong Password"
        });
      }
    });
  });
});

// Get authenticated user profile
router.get('/profile',passport.authenticate('jwt', {session: false}),(req, res) => {
    return res.json("hello");
})

module.exports = router;
