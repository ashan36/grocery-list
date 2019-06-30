'use strict';
module.exports = (sequelize, DataTypes) => {
  const GroceryList = sequelize.define('GroceryList', {
    listName: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    createdBy: DataTypes.INTEGER,
    UserId: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: []
    }
  }, {});
  GroceryList.associate = function(models) {
    // associations can be defined here
    GroceryList.belongsToMany(models.User, {
      through: "UsersLists",
      foreignKey: "UserId"
    });
    GroceryList.hasMany(models.ListItems, {
      foreignKey: "listId",
      as: "Items",
      onDelete: "CASCADE"
    });
    GroceryList.hasOne(models.User);
  };
  return GroceryList;
};
