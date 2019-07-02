import io from 'socket.io-client';

export default class SocketHandler {

  constructor() {
    this.socket = io();

    this.updateRegister = [];
    this.socket.on('dataUpdate', (data) => {
      console.log("received an update! " + data.op);
      for (var i = 0; i < this.updateRegister.length; i++) {
        try {
          console.log("calling ");
          console.log(this.updateRegister[i].id);
          this.updateRegister[i].fn(data);
        }
        catch {
          this.updateRegister.splice(i, 1);
          return;
        }
      }
    });
  }

  signIn(email) {
    this.socket.emit('signIn', email);
  }

  registerForUpdates(signature, callback) {
    console.log("registering");
    console.log(signature);
    var foundIndex = this.updateRegister.findIndex((value) => {return (value.id === signature)});
    if (foundIndex !== -1) {
      return;
    }
    else {
      var fnWrapper = {id: signature, fn: callback};
      this.updateRegister.push(fnWrapper);
    }
  }

  deregisterForUpdates(signature) {
    console.log("Deregistering");
    console.log(signature);

    for (var i = 0; i < this.updateRegister.length; i++) {
      if(this.updateRegister[i].id === signature) {
        this.updateRegister.splice(i, 1);
        return;
      }
    }
  }

  getGLists(userId, callback) {
    this.socket.emit('getGLists', userId, (message, data) => {
      if(data != null) {
        callback(message, data);
      }
      else {
        console.log(message);
        callback(message, false);
      }
    });
  }

  getListMembers(listId, callback) {
    this.socket.emit('getListMembers', listId, (message, data) => {
      if(data != null) {
        callback(message, data);
      }
      else {
        console.log(message);
        callback(message, false);
      }
    });
  }

  createList(listName, userId, callback) {
    this.socket.emit('createNewList', listName, userId, (message, data) => {
      if(data != null) {
        callback(message, data);
      }
      else {
        console.log(message);
        callback(message, false);
      }
    });
  }

  deleteGList(listId, roomName, callback) {
    this.socket.emit('deleteGList', listId, roomName, (message, success) => {
      callback(message, success);
    });
  }

  updateGList(gList, userId, roomName, callback) {
    if(gList.createdBy !== userId) {
      callback("Only list owner may edit list properties", false);
      return;
    }
    this.socket.emit('updateGList', gList, userId, roomName, (message, success) => {
      callback(message, success);
    });
  }

  addListUser(email, listId, roomName, callback) {
    this.socket.emit('addListUser', email, listId, roomName, (message, data) => {
      callback(message, data);
    });
  }

  removeListUser(userId, listId, roomName, callback) {
    this.socket.emit('removeListUser', userId, listId, roomName, (message, success) => {
      callback(message, success);
    });
  }

  subscribe(roomName) {
    this.socket.emit("subscribeToList", roomName);
  }

  unsubscribe(roomName) {
    this.socket.emit("unsubscribeFromList", roomName);
  }

  getListItems(listId, callback) {
    this.socket.emit("getListItems", listId, (message, data) => {
      if(data != null) {
        callback(message, data);
      }
      else {
        console.log(message);
        callback(message, false);
      }
    });
  }

  createListItem(listItem, roomName,  callback) {
    this.socket.emit("createListItem", listItem, roomName, (message, data) => {
      if(data != null) {
        callback(message, data);
      }
      else {
        console.log(message);
        callback(message, false);
      }
    });
  }

  deleteListItem(itemId, roomName, callback) {
    this.socket.emit("deleteListItem", itemId, roomName, (message, success) => {
      callback(message, success);
    });
  }

  updateListItem(listItem, roomName, callback) {
    this.socket.emit("updateListItem", listItem, roomName, (message, success) => {
      callback(message, success);
    })
  }
}
