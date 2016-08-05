'use strict';

var http = exports = module.exports = {}; // jshint ignore: line
var fs = require('fs');
var log = console.log;

var contentTypes = {};
contentTypes.json = {'Content-Type': 'application/json'};
contentTypes.text = {'Content-Type': 'text/plain'};

// All methods here take the request object, the requested resource (integer identifier) and the response object.

http.GET = function(req, reqRes, res) {
  console.log(reqRes);
  fs.readFile('./data/data' + reqRes + '.json', function(err, data) {
    if (err) {
      res.writeHead(500, contentTypes.text);
      res.write('content not found');
    } else {
      log('data' + reqRes + '.json was requested and sent.');
      res.writeHead(200, contentTypes.text);
      res.write('You requested data: \n' + data);
    }
    res.end();
  });
};

http.POST = function(req, res, resNum) {
  var data = '';
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    var obj = JSON.parse(data);
    console.log('parsed obj: ', obj);
    obj.id = resNum;

    var toFile = JSON.stringify(obj, null, 2) + '\n';
    fs.writeFile(`./data/data${obj.id}.json`, toFile, function(err) {
      if (err) throw err;
      log('Data was written to a file.');
      console.log(toFile);
      res.writeHead(200, contentTypes.text);
      res.write('JSON sent was written to disk.');
      res.end();
    });
  });
};

http.PUT = function(req, reqRes, res) {
  var data = '';
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    var obj = JSON.parse(data);
    obj.id = reqRes;
    var toFile = JSON.stringify(obj, null, 2) + '\n';
    fs.writeFile('./data/data' + reqRes +'.json', toFile, function (err) {
      if (err) throw err;
      log('data' + reqRes + '.json was overwritten.');
      res.writeHead(200, contentTypes.text);
      res.write('Data replaced.');
      res.end();
    });
  });
};

http.PATCH = function(req, reqRes, res) {
  var input = '';
  req.on('data', function(data) {
    input += data.toString('utf-8');
  });

  req.on('end', function() {
    var dataSentToPatch;
    try {
      dataSentToPatch = JSON.parse(input);
    } catch(e) {
      res.writeHead(400, contentTypes.text);
      res.write('Bad request payload.');
      res.end();
    }

    // Read the file that was requested
    fs.readFile('./data/data' + reqRes + '.json', function(err, data) {
      if (err) throw err;
      var jsonResource = JSON.parse(data);

      // Compare the sent data with the resource data
      for (var key in dataSentToPatch) {
        if(!jsonResource[key]) {
          jsonResource[key] = dataSentToPatch[key];
        } else if (dataSentToPatch[key] !== jsonResource[key]) {
          jsonResource[key] = dataSentToPatch[key];
        }
      }

      var toFile = JSON.stringify(jsonResource);
      fs.writeFile('./data/data' + reqRes + '.json', toFile, function(err) {
        if (err) {
          res.writeHead(500, contentTypes.text);
          res.write('There was a server error when writing the patched information.');
        } else {
          log(`data ${reqRes}.json was patched`);
          res.writeHead(200, contentTypes.text);
          res.write('Data successfully patched.');
        }
        res.end();
      });
    });
  });
};

http.DELETE = function(req, reqRes, res) {
  fs.unlink('./data/data' + reqRes + '.json', function(err) {
    if (err) {
      log('There was an error deleting the file. Requested resource may not exist.');
      res.writeHead(500, contentTypes.text);
      res.write('There was an error deleting the file. It may not exist.');
    } else {
      log(`Resource: ${reqRes} was deleted from the server.`);
      res.writeHead(200, contentTypes.text);
      res.write('The requested resource was deleted.');
    }
    res.end();
  });
};
