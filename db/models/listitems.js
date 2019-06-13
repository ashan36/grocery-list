'use strict';
module.exports = (sequelize, DataTypes) => {
  const ListItems = sequelize.define('ListItems', {
    itemName: DataTypes.STRING,
    complete: DataTypes.BOOLEAN,
    listId: DataTypes.INTEGER
  }, {});
  ListItems.associate = function(models) {
    // associations can be defined here
    ListItems.belongsTo(models.GroceryList, {
      foreignKey: "listId",
      onDelete: "CASCADE",
    });
  };
  return ListItems;
};
