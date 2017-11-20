#!/usr/bin/env node
/**
 * This is for quick testing a folder so we will be using the gulp version
 * Therefore it's not suitable for deployment
 */
// const { gulp } = require('./gulp');
// const server = require('./index');

require('yargs') // eslint-disable-line
  .command(
    '[webroot]',
    'start the server',
    yargs => {
      yargs.positional('webroot', {
        describe: '',
        default: './dest'
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
  .option('port', {
    alias: 'p',
    default: 8000
  })
  .option('host', {
    alias: 'h',
    default: 'localhost'
  })
  .option('verbose', {
    alias: 'v',
    default: false
  }).argv;
