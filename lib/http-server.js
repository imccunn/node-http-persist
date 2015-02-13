'use strict';

var serv = exports = module.exports = {};

var http = require('http');
var listRoute = require('./list-routes');

var contentTypes = {};
contentTypes['json'] = {'Content-Type': 'application/json'};
contentTypes['text'] = {'Content-Type': 'text/plain'};

var routes = [];
routes['/list'] = listRoute;


serv.def = http.createServer(function(req, res) {

    // parse URL on my own
    var reqUrlParts = req.url.split('/');
    console.log(reqUrlParts);
    var dirPath = [];
    for (var i = 0; i < reqUrlParts.length; i++) {
      if (reqUrlParts[i] !== '' && reqUrlParts[i] !== '/') dirPath.push(reqUrlParts[i]);  
    }
    
    // if (reqUrlParts[0] === '') reqUrlParts.shift();
    // if (reqUrlParts[reqUrlParts.length-1] === '') reqUrlParts.pop();
    console.log(reqUrlParts);

    // if the route exists we call that route passing in the req and res objects
    if (typeof(routes[req.url]) === 'function') {
      routes[req.url](req, res);
    } else  {
      console.log('Page not found from req.');
      res.writeHead(404, contentTypes['json']);
      res.write(JSON.stringify({msg: 'Page not found.'}));
      res.end();
    }
  });


serv.start = function() {
  this.def.listen(3333, function() {
    console.log('The server is listening.');
  });

};


