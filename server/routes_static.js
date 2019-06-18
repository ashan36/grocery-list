const express = require("express");
const router = express.Router();
const userQueries = require('../db/queries/userqueries.js');

router.get("/", (req, res) => {//serve react app page
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

router.post("/sigin", (req, res, next) => { //respond to POST request from signin component
    passport.authenticate("local"), (req, res, function () {
      if(!req.user){
        req.flash("notice", "Sign in failed. Please try again.");
        res.json({status: 'fail'});
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.json({status: 'success'});
      }
    })
});

router.post("/newuser", (req, res, next) => { //respond to POST request from newuser component
  let newUser = {
    email: req.body.email,
    handle: req.body.handleName,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation
  };

  userQueries.createUser(newUser, (err, user) => {
    if(err) {
      req.flash("error", err);
    }
    else {
      passport.Authenticate("local"), (req, res, () => {
        req.flash("notice", "Sign in successful");
        res.json({status: 'success'});
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
