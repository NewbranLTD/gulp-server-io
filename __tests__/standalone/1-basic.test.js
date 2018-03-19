'use strict';
/**
 * Testing the standalone server setup
 */
const path = require('path');
const request = require('supertest');
const standaloneSrv = require('../../server');
// Properties
const root = path.join(__dirname, '..', 'fixtures', 'app');
// Start test
describe('Testing the default gulp-server-io/server setup for standalone server', () => {
  let server;
  beforeEach(() => {
    server = standaloneSrv({
      webroot: root
    });
  });

  afterEach(() => {
    server.close();
  });

  test('It should run with default option', () => {
    return request(server)
      .get('/')
      .expect(200, /Bootstrap Template test for gulp-server-io/);
  });
});
