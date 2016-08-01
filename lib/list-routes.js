'use strict';

var fs = require('fs');
var listMethod = require('./json-store-method-handlers');
var persistInfo = require('./json-store-info');
var contentTypes = {};

// Check to see if there are already files in the json store.
var fileCount = persistInfo.filesExtant();

console.log('There are ' + fileCount + ' files in the json store.');
contentTypes.text = {'Content-Type': 'text/plain'};

module.exports = function(req, res) {

  // parse the request url into an array of each path part
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
  // Anything but a POST request will be accessing an already extant resource.
  // If the request method is not found, it is rejected by the server.
  if (req.method === 'POST') {
    listMethod.POST(req, res, ++fileCount);
  } else if (resFound) {
    if (req.method === 'GET') {
      listMethod.GET(req, reqResource, res);
    } else if (req.method === 'PUT') {
      listMethod.PUT(req, reqResource, res);
    } else if (req.method === 'PATCH') {
      listMethod.PATCH(req, reqResource, res);
    } else if (req.method === 'DELETE') {
      listMethod.DELETE(req, reqResource, res);
    }
  } else {
    res.writeHead(400, contentTypes.text);
    res.write('Error 400: Bad request.');
    res.end();
  }
};
