'use strict';

var chai = require('chai');
var chaihttp = require('chai-http');
var fs = require('fs');
var expect = chai.expect;
var sendData;
var modData;
var compareData;

require('../index');

chai.use(chaihttp);

describe('Server/list should respond to http request methods.', function() {

  before(function() {
    fs.writeFileSync('./data/data1.json', JSON.stringify({test: 'data', num: 45, id: 1}));
    fs.writeFileSync('./data/data2.json', JSON.stringify({test: 'data', num: 45, id: 2}));
    fs.writeFileSync('./data/data3.json', JSON.stringify({test: 'data', num: 45, id: 3}));
  });

  it('GET request should send file info if requested resource exists.', function(done) {
    chai.request('localhost:3333')
      .get('/list/1')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        done();
      });
  });

  it('POST request should create a new resource', function(done) {
    chai.request('localhost:3333')
      .post('/list')
      .send({weight: 50, speed: 78, scanRange: 15, commRange: 120})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);

        done();
      });
  });

  it('PUT request should replace data', function(done) {
    chai.request('localhost:3333')
      .put('/list/3')
      .send({weight: 50, speed: 78, scanRange: 15, commRange: 120})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);

        done();
      });
  });

  it('PATCH request should replace data correctly', function(done) {
    sendData = {test: 'theProgram', weight: 50, speed: 78};
    compareData = {test: 'theProgram', weight: 50, speed: 78, id: 2, num: 45};
    chai.request('localhost:3333')
      .patch('/list/2')
      .send(sendData)
      .end(function(err, res) {
        modData = JSON.parse(fs.readFileSync('./data/data2.json'));
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(modData).to.eql(compareData);
        done();
      });
  });

  it('DELETE delete the requested resource.', function(done) {
    chai.request('localhost:3333')
      .delete('/list/3')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        done();
      });
  });

  after(function() {
    fs.unlinkSync('./data/data1.json');
    fs.unlinkSync('./data/data2.json');
    // fs.unlinkSync('./data/data3.json'); // This is deleted by the delete test
    fs.unlinkSync('./data/data4.json');
  });
});
