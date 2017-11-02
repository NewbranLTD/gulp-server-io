#!/usr/bin/env node
const server = require('./server');
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
      server({
        port: argv.weboot
      });
    }
  )
  .option('verbose', {
    alias: 'v',
    default: false
  }).argv;
