/**
 * From the original gulp-webserver
 */
// const extend = require('util')._extend;
const { merge } = require('lodash');
const { version } = require('../../../package.json');
/**
 * @param {object} defaults - the stock options
 * @param {object} options - configuration params
 * @param {array} props - special properties need preserved
 * @return {object} config
 */
module.exports = function(defaults, options, props) {
  const originalDefaults = merge({}, defaults);
  let config = merge(defaults, options);
  if (Object.prototype.toString.call(props) === '[object String]') {
    props = [props];
  }
  for (let i = 0, len = props.length; i < len; ++i) {
    let prop = props[i];
    if (config[prop]) {
      config[prop] = merge({}, originalDefaults[prop]);
      config[prop].enable = true;
    }
  }
  // Here we add things that we don't want to get overwritten
  config.version = version;
  config.sessionId = Date.now();
  return config;
};
