var express = require('express');
var path = require('path');
var chalk = require('chalk');

module.exports = function (config) {
  var defaultConfig = {
    root: __dirname,
    port: 3000,
    host: 'localhost'
  }

  config = Object.assign(defaultConfig, config);

  var app = express();

  app.use(express.static(config.root));

  app.get("*", function(req, res){
    res.sendFile(path.resolve(config.root + '/index.html'));
  });

  app.listen(config.port);

  console.log((chalk.cyan('Server started at http://' + config.host + ':' + config.port)));
}