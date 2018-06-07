/**
 * From the original gulp-webserver
 */
// const extend = require('util')._extend;
const { merge, extend } = require('lodash');
const { toArray } = require('../utils/helper');
const { version } = require('../../../package.json');
/**
 * Make sure the incoming parameter to be array when it's coming out
 * @param {array} arraySource list of keys to process
 * @param {object} options the user supply options
 * @return {object} the key props should be array
 */
const ensureArrayProps = (arraySource, options) => {
  return arraySource
    .map(key => {
      if (options[key]) {
        return { [key]: toArray(options[key]) };
      }
      return { [key]: [] };
    })
    .reduce((next, last) => {
      return extend(next, last);
    }, options);
};

/**
 * @param {object} defaults the stock options
 * @param {array} props special properties need preserved
 * @param {array} arraySource list of keys that is using array as default
 * @param {object} options configuration params pass the end user
 * @return {object} configuration
 */
module.exports = function(defaults, props, arraySource, options) {
  // Make a copy to use later
  const originalOptions = merge({}, options);
  const originalDefaults = merge({}, defaults);
  /*
    @2018-03-19 The bug is here when call the merge
    lodash.merge merge object into array source turns it into
    a key / value array instead of numeric
    so for the special case `middleware` `proxies`
    we need to double check here before calling the merge function
  */
  let config = merge({}, defaults, ensureArrayProps(arraySource, options));
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
  // Change from sessionId to timestamp, just for reference not in use anywhere
  config.timestamp = Date.now();
  return config;
};
