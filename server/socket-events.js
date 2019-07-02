const io = require("socket.io")();
const listQueries = require('../db/queries/grocerylistqueries.js');
const userQueries = require('../db/queries/userqueries.js');


module.exports = {

eventConfig (socket) {
    console.log("Client connected");
    socket.on('signIn', (email) => {
      console.log("User joined room " + email);
      socket.join(email);
    });

    socket.on('getGLists', (userId, callback) => {//send array of Glist objects
      listQueries.getGroceryLists(userId, (err, lists) => {
        if (err) {
          console.log(err);
          callback("Get list failed");
        }
        else {
          var listData = [];
          for (var i = 0; i < lists.length; i++) {
            var roomName = "" + lists[i].id + "_" + lists[i].listName;
            listData.push({id: lists[i].id, listName: lists[i].listName, createdBy: lists[i].createdBy, roomName: roomName});
            socket.join(roomName);
          }
          callback(false, listData);
        }
      });
    });

    socket.on('createNewList', (listName, userId, callback) => {
      listQueries.createNewList(listName, userId, (err, gList) => {
        if(err) {
          console.log(err);
          callback("Create new list failed");
        }
        else {
          var roomName = "" + gList.id + "_" + gList.listName;
          var listObject = {id: gList.id, listName: gList.listName, createdBy: gList.createdBy, roomName: roomName};
          callback("Created list succcesfully", listObject);
          listQueries.addListToUser(userId, gList.id, (err, rows) => {
            if(err || rows[0] === 0) {
              console.log(err);
            }
          });
        }
      });
    });

    socket.on('deleteGList', (listId, roomName, callback) => {
      listQueries.clearAllListUsers(listId, (message, success) => {
        if(success === false) {
          callback("Clear Users Failed", false);
        }
      });

      listQueries.deleteList(listId, (err, rows) => {
        if(err) {
          console.log(err);
          callback("Delete Failed", false);
        }
        else {
          callback("Deleted " + rows + " lists", true);
          socket.to(roomName).emit('dataUpdate', {op: "deletelist", listId: listId});
          socket.leave(roomName);
        }
      });
      listQueries.clearAllListItems(listId);
    });

    socket.on('updateGList', (gList, userId, roomName, callback) => {
      listQueries.updateGList(gList, userId, (err, rows) => {
        if(err) {
          console.log(err);
          callback(err, false);
        }
        else {
          callback("List Updated", true);
          socket.to(roomName).emit('dataUpdate', {op: "updatelist", gList: gList, roomName: roomName})
        }
      });
    });

    socket.on('getListMembers', (listId, callback) => {
      listQueries.getUserMembers(listId, (err, users) => {
        if(err) {
          console.log(err);
          callback(err, false);
        }
        else {
          var userData = [];
          for (var i = 0; i < users.length; i++) {
            userData.push({id: users[i].id, handle: users[i].handle});
          }
          callback(false, userData);
        }
      });
    });

    socket.on('addListUser', (email, listId, roomName, callback) => {
      userQueries.getUserByEmail(email, (err, user) => {
        if(err) {
          console.log(err);
          callback("Could not find user with email: " + email, false);
          return;
        }
        else {
          listQueries.addUserToList(listId, user.id, (err, rows) => {
            if(err) {
              console.log(err);
              callback(err);
              return;
            }
            else if(rows[0] === 0) {
              callback("User already a member of list", false);
              return;
            }
          });
          listQueries.addListToUser(user.id, listId, (err, rows) => {
            if(err) {
              console.log(err);
              callback(err);
              return;
            }
            else if(rows[0] === 0) {
              callback("User already a member of list", false);
              return;
            }
            else {
              callback("User successfully added", {id: user.id, handle: user.handle});
              socket.to(roomName).emit('dataUpdate', {op: "addmember", newUser: {id: user.id, handle: user.handle}, roomName: roomName});
              socket.to(user.email).emit('dataUpdate', {op: "sharelist"});
            }
          });
        }
      });
    });

    socket.on('removeListUser', async (userId, listId, roomName, callback) => {
      listQueries.removeUserFromList(listId, userId, (err, rows) => {
        if(err) {
          console.log(err);
          callback(err, false);
          return;
        }
        else if(rows[0] === 0) {
          callback("User is already not a member of list", false);
          return;
        }
      });
      listQueries.removeListFromUser(userId, listId, (err, rows) => {
        if(err) {
          console.log(err);
          callback(err, false);
          return;
        }
        else if(rows[0] === 0) {
          callback("User is already not a member of list", false);
          return;
        }
      });
      callback("User successfully removed", true);
      socket.to(roomName).emit('dataUpdate', {op: "removemember", removedUserId: userId, removedListId: listId, roomName: roomName});
    });

    socket.on('subscribeToList', (roomName) => {
      console.log("subscribing to " + roomName);
      socket.join(roomName, (err) => {if(err) {console.log(err);}});
    });

    socket.on('unsubscribeFromList', (roomName) => {
      console.log("unsubscribing from " + roomName);
      socket.leave(roomName, (err) => {if(err) {console.log(err);}});
    });

    socket.on('getListItems', (listId, callback) => {
      listQueries.getListItems(listId, (err, items) => {
        if (err) {
          console.log(err);
          callback("Get list items failed");
        }
        else {
          var itemData = [];
          for (var i = 0; i < items.length; i++) {
            itemData.push({id: items[i].id, itemName: items[i].itemName, complete: items[i].complete});
          }
          callback("Get list successful", itemData);
        }
      });
    });

    socket.on('createListItem', (listItem, roomName, callback) => {
      listQueries.createListItem(listItem, (err, newItem) => {
        if(err) {
          console.log(err);
          callback(err, null);
          return;
        }
        else {
          var itemData = {id: newItem.id, itemName: newItem.itemName, complete: newItem.complete};
          callback("Item created", itemData);
          socket.to(roomName).emit('dataUpdate', {op:"createitem", newItem: itemData, roomName: roomName});
        }
      });
    });

    socket.on('deleteListItem', (itemId, roomName, callback) => {
      listQueries.deleteListItem(itemId, (err, rows) => {
        if(err) {
          console.log(err);
          callback(err, false);
          return;
        }
        else if (rows[0] === 0) {
          callback("Item delete failed", false);
          return;
        }
        callback("Item deleted", true);
        socket.to(roomName).emit('dataUpdate', {op: "deleteitem", oldItemId: itemId, roomName: roomName});
      });
    });

    socket.on('updateListItem', (listItem, roomName, callback) => {
      listQueries.updateListItem(listItem, (err, rows) => {
        if(err) {
          console.log(err);
          callback(err, false);
          return;
        }
        else if (rows[0] === 0) {
          callback("List update failed", false);
          return;
        }
        callback("Item Updated", true);
        socket.to(roomName).emit('dataUpdate', {op: "updateitem", newItem: listItem, roomName: roomName});
      });
    });
  }
}
