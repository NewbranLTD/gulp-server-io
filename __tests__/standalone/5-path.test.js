'use strict';
/**
 * Testing the standalone server setup
 */
const path = require('path');
const request = require('supertest');
const standaloneSrv = require('../../server');
// Properties
const root = path.join(__dirname, '..', 'fixtures', 'app');
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
      .expect(301);
  });
});
