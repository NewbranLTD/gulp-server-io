'use strict';
/**
 * Testing the standalone server setup
 */
const path = require('path');
const request = require('supertest');
const standaloneSrv = require('../../server');
// Properties
const root = path.join(__dirname, '..', 'fixtures', 'app');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// change port to 3838
describe('Testing the gulp-server-io/server with different port number 3838', () => {
  let server1;
  const url1 = 'http://localhost:3838';
  beforeEach(() => {
    server1 = standaloneSrv({
      webroot: root,
      port: 3838
    });
  });
  afterEach(() => {
    server1.close();
  });
  test(`It should connect to ${url1}`, () => {
    return request(url1)
      .get('/')
      .expect(200, /Bootstrap Template test for gulp-server-io/);
  });
});
// change path to /sub
describe('Testing the gulp-server-io/server serve from different path /sub', () => {
  let server2;
  const url2 = 'http://localhost:8000';
  const path2 = '/sub';
  beforeEach(() => {
    server2 = standaloneSrv({
      webroot: root,
      path: path2
    });
  });
  afterEach(() => {
    server2.close();
  });
  test(`It should connect to ${url2}${path2}`, () => {
    return request(url2)
      .get(path2)
      .expect(200, /Bootstrap Template test for gulp-server-io/);
  });
});
