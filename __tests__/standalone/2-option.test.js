'use strict';
/**
 * Testing the standalone server setup
 */
const path = require('path');
const request = require('supertest');
const standaloneSrv = require('../../server');
// Properties
const root = path.join(__dirname, '..', 'fixtures', 'app');

// change port to 3838
describe('Testing the gulp-server-io/server with different port number 3838', () => {
  let server;
  const url1 = 'http://localhost:3838';
  beforeEach(() => {
    server = standaloneSrv({
      webroot: root,
      port: 3838
    });
  });
  afterEach(() => {
    server.close();
  });
  test(`It should connect to ${url1}`, () => {
    return request(url1)
      .get('/')
      .expect(200, /Bootstrap Template test for gulp-server-io/);
  });
});
// change path to /sub
/*
describe('Testing the gulp-server-io/server serve from different path /sub', () => {
  let server;
  const url2 = 'http://localhost:8000/sub';
  beforeEach(() => {
    server = standaloneSrv({
      webroot: root,
      path: '/sub'
    });
  });
  afterEach(() => {
    server.close();
  });
  test(`It should connect to ${url2}`, () => {
    return request(url2)
      .get('/')
      .expect(200, /Bootstrap Template test for gulp-server-io/);
  });
});
*/
