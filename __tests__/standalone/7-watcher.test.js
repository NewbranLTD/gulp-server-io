'use strict';
/**
 * Testing the exported stream watcher function
 */
const { watcher } = require('../../gulp');
const fs = require('fs-extra');
const { join } = require('path');
const { directoryIndexMissingDirRaw } = require('../fixtures/config.js');

const target = 'package.json';
const pkgFile = join(directoryIndexMissingDirRaw, target);
const data = {version: '1.0.1', todo: false};
// Run
describe('Testing the exported watcher [stream watcher] function', () => {
  let closeFn;
  beforeAll( (done) => {
    closeFn = watcher(directoryIndexMissingDirRaw, function(files) {
      files.forEach( f => {
        console.log('file touched', f);
        if (f.path.indexOf(target) > -1) {
          console.log('target touched');
          fs.writeJsonSync(pkgFile, data);
          done();
        }
      });
    });
    // Wait 1 second then touch the content in the folder
    setTimeout( () => {
      fs.writeJsonSync(pkgFile, {todo: true});
    }, 1000);
  });
  // clean up
  afterAll( () => {
    closeFn();
    fs.writeJsonSync(pkgFile, {version: '1.0.0', todo: false});
  });

  test.skip('Should able to see files changed and react', () => {
    const content = fs.readJsonSync(pkgFile);
    expect(content).toHaveProperty('version', '1.0.1');
  });

});
