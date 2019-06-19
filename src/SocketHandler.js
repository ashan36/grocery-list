import io from 'socket.io-client';
const socket = io();

export function getLists(userId, callback) {
  socket.emit('getGLists', userId);
  socket.on('gListResponse', (data) => {
    callback(data);
  });
}
