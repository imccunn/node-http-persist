'use strict';

var http = require('http'),
    path = require('path'),
    listRoute = require('./list-routes'),
    routes = {},
    reqUrlParts,
    dirPath = [],
    alphaNumMatch = /([A-Za-z0-9])+/g;

routes['/list'] = listRoute;

var Server = {};
module.exports = Server;

Server.def = http.createServer(function(req, res) {

  // Parse URL
  reqUrlParts = req.url.split('/');

  for (var i = 1; i < reqUrlParts.length; i++) {
    if (alphaNumMatch.test(reqUrlParts[i])) {
      dirPath.push('/' + reqUrlParts[i]);
    }
  }

  // If the route exists we call that route passing in the req and res objects
  if (typeof(routes[dirPath[0]]) === 'function') {
    routes[dirPath[0]](req, res);
  } else {
    console.log('Page not found from req.');
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404: page not found');
    res.end();
  }
});

Server.start = function(portNumber) {
  this.def.listen(portNumber, function() {
    console.log('The server is listening on port ', portNumber);
  });
};
