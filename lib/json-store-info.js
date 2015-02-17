'use strict';

var fs = require('fs');

var jsonInfo = exports = module.exports = {}; // jshint ignore: line

jsonInfo.filesExtant = function() {

	// Program relies on 'data' directory, check existence
	if (!fs.existsSync('./data/')) {
	  fs.mkdirSync('./data/');
	}
	var filesInDir = fs.readdirSync('./data/');
	this.fileCount = filesInDir.length;
	return filesInDir.length;
};
