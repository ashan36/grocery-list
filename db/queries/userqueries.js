const User = require("../models").User;
const bcrypt = require("bcryptjs");

module.exports = {
  createUser: (newUser, callback) => {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
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
    return User.findOne({where: {email: email}}).then((user) => { callback(null, user) }).catch((err) => { callback(err); });
  },


}
