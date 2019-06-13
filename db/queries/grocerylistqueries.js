const User = require("../models").User;
const GroceryList = require("../models").GroceryList;
const ListItems = require("../models").ListItems;

module.exports = {

  getAllItems: (targetlistId, callback) => {
    return ListItems.findAll({
      where: {
        listId: targetlistId
      }
    })
    .then((items) => {
      callback(null, items);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getUserMembers: (targetListId, callback) => {
    return User.findAll({
      include: [{
        model: GroceryList,
        through: {
          attributes: ['handle'],
          where: {groceryListId: targetListId}
        }
      }]
    })
    .then((users) => {
        callback(null, users);
    })
    .catch((err) => {
      callback(err);
    })
  },


}
