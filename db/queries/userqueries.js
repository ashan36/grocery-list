const User = require("../models").User;
const bcrypt = require("bcryptjs");

module.exports = {
  createUser: (newUser, callback) => {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    newUser.username = newUser.username.toLowerCase();
    console.log("From createUser");
    console.log(newUser);

    return User.create({
      handle: newUser.handle,
      email: newUser.username,
      password: hashedPassword,
      GroceryListId: []
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    });
  },

  getUserByEmail: (email, callback) => {
    email = email.toLowerCase();
    return User.findOne({where: {email: email}}).then((user) => { callback(null, user) }).catch((err) => { callback(err); });
  },


}
