#!/usr/bin/env node
/**
 * This is for quick testing a folder so we will be using the gulp version
 * Therefore it's not suitable for deployment
 */
// const { gulp } = require('./gulp');
// const server = require('./index');
// const fs = require('fs-extra');

require('yargs') // eslint-disable-line
  .command(
    '[webroot]',
    'start the gulp server',
    yargs => {
      yargs.positional('webroot', {
        describe: 'Where the file to serve',
        default: './dest'
      });
    },
    argv => {
      console.log('call execute', argv);
    }
  )
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
