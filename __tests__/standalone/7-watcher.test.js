'use strict';
/**
 * Testing the exported stream watcher function
 */
const { watcher } = require('../../gulp');
const fs = require('fs-extra');
const { join } = require('path');
const target = 'package.json';
const dir = join('..', 'fixtures', 'directoryIndexMissing');
const file = join('..', 'fixtures', 'directoryIndexMissing', target);
const data = {version: '1.0.1'};
// Run
describe('Testing the exported watcher [stream watcher] function', () => {
  let closeFn;
  beforeAll( (done) => {
    closeFn = watcher(dir, function(files) {
      files.forEach( f => {
        if (f.indexOf(target) > -1) {
          fs.writeJsonSync(file, data);
        }
      });
    });
    // Wait 1 second then touch the content in the folder
    setTimeout( () => {
      fs.writeJsonSync(file, {todo: true});
      done();
    }, 1000);
  });
  // clean up
  afterAll( () => {
    closeFn();
    fs.writeJsonSync(file, {version: '1.0.0', todo: false});
  });

  it('Should able to see files changed and react', () => {
    expect(fs.readJsonSync(file)).toHaveProperty(data);
  });

});
