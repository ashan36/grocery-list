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
      attributes: ['handle'],
      include: [{
        model: GroceryList,
        through: {
          where: {GroceryListId: targetListId}
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

  getGroceryLists: (targetUserId, callback) => {
    return GroceryList.findAll({
      attributes: ["listName"],
      include: [{
        model: User,
        through: {
          where: {UserId: targetUserId}
        }
      }]
    })
    .then((lists) => {
      callback(null, lists);
    })
    .catch((err) => {
      callback(err);
    })
  },
  
}
