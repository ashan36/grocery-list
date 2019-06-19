'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    handle: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Must be a valid email"}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    GroceryListId: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true
    }

  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.belongsToMany(models.GroceryList, {
      through: "UsersLists"
    });
  };
  return User;
};
