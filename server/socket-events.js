const io = require("socket.io")();
const listQueries = require('../db/queries/grocerylistqueries.js');
const userQueries = require('../db/queries/userqueries.js');


module.exports = {

eventConfig (socket) {
    console.log("Client connected");

    socket.on('getGLists', (userId, callback) => {//send array of Glist objects
      var lists = listQueries.getGroceryLists(userId, (err, lists) => {
        if (err) {
          console.log(err);
          callback("Get list failed");
        }
        else {
          var listData = [];
          for (var i = 0; i < lists.length; i++) {
            listData.push({id: lists[i].id, listName: lists[i].listName});
          }
          callback(listData);
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
          var listObject = {id: gList.id, listName: gList.listName, createdBy: gList.createdBy};
          callback(listObject);
        }
      });
    });

    socket.on('deleteList', (listId) => {
      listQueries.deleteList(listId, (err, rows) => {
        if(err) {
          console.log(err);
          callback("Delete Failed");
        }
        else {
          callback("Deleted " + rows + " lists");
        }
      })
    });

    socket.on('addListUser', (email, listId, callback) => {
      var user;
      userQueries.getUserByEmail(email, (err, res) => {
        if(err) {
          console.log(err);
          callback("Could not find user with email: " + email);
          return;
        }
        else {
          user = res;
        }
      });

      listQueries.addUserToList(listId, user.id, (err, rows) => {
        if(err) {
          console.log(err);
          callback(err);
          return;
        }
        else if(rows[0] === 0) {
          callback("User already a member of list");
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
          callback("User already a member of list");
          return;
        }
      });

      callback("User successfully added");
    });

    socket.on('removeListUser', (userId, listId, callback) => {
      listQueries.removeUserFromList(listId, userId, (err, rows) => {
        if(err) {
          console.log(err);
          callback(err);
          return;
        }
        else if(rows[0] === 0) {
          callback("User is already not a member of list");
          return;
        }
      });

      listQueries.removeListFromUser(userId, listId, (err, rows) => {
        if(err) {
          console.log(err);
          callback(err);
          return;
        }
        else if(rows[0] === 0) {
          callback("User is already not a member of list");
          return;
        }
        callback("User successfully removed");
      });
    })

    socket.on('unsubscribeFromList', (roomName) => {
      socket.leave(roomName, (err) => {console.log(err);});
    });

    socket.on('getListItems', (listId, roomName, callback) => {
      listQueries.getAllItems(listId, (err, items) => {
        if (err) {
          console.log(err);
          callback("Get list items failed");
        }
        else {
          var itemData = [];
          for (var i = 0; i < items.length; i++) {
            itemData.push({id: items[i].id, itemName: items[i].itemName, complete: items[i].complete});
          }
          callback(itemData);
          socket.join(roomName);
        }
      });
    });

    socket.on('createListItem', (listItem, roomName, callback) => {
      listQueries.createListItem(listItem, (err, newItem) => {
        if(err) {
          console.log(err);
          callback(err, false);
        }
        else {
          callback(null, true);
          socket.to(roomName).emit('listUpdate', {oldItem: null, newItem: newItem, op:"create"});
        }
      });
    });

    socket.on('deleteListItem', (itemId, roomName, callback) => {
      listQueries.deleteListItem(itemId, (err, rows) => {
        if(err) {
          console.log(err);
          callback(err, false);
        }
        else {
          callback("Deleted " + rows + " lists", true);
          socket.to(roomName).emit('listUpdate', {oldItem: listItem, newItem: null, op:"delete"});
        }
      });
    });

    socket.on('updateListItem', (listItem, roomName, callback) => {
      listQueries.updateListItem(listItem, (err, rows) => {
        if(err) {
          console.log(err);
          callback(err, false);
        }
        else {
          callback("Item Updated", true);
          socket.to(roomName).emit('listUpdate', {oldItem: null, newItem: listItem, op:"update"});
      });
    });
  }
}
