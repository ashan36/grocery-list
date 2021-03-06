const app = require("./app");
const http = require("http");
const socketIo = require("socket.io");
const socketEvents = require("./socket-events.js");

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
const io = socketIo(server);

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

server.on("listening", () => {
  console.log(`server is listening for requests on port ${server.address().port}`);
});

io.on('connection', (socket) => socketEvents.eventConfig(socket));

server.listen(port);
