'use strict';
/**
 * test the cli method
 */
const path = require('path');
const request = require('supertest');
const spawn = require('child_process').spawn;
// we are going run directly against the node in cmd
const cli = '../../cli.js';
const root = path.join(__dirname, '..', 'fixtures', 'app');
const configFile = path.join(__dirname, '..', 'fixtures', 'config.json');

describe('Test the meow cli', () => {
  let proc;
  const stock = [cli, root];
  const run = fn => setTimeout( fn , 500);

  afterEach( () => {
    proc.kill('SIGINT');
    proc = undefined;
  });

  test('run at stock option', done => {
    proc = spawn('node', stock);
    // default option
    run( () => {
      request('http://localhost:8000')
      .get('/')
      .expect(200)
      .end( () => done());
    });
  });

  test('run with different port number 3000', done => {
    proc = spawn('node', stock.concat(['--p', 3000]));
    run( () => {
      request('http://localhost:3000')
        .get('/')
        .expect(200)
        .end( () => done());
    });
  });

  test('run with different host 0.0.0.0', done => {
    proc = spawn('node' , stock.concat(['--h', '0.0.0.0']));
    run( () => {
      request('http://0.0.0.0:8000')
        .get('/')
        .expect(200)
        .end( () => done());
    });
  });

  test('run with config file', done => {
    proc = spawn('node', stock.concat(['--c', configFile]));
    run( () => {
      request('http://0.0.0.0:3000')
        .get('/')
        .expect(200)
        .end( () => done() );
    });
  });
});
