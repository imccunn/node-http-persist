'use strict';

var fs = require('fs');

var log = console.log;

var contentTypes = {};
contentTypes['json'] = {'Content-Type': 'application/json'};
contentTypes['text'] = {'Content-Type': 'text/plain'};

var fileCount = 0;

module.exports = function(req, res) {
  var input = '';

  if(req.method === 'GET') {
  	 res.writeHead(200, contentTypes['text']);
  	 fs.readFile('./lib/data/data.txt', 'utf-8', function(err, data) {
  	 	if (err) {
  	 		res.write('content not found');
  	 		res.end();
  	 	}
  	 	res.write(data.toString());
  	 	res.end();
  	 });
  	 //res.write('You have made a get request. Here is some content.\n')
  	 //res.end();
  } else if (req.method === 'POST') {
    req.on('data', function(data) {
      input += data.toString('utf-8');
      fileCount++;
      fs.writeFile('./lib/data/data' + fileCount + '.txt', input, function(err) {
      	log('information was written to a file.');
      });
    });

    req.on('end', function(data) {
      var parsed = JSON.parse(input);
      parsed.msg = 'This was added on the server';
      res.writeHead(200, contentTypes['json']);
      var resContent = JSON.stringify(parsed);

      res.write(resContent);
      res.end();
    });
  } else if (req.method === 'PUT') { // replace something that's already there
  	log('A PUT request was made');
      
  } else if (req.method === 'PATCH') {
  	log('A PATCH request was made');
  	
  } else if (req.method === 'DELETE') {
  	log('A DELETE request was made');
  	
  }

};