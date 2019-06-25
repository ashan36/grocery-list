import io from 'socket.io-client';

export class SocketHandler {

  constructor() {
    this.socket = io();
  }

  registerForUpdates(callback) {
    this.socket.on('listUpdate', (data) => {
      callback(data);
    });
  }

  getGLists(userId, callback) {
    this.socket.emit('getGLists', userId, (data) => {
      callback(data);
    });
  }

  createList(listName, callback) {
    this.socket.emit('createNewList', listName, (message) => {
      callback(message);
    });
  }

  deleteList(listId, callback) {
    this.socket.emit('deleteList', listId), (message) => {
      callback(message);
    };
  }

  addListUser(email, callback) {
    this.socket.emit('addListUser', email, (message) => {
      callback(message);
    });
  }

  listUnsubscribe(roomName) {
    this.socket.emit("unsubscribeFromList", roomName);
  }

  getListItems(listId, roomName, callback) {
    this.socket.emit("getListItems", listId, roomName, (data) => {
      callback(data);
    });
  }

  createListItem(listItem, roomName,  callback) {
    this.socket.emit("createListItem", listItem, roomName, (message) => {
      callback(message);
    });
  }

  deleteListItem(itemId, roomName, callback) {
    this.socket.emit("deleteListItem", itemId, roomName, (message) => {
      callback(message);
    });
  }

  toggleCompleteItem(itemId, roomName, callback) {
    this.socket.emit("completeItem", itemId, roomName, (message) => {
      callback(message);
    });
  }

  updateListItem(listItem, roomName, callback) {
    this.socket.emit("updateListItem", listItem, roomName, (message) => {
      callback(message);
    })
  }
}
