const express = require("express");
const router = express.Router();
const userQueries = require('../db/queries/userqueries.js');
const passport = require('passport');
const multiparty = require('multiparty');
const formParser = require('./formParser.js');
const User = require("../db/models").User;
const bcrypt = require("bcryptjs");

router.post("/signin", formParser.parseSignIn, (req, res, next) => { //respond to POST request from signin component
  console.log("sign in request");

  function customAuthenticate(user, callback) {
    return User.findOne({
      where: { email: req.user.username }
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    });
  }

  function comparePass(userPassword, databasePassword) {
    return bcrypt.compareSync(userPassword, databasePassword);
  }

  customAuthenticate(req.user, (err, user) => {
    if (err) {
      console.log(err + err.stack);
    }
    else if (!user || !comparePass(req.user.password, user.password)) {
      return res.json({ success: false, message: "sign in failed"});
    }
    else {
      req.login(user, function(err) {
        if (err) {return next(err); }
        return res.json({ success: true, message: "Login Successful", handleName: user.handle, userId: user.id});
      });
    }
  });
});

router.post("/newuser", formParser.parseNewUser, (req, res, next) => { //respond to POST request from newuser component
  console.log("new user request");
  if (req.user.passwordConfirmation != req.user.password) {
    res.json({ success: false, message: "passwords do not match"});
  }
  userQueries.createUser(req.user, (err, user) => {
    if(err) {
      console.log(err);
      return res.status(500);
    }
    else {
      console.log("no error, moving to authenticate");
      req.login(user, function(err) {
        if (err) { return next(err); }
        return res.json({ success: true, message: "Login Successful", handleName: user.handle, userId: user.id});
      });
    }
  });
});

router.get("/signout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
