'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    handle: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.belongsToMany(models.GroceryList, {
      through: "UsersLists"
    });
  };
  return User;
};
