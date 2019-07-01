require("dotenv").config();
const session = require("express-session");
const passportConfig = require("./passport-config");
const path = require('path');
const formParser = require('./formParser.js');


module.exports = {
  init(app, express) {
    const staticRoutes = require("./routes_static.js");
    app.use(session({
      secret: "Sign the session id",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1.21e+9 }
    }));
    passportConfig.init(app);
    app.use(staticRoutes);
    app.use(express.static(path.join(__dirname, '../build')));
    app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname, '../build', 'index.html'));
    });

    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    app.use(formParser.parseNewUser);
    app.use(formParser.parseSignIn);

    app.use((req, res, next) => {
      res.locals.currentUser = req.user;
      next();
    })
  }
};
