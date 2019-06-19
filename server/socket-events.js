const io = require("socket.io")();
const listQueries = require('../db/queries/grocerylistqueries.js');

module.exports = {

eventConfig (socket) {
    console.log("Client connected");

    socket.on('getGLists', (userId) => {
      var lists = listQueries.getGroceryLists(userId, (err, lists) => {
        if (err) {
          console.log(err);
        }
        else {
          var listData = [];
          for (var i = 0; i < lists.length; i++) {
            listData.push(lists[i].id);
            listData.push(lists[i].listName);
          }
          socket.emit('gListResponse', {data: listData});
        }
      });
    });

    socket.on('getGlistItems', (list) => {
      var roomName = list.id.concat(list.name);
      var items = listQueries.getAllItems(list.id, (err, items) => {
        if (err) {
          console.log(err);
        }
        else {
          var itemData = [];
          for (var i = 0; i < items.length; i++) {
            itemData.push(items[i].id);
            itemData.push(items[i].itemName);
            itemData.push(items[i].complete);
          }
        }
      });

      socket.join(roomName, () => {
        socket.to(roomName).emit('listItemsResponse', {data: itemData});
      });
    });

    socket.on('listItemDelete', (data) => {
      var roomName = data.listId.concat(data.listName);
      //run query to delete
      //run new query to get updated list
      //emit to the room
    });

    socket.on('listItemAdd', (data) => {

    });
  }
}
