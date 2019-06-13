'use strict';
module.exports = (sequelize, DataTypes) => {
  const GroceryList = sequelize.define('GroceryList', {
    listName: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {});
  GroceryList.associate = function(models) {
    // associations can be defined here
    GroceryList.belongsToMany(models.User, {
      foreignKey: "userID",
      onDelete: "CASCADE",
    });
    GroceryList.hasMany(models.listItems, {
      foreignKey: "listID",
      as: "items",
    });
  };
  return GroceryList;
};
