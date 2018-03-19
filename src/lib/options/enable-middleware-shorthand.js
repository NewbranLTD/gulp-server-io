/**
 * From the original gulp-webserver
 */
// const extend = require('util')._extend;
const { merge } = require('lodash');
const { version } = require('../../../package.json');
/**
 * @param {object} defaults the stock options
 * @param {array} props special properties need preserved
 * @param {object} options configuration params pass the end user
 * @return {object} configuration
 */
module.exports = function(defaults, props, options) {
  const originalOptions = merge({}, options);
  const originalDefaults = merge({}, defaults);
  let config = merge({}, originalDefaults, originalOptions);
  // This just make sure it's an array
  if (Object.prototype.toString.call(props) === '[object String]') {
    props = [props];
  }
  for (let i = 0, len = props.length; i < len; ++i) {
    let prop = props[i];
    /**
     * The problem is when someone pass optionName: true
     * it just using the default options
     * what if they just pass alternative config without passing
     * enable: true
     * then the feature is not enable
     */
    if (config[prop] === true) {
      config[prop] = merge({}, originalDefaults[prop]);
      config[prop].enable = true;
    } else if (originalOptions[prop] && Object.keys(originalOptions[prop]).length) {
      // If the user has provided some property
      // Then we add the enable here for the App to use
      config[prop].enable = true;
    } else if (config[prop] === false) {
      config[prop] = { enable: false };
    }
  }
  // Here we add things that we don't want to get overwritten
  config.version = version;
  config.sessionId = Date.now();
  return config;
};
