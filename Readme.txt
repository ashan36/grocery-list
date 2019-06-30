Database - PostGRES
ORM - Sequelize
Backend - Node.js
Static Route Handler - Express
Client syncing - Socket.io
Frontend - React
Deployment - Heroku
TTD - Jasmine

Socket.io Events
  Listen Events
    getGLists (userId, ack(message, [data]))
    getListMembers (listId, ack(message, [data]))
    createNewList (listName, userId, ack(message, data))
    deleteGList (listId, roomName, ack(message, boolean))
    updateGList (gList, userId, roomName, ack(message, boolean))
    addListUser (email, listId, roomName, ack(message, boolean || data))
    removeListUser (userId, listId, roomName, ack(message, boolean))
    subscribeToList (roomName)
    unsubscribeFromList (roomName)
    getListItems (listId, ack(message, [data]))
    createListItem (listItem, roomName, ack(message, data))
    deleteListItem (itemId, roomName, ack(message, boolean))
    updateListItem (listItem, roomName, ack(message, boolean))

  Emit Events
    dataUpdate (dataObj) //see possible data objects below
      item updated {op: "updateitem", newItem: listItem}
      item deleted {op: "deleteitem", oldItemId: id}
      item created {op: "createitem", newItem: listItem}
      member added {op: "addmember", newUser: user}
      member removed {op: "removemember", removedUserId: userId, removedListId: listId}
      list updated { op: "updatelist", gList: gList}
      list deleted {op: "deletelist", listId: id}
      list shared {op: "sharelist"} //trigger a list refresh
