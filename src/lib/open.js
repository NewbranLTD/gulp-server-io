/**
 * Open in browser during development
 */
const open = require('opn');
/**
 * @param {object} config options
 * @return {boolean} true on open false on failed
 */
module.exports = function(config = {}) {
  if (config.open === false || process.env.NODE_ENV === 'test') {
    return true;
  }
  let args = [];
  // If there is just the true option then we need to construct the link
  if (config.open === true) {
    args.push(
      [
        'http' + (config.https === false ? '' : 's'),
        '//' + config.host,
        config.port
      ].join(':')
    );
  } else if (
    typeof config.open === 'string' &&
    config.open.length > 0 &&
    config.open.indexOf('http') !== 0
  ) {
    // Ensure leading slash if this is NOT a complete url form
    args.push([config.open.substr(0, 1) === '/' ? '' : '/', config.open].join(''));
  } else if (typeof config.open === 'object') {
    if (config.open.url) {
      args.push(config.open.url);
    } else {
      return false;
    }
    if (config.open.browser) {
      args.push(config.open.browser);
    }
  } else {
    return false;
  }
  Reflect.apply(open, open, args);
  return true;
};
