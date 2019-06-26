Database - PostGRES
ORM - Sequelize
Backend - Node.js
Static Route Handler - Express
Client syncing - Socket.io
Frontend - React
Deployment - Heroku
TTD - Jasmine

1. Setup environment - done
2. Rudimentary React components for views - done
3. Setup ORM model and DB - done and tested
4. Write module to provide methods to interact with database (CRUD query interface) - done and tested
5. Authenticate users - done and tested
6. Setup real time syncing with Socket.io - done
7. Complete the UI features - ongoing
8. Deploy

Socket.io Events
Listen Events
getGLists (userId, ack(message, [data]))
createNewList (listName, userId, ack(message, data))
deleteList (listId, ack(message, boolean))
addListUser (email, listId, ack(message, boolean))
removeListUser (userId, listId, ack(message, boolean))
unsubscribeFromList (roomName)
getListItems (listId, roomName, ack(message, [data]))
createListItem (listItem, roomName, ack(message, boolean))
deleteListItem (itemId, roomName, ack(message, boolean))
updateListItem (listItem, roomName, ack(message, boolean))

Emit Events
listUpdate (dataObj) //see possible data objects below
if update {oldItem: null, newItem: listItem, op: "update"}
if delete {oldItem: listItem, newItem: null, op: "delete"}
if create {oldItem: null, newItem: listItem, op: "create"}
