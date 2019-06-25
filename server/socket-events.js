const io = require("socket.io")();
const listQueries = require('../db/queries/grocerylistqueries.js');

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
      listQueries.
    });

    socket.on('deleteList', (listId) => {

    });

    socket.on('addListUser', (email, callback) => {

    });

    socket.on('unsubscribeFromList', (roomName) => {

    });

    socket.on('getListItems', (listId, roomName, callback) => {
      var items = listQueries.getAllItems(listId, (err, items) => {
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
      //run query to create
      //callback with request status message
    });

    socket.on('deleteListItem', (itemId, roomName, callback) => {
      //run query to delete
      //callback with request status message
    });

    socket.on('updateListItem', (listItem, roomName, callback) => {

    });

  }
}
