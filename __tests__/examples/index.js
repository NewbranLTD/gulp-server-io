/**
 * Just to test out feature in bits
 */
const chalk = require('chalk');
const { createConfiguration } = require('../../src/lib/options');
/*
const options = {
  https: {
    devCrtPem: '/path/to/cert.crt',
    devKeyPem: '/path/to/cert.pem'
  },
  debugger: false,
  serverReload: true,
  mock: {
    enable: true
  },
  proxies: {
    source: '/api',
    target: 'http://localhost:3000'
  },
  indexes: 'amp.html'
};
*/
const options = {
  path: '/custom',
  debugger: false,
  reload: false,
  open: false
};

const config = createConfiguration(options);

// console.log(chalk.yellow(JSON.stringify(config, null, 2)));

// Use this same file to test out the watcher function
const { watcher } = require('../../export');
const fs = require('fs-extra');
const { join } = require('path');
const { directoryIndexMissingDirRaw } = require('../fixtures/config.js');
const target = 'package.json';
let closeFn;

closeFn = watcher(directoryIndexMissingDirRaw, function(files) {
  files.forEach( f => {
    console.log('file touched', f);
    if (f.path.indexOf(target) > -1) {
      console.log('target touched', target);
      // fs.writeJsonSync(pkgFile, data);
      // done();
    }
  });
});
