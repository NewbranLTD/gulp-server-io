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
describe('Testing the standlone setup via the gulp-server-io/server', () => {
  let server;
  beforeEach(() => {
    server = standaloneSrv({
      path: root,
      reload: false
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
