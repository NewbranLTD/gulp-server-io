#!/usr/bin/env node
/**
 * This is for quick testing a folder so we will be using the gulp version
 * Therefore it's not suitable for deployment
 */
const { gulp } = require('./gulp');
const server = require('./index');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const _ = require('lodash');
const argv = require('yargs')
  .option('dir', {
    alias: 'd',
    default: ''
  })
  .option('port', {
    alias: 'p',
    default: 8000
  })
  .option('host', {
    alias: 'h',
    default: 'localhost'
  })
  .option('config', {
    alias: 'c',
    default: ''
  }).argv;
const serve = () => {
  let dirs;
  if (!argv.dir || _.isEmpty(argv.dir)) {
    console.log(chalk.red('dir can not be empty! --d /path/to/file/you/want/to/serve'));
    return;
  }
  // They might want to pass as array
  dirs = argv.dir.split(',');
  // Serve
  gulp.src(dirs.map(d => path.resolve(d))).pipe(
    server(
      (function() {
        let config;
        // Use the config to ovewrite everything else
        if (argv.config) {
          config = fs.readJsonSync(argv.config);
          if (!config) {
            throw new Error(['configuration file', argv.config, 'not found!'].join(' '));
          }
        } else {
          config = {};
          if (argv.port) {
            config.port = argv.port;
          }
          if (argv.host) {
            config.host = argv.host;
          }
        }
        return config;
      })()
    )
  );
};
// Run
serve();
