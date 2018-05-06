/**
 * Break out the child and parent process here to make the index.js nicer to read
 */
const _ = require('lodash');
const chalk = require('chalk');
const { join } = require('path');
const { fork } = require('child_process');
const watcher = join(__dirname, 'watcher');
console.log(watcher);
// Main
module.exports = config => {
  if (config.enable && config.dir && _.isFunction(config.callback)) {
    const p = fork(watcher);
    p.on('message', m => {
      switch (m.type) {
        case 'change':
          config.callback(m.files);
          break;
        case 'error':
          console.log(chalk.red('[serverReload error]', config.err));
          break;
        default:
      }
    });
    // Trigger the start process
    p.send({
      type: 'start',
      dir: config.dir,
      debounce: config.debounce,
      verbose: config.verbose
    });
    // Return a terminal method
    return () => {
      p.send({ type: 'exit' });
      // Terminal this subprocess as well
      p.kill();
      if (config.verbose) {
        console.log(chalk.yellow('[serverReload exited]'));
      }
    };
  }
  // Return an empty method
  return () => {};
};
