/**
 * This file will only get call from the main setup process as a fork process
 * And communicate back via the subprocess.send
 */
const streamWatcher = require('./stream-watcher');
let fn = () => {};
/**
 * Watcher - moving back from the gulp.js export
 * Rename from watcher --> fileWatcher
 * @param {mixed} filePaths array of string
 * @param {boolean} verbose param pass to the streamWatcher should show console.log or not
 * @param {int} debounce ms to determine when the callback should execute
 * @param {function} callback function to execute when file change
 * @return {function} the streamWatcher terminate callback
 */
const fileWatcher = (filePaths, verbose = true, debounce = 500, callback) => {
  let files = [];
  return streamWatcher(filePaths, verbose)
    .doAction(f => files.push(f))
    .debounce(debounce)
    .onValue(() => {
      if (files.length) {
        callback(files);
        // Reset
        files = [];
      }
    });
};
/**
 * This is when we received call from the parent process
 */
process.on('message', m => {
  switch (m.type) {
    case 'start':
      try {
        fn = fileWatcher(m.dir, m.verbose, m.debounce, files => {
          process.send({ type: 'change', files: files });
        });
      } catch (e) {
        process.send({ type: 'error', err: e });
      }
      break;
    case 'exit':
      fn();
      break;
    default:
  }
});
// Report it
module.exports = fileWatcher;
