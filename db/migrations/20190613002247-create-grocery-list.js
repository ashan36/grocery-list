'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('GroceryLists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: Sequelize.INTEGER
      },
      listName: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdBy: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      UserId: {
        allowNull: true,
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('GroceryLists');
  }
};
