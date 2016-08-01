'use strict';

var fs = require('fs');

var jsonInfo = {};

jsonInfo.filesExtant = function() {

  if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
  }
  var filesInDir = fs.readdirSync('./data');
  this.fileCount = filesInDir.length;
  return filesInDir.length;
};

module.exports = jsonInfo;
