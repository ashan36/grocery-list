const multiparty = require('multiparty');

module.exports = {
parseNewUser: (req, res, next) => {
    let form = new multiparty.Form();
    var newUserData = [];
    req.user = {
      handle: "",
      username: "",
      password: "",
      passwordConfirmation: ""
    };
    form.on('error', function(err) {
      console.log('Error parsing form: ' + err.stack);
    });
    form.on('field', (name, value) => {
      newUserData.push({fieldName: name, fieldValue: value});
    });
    form.on('part', (part) => {
      part.resume();
      part.on('error', (err) => {
        console.log(err);
        part.resume();
      });
    });
    form.on('close', () => {
      for (var i = 0; i < newUserData.length; i++) {
        if (newUserData[i].fieldName === "handleName") {
          req.user.handle = newUserData[i].fieldValue;
        }
        else if (newUserData[i].fieldName === "username") {
          req.user.username = newUserData[i].fieldValue;
        }
        else if (newUserData[i].fieldName === "password") {
          req.user.password = newUserData[i].fieldValue;
        }
        else if (newUserData[i].fieldName === "password-confirmation") {
          req.user.passwordConfirmation = newUserData[i].fieldValue;
        }
      }
      console.log("From FormParser");
      console.log(req.user);
      return next();
    });
    form.parse(req);
  },

parseSignIn: (req, res, next) => {
    let form = new multiparty.Form();
    var newUserData = [];
    req.user = {
      username: "",
      password: "",
    };
    form.on('error', function(err) {
      console.log('Error parsing form: ' + err.stack);
    });
    form.on('field', (name, value) => {
      newUserData.push({fieldName: name, fieldValue: value});
    });
    form.on('part', (part) => {
      part.resume();
      part.on('error', (err) => {
        console.log(err);
        part.resume();
      });
    });
    form.on('close', () => {
      for (var i = 0; i < newUserData.length; i++) {
        if (newUserData[i].fieldName === "username") {
          req.user.username = newUserData[i].fieldValue;
        }
        else if (newUserData[i].fieldName === "password") {
          req.user.password = newUserData[i].fieldValue;
        }
      }
      console.log("From FormParser");
      console.log(req.user);
      return next();
    });
    form.parse(req);
  }
}
