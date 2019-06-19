const express = require("express");
const path = require('path');
const app = express();
const config = require("./config.js");

config.init(app, express);

module.exports = app;
