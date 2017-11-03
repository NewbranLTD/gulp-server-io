/**
 * This is breaking out to deal with the injecting reload.js script and
 * the debugger scripts
 */
const scriptInject = require('./script-inject');
module.exports = function(features, config) {
  let scripts = [];
  if (features.reload) {
    scripts.push('/reload/reload.js');
  }
  if (features.debugger) {
    scripts.concat(['/socket.io/socket.io.js', config.debugger.js]);
  }
  return scriptInject({
    snippet: scripts.map(s => `<script type="text/javascript" src=${s}></script>`)
  });
};
