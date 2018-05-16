/**
 * Take out a bunch of functions from the original debugger setup
 */
const _ = require('lodash');
const util = require('util');
const chalk = require('chalk');
const logutil = require('../utils/log');

const keys = ['browser', 'location'];
const lb = chalk.white('-'.repeat(90));
/**
 * Just getting some color configuration
 * @param {object} data from config
 * @return {string} color
 */
const getColor = function(data) {
  let dc = 'cyan';
  let str = data.color ? data.color : data.from ? data.from : dc;
  if (str === dc) {
    return str; // Default
  }
  switch (str) {
    case 'debug':
      return 'red';
    case 'info':
      return 'magenta';
    case 'warning':
      return 'yellow';
    default:
      if (chalk[str]) {
        return str;
      }
      return dc;
  }
};

// Ditch the npm:table
const table = rows => {
  if (Array.isArray(rows)) {
    rows.forEach(row => logutil(row));
  } else {
    logutil(rows);
  }
};
const parseObj = data => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
};
// Encap to one func
const displayError = e => {
  // This is required so we just do a simple test here
  // logutil('check typeof ' + data.toString());
  const color = getColor(e);
  let rows = [];
  if (e.from && e.color) {
    rows.push(chalk.white(`FROM: ${e.from}`));
  }
  keys.forEach(function(key) {
    if (e[key]) {
      rows.push([chalk.white(key + ':'), chalk.cyan(e[key])].join(' '));
    }
  });
  const _msg = parseObj(e.msg);
  if (_.isString(_msg)) {
    rows.push([chalk.white('MESSAGE:'), chalk[color](e.msg)].join(' '));
  } else {
    const msgToArr = _.isString(_msg) ? parseObj(_msg) : _msg;
    if (Array.isArray(msgToArr)) {
      rows.push(chalk.white('MESSAGE(S):'));
      msgToArr.forEach(a => {
        if (typeof a === 'object') {
          rows.push(lb);
          _.forEach(a, (v, k) => {
            rows.push([chalk.white(k + ':'), chalk[color](v)].join(' '));
          });
        } else {
          rows.push(a);
        }
      });
      rows.push([lb, 'END'].join(' '));
    } else if (_.isObject(_msg)) {
      rows.push(lb);
      _.forEach(_msg, (v, k) => {
        rows.push([chalk.white(k + ':'), chalk[color](v)].join(' '));
      });
      rows.push([lb + 'END'].join(' '));
    } else {
      // This is to accomdate the integration with other logging system sending back different messages
      rows.push(
        [chalk.white('MESSAGES:'), chalk[color](util.inspect(_msg, false, 2))].join(' ')
      );
    }
  }
  table(rows);
};
// Export
exports.table = table;
exports.parseObj = parseObj;
exports.displayError = displayError;
