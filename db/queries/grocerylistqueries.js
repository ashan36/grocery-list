const User = require("../models").User;
const GroceryList = require("../models").GroceryList;
const ListItems = require("../models").ListItems;
const Sequelize = require("sequelize");

module.exports = {

  getGList: (gListId, callback) => {
    return GroceryList.findOne({where: {id: gListId}}).then((list) => {callback(null, list)}).catch((err) => {callback(err)});
  },

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
      where: { GroceryListId: {
          [Sequelize.Op.contains]: [targetListId]
        }
      }
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
      attributes: ['id', "listName"],
      where: { UserId: {
        [Sequelize.Op.contains]: [targetUserId]
        }
      }
    })
    .then((lists) => {
      callback(null, lists);
    })
    .catch((err) => {
      callback(err);
    })
  },

  createNewList: (listName, userId, callback) => {
    return GroceryList.create({
      listName: listName,
      active: true,
      createdBy: userId,
      UserIds: [userId]
    })
    .then((gList) => {
      callback(null, glist);
    })
    .catch((err) => {
      callback(err);
    });
  },

  addUserToList: async (gListId, userId, callback) => {
    var gList = await GroceryList.findOne({where: {id: gListId}}).then((list) => {return list;}).catch((err) => {console.log(err); return null;});

    if (gList === null) {
      callback("Error, list not found");
      return;
    }
    else if(gList.UserId.indexOf(userId) != -1) {
      callback("User already a member of list");
      return;
   }

    return GroceryList.update(
      {
        UserId: Sequelize.fn('array_append', Sequelize.col('UserId'), userId)},
        {where: {id: gListId}
      }
    )
    .then((rows) => {
      callback(null, rows);
    })
    .catch((err) => {
      callback(err);
    });
  },

  addListToUser: async (userId, gListId, callback) => {
    var user = await User.findOne({where: {id: userId}}).then((user) => {return user}).catch((err) => {console.log(err); return null;});

    if (user === null) {
      callback("Error, user not found");
      return;
    }
    else if(user.GroceryListId.indexOf(gListId) != -1) {
      callback("List already a member of User");
      return;
   }

    return User.update(
      {
        GroceryListId: Sequelize.fn('array_append', Sequelize.col('GroceryListId'), gListId)},
        {where: {id: userId}
      }
    )
    .then((rows) => {
      callback(null, rows);
    })
    .catch((err) => {
      callback(err);
    });
  },

  removeUserFromList: async (gListId, userId, callback) => {
    var gList = await GroceryList.findOne({where: {id: gListId}}).then((list) => {return list;}).catch((err) => {console.log(err); return null;});

    var listUsers = [];
    var userIndex = null;

    if (gList === null) {
      callback("Could not find a matching Grocery List to update");
      return;
    }
    else {
      listUsers = gList.UserId;
      userIndex = listUsers.findIndex((value) => {return (value === userId)});
      if (userIndex === -1) {
        callback("Could not find User member in Grocery list");
        return;
      }
      else {
        listUsers.splice(userIndex, 1);
        return GroceryList.update({UserId: listUsers}, {where: {id: gListId}}).then((rows) => {callback (null, rows)}).catch((err) => {callback(err)});
      }
    }
  },

  removeListFromUser: async (userId, gListId, callback) => {
    var user = await User.findOne({where: {id: userId}}).then((user) => { return user }).catch(() => {return null});
    var userLists = [];
    var listIndex = null;

    if (user === null) {
      callback("Could not find a matching User to update");
      return;
    }
    else {
      userLists = user.GroceryListId;
      listIndex = userLists.findIndex((value) => {return (value === gListId)});
      if (listIndex === -1) {
        callback("Could not find list member in User");
        return;
      }
      else {
        userLists.splice(listIndex, 1);
        return User.update({GroceryListId: userLists}, {where: {id: userId}}).then((rows) => {callback (null, rows)}).catch((err) => {callback(err)});
      }
    }
  },

  deleteList: async (gListId, callback) => {
    var gList = await GroceryList.findOne({where: {id: gListId}}).then((gList) => {return gList}).catch(() => { return null });

    if (gList === null) {
      callback("Could not find Grocery List to delete");
      return;
    }
    else {
      return gList.destroy().then((rows) => { callback(null, rows); }).catch((err) => { callback(err); });
    }
  },

  createListItem: (listItem, callback) => {
    return ListItems.create(listItem).then((listItem) => {callback(null, listItem)}).catch((err) => {callback(err);});
  },

  deleteListItem: async (itemId, callback) => {
    var listItem = await ListItems.findOne({where: {id: itemId}}).then((item) => { return item; }).catch(() => { return null });

    if (listItem === null) {
      callback("Could not find item to delete");
      return;
    }
    else {
      return listItem.destroy().then((rows) => {callback(null, rows);}).catch((err) => { callback(err); });
    }
  },

  updateListItem: (listItem, callback) => {
    return ListItems.update(listItem, {where: {id: listItem.id}}).then((rows) => {callback(null, rows)}).catch((err) => {callback(err)});
  }

}
