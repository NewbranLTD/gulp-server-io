'use strict';
/**
 * Testing the exported stream watcher function
 */
const { watcher } = require('../../gulp');
const fs = require('fs-extra');
const { join } = require('path');
const dir = join('..', 'fixtures', 'directoryIndexMissing');

describe('Testing the exported watcher [stream watcher] function', () => {
  let closeFn;
  beforeAll( () => {
    closeFn = watcher(dir, function(files) {
      console.log(files);
    });
  });

  it('Should able to see files changed and react', () => {
    
  });

});
