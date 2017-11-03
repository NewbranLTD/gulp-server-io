/**
 * This is breaking out to deal with the injecting reload.js script and
 * the debugger scripts
 */
const scriptInject = require('./script-inject');
/**
 * @param {object} features toggle
 * @param {object} config the main config
 * @return {function} middleware
 */
module.exports = function(features, config) {
  let scripts = [];
  if (features.reload) {
    scripts.push('/reload/reload.js');
  }
  if (features.debugger) {
    // @TODO if they change the debugger config
    // we might have to do additional checks here just in case
    scripts = scripts.concat([
      '/socket.io/socket.io.js',
      [config.debugger.namespace, config.debugger.js].join('/')
    ]);
  }
  console.log('scripts', scripts);
  return scriptInject({
    snippet: scripts
      .map(s => `<script type="text/javascript" src="${s}"></script>`)
      .reduce((a, b) => a + b, '')
  });
};
