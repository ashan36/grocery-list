const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../db/models").User;
const bcrypt = require("bcryptjs");

module.exports = {
  init(app){

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy((username, password, done) => {
      User.findOne({
        where: { email: username }
      })
      .then((user) => {
        if (!user || !comparePass(password, user.password)) {
          return done(null, false, { message: "Invalid email or password" });
        }
        return done(null, user);
      })
      .catch((err) => {
        return done(err, false);
      })
    }));

    passport.serializeUser((user, callback) => {
      callback(null, user.id);
    });

    passport.deserializeUser((id, callback) => {
      User.findByPk(id)
      .then((user) => {
        callback(null, user);
      })
      .catch((err => {
        callback(err);
      }))
    });

    function comparePass(userPassword, databasePassword) {
      return bcrypt.compareSync(userPassword, databasePassword);
    }
  }
}
