'use strict';
module.exports = (sequelize, DataTypes) => {
  const ListItems = sequelize.define('ListItems', {
    itemName: DataTypes.STRING,
    complete: DataTypes.BOOLEAN
  }, {});
  ListItems.associate = function(models) {
    // associations can be defined here
    ListItems.belongsTo(models.GroceryList, {
      onDelete:"CASCADE",
    });
  };
  return ListItems;
};
