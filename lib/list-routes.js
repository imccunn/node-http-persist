'use strict';

var fs = require('fs');
var listMethod = require('./json-store-method-handlers');
var persistInfo = require('./json-store-info');
var contentTypes = {};

var fileCount = persistInfo.filesExtant();

console.log('There are ' + fileCount + ' files in the json store.');
contentTypes.text = {'Content-Type': 'text/plain'};

module.exports = function(req, res) {

  fileCount = persistInfo.filesExtant();
  console.log(req.url);
  var reqUrlParts = req.url.split('/');
  var dirPath = [];
  var reqResource;
  var resFound;
  var i;

  for (i = 1; i < reqUrlParts.length; i++) {
    if (reqUrlParts[i] !== '' && reqUrlParts[i] !== '/') {
      dirPath.push(reqUrlParts[i]);
    }
  }

  reqResource = dirPath[1];
  resFound = (reqResource !== undefined && reqResource <= fileCount);

  console.log(req.method);

  if (req.method === 'POST') {
    listMethod.POST(req, res, ++fileCount);
  } else if (resFound) {
    listMethod[req.method](req, reqResource, res);
  } else {
    res.writeHead(400, contentTypes.text);
    res.write('Error 400: Bad request.');
    res.end();
  }
};
