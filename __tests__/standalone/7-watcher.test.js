'use strict';
/**
 * Testing the exported stream watcher function
 */
const fs = require('fs-extra');
const { join } = require('path');
const { directoryIndexMissingDirRaw } = require('../fixtures/config.js');

const target = 'package.json';
const pkgFile = join(directoryIndexMissingDirRaw, target);
const dest = join(__dirname, '..', '.tmp', 'package.json');
fs.copySync(pkgFile, dest);
// New 1.4.0-beta.11 copy this to a .tmp folder and don't touch the original
const data = {version: '1.0.1', todo: false};
// Run
describe('Testing the exported watcher [stream watcher] function', () => {
  /*
  let closeFn;
  beforeAll( (done) => {
    closeFn = fileWatcher(dest, function(files) {
      files.forEach( f => {
        // console.log('file change', f);
        if (f.path.indexOf(target) > -1) {
          // console.log('target touched');
          fs.writeJsonSync(dest, data);
          done();
        }
      });
    });
    // Wait 1 second then touch the content in the folder
    setTimeout( () => {
      fs.writeJsonSync(dest, {todo: true});
    }, 1000);
  });
  // clean up
  afterAll( () => {
    closeFn();
    // just remove the file
    fs.remove(dest);
    // fs.writeJsonSync(dest, {version: '1.0.0', todo: false});
  });
  */
  test.skip('Should able to see files changed and react', () => {
    const content = fs.readJsonSync(dest);
    expect(content).toHaveProperty('version', '1.0.1');
  });

});
