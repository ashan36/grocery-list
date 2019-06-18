const express = require("express");
const path = require('path');
const app = express();
const config = require("./config.js");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

config.init(app, express);

module.exports = app;
