const express = require("express");
const router = express.Router();
const userQueries = require('../db/queries/userqueries.js');

router.post("/sigin", (req, res, next) => { //respond to POST request from signin component
    console.log("sign in request");

    passport.authenticate("local") (req, res, function () {
      if(!req.user){
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect('/');
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect('/');
      }
    })
});

router.post("/newuser", (req, res, next) => { //respond to POST request from newuser component
  console.log("new user request");

  let newUser = {
    email: req.body.email,
    handle: req.body.handleName,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation
  };

  userQueries.createUser(newUser, (err, user) => {
    if(err) {
      req.flash("error", err);
      res.redirect('/');
    }
    else {
      passport.Authenticate("local"), (req, res, () => {
        req.flash("notice", "Sign in successful");
        res.redirect('/');
      });
    }
  });
});

router.post("/signout", (req, res, next) => {
  req.logout();
  req.flash("notice", "Logout Successful");
  res.redirect("/");
});

module.exports = router;
