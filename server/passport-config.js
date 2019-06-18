const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../db/models").User;
const bcrypt = require("bcryptjs");

module.exports = {
  init(app){

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy((email, password, done) => {
      User.findOne({
        where: { email }
      })
      .then((user) => {
        if (!user || !comparePass(password, user.getDataValue(password))) {
          return done(null, false, { message: "Invalid email or password" });
        }
        return done(null, user);
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
