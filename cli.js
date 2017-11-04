#!/usr/bin/env node
// This is under development
// Const server = require('./server');
require('yargs') // eslint-disable-line
  .command(
    'serve [webroot]',
    'start the server',
    yargs => {
      yargs.positional('webroot', {
        describe: '',
        default: './app'
      });
    },
    argv => {
      if (argv.verbose) {
        console.info(`start server on :${argv.port}`);
      }
      /*
      Server({
        port: argv.weboot
      });
      */
      console.log('call execute', argv);
    }
  )
  .option('verbose', {
    alias: 'v',
    default: false
  }).argv;
