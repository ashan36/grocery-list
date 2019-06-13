'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    handle: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(model.GroceryList, {
      foreignKey: "userID",
      as: "lists"
    });
  };
  return User;
};
