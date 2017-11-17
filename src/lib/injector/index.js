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
    // Const reloadRoute = config.reload.route || 'reload';
    // @2017-11-05 if we change the route it stop working
    // ${reloadRoute}
    // const liveReloadScript = `<script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script>`;
    scripts.push('/reload/reload.js');
  }
  if (features.debugger) {
    // @TODO if they change the debugger config
    // we might have to do additional checks here just in case
    scripts = scripts.concat([
      '/socket.io/socket.io.js',
      [config.debugger.namespace, 'stacktrace.js'].join('/'),
      [config.debugger.namespace, config.debugger.js].join('/')
    ]);
  }
  // The script should wait until everything are all done and settle
  return scriptInject({
    snippet: scripts
      .map(s => `<script type="text/javascript" src="${s}" defer></script>`)
      .reduce((a, b) => a + b, '')
  });
};
