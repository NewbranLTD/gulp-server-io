/**
 * From the original gulp-webserver
 */
// const extend = require('util')._extend;
const extend = require('lodash').merge;
/**
 * @param {object} defaults - the stock options
 * @param {object} options - configuration params
 * @param {array} props - special properties need preserved
 * @return {object} config
 */
module.exports = function(defaults, options, props) {
  const originalDefaults = extend({}, defaults);
  let config = extend(defaults, options);
  if (Object.prototype.toString.call(props) === '[object String]') {
    props = [props];
  }
  for (let i = 0, len = props.length; i < len; ++i) {
    let prop = props[i];
    if (config[prop] === true) {
      // Change from === true
      config[prop] = extend({}, originalDefaults[prop]);
      config[prop].enable = true;
    }
  }
  return config;
};
