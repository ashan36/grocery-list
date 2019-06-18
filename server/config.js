require("dotenv").config();
const session = require("express-session");
const passportConfig = require("./passport-config");
const flash = require("express-flash");
const bodyParser = require("body-parser");


module.exports = {
  init(app, express) {
    const staticRoutes = require("./routes_static.js");
    app.use(staticRoutes);
    app.use(flash());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static(path.join(__dirname, 'build')));
    app.use(session({
    secret: process.env.cookieSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1.21e+9 }
    }));
    passportConfig.init(app);

    app.use((req, res, next) => {
      res.locals.currentUser = req.user;
      next();
    })
  }
};
