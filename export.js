/**
 * Since we need to include the gulp for testing
 * might as well export this back so the developer
 * don't need to add add it to the dependecies
 * @TODO since we already install with this module, there is no need to export them
 * anymore, the user can just require it directly. so this will be remove soon
 */

const chalk = require('chalk');
const gulp = require('gulp');
const helmet = require('helmet');
const bodyParser = require('body-parser');

console.log(
  chalk.red(
    'There is no need to import from here. You can just require the modules you need directly. This file will be remove in later release'
  )
);

// Re-export
module.exports = {
  gulp: gulp,
  helmet: helmet,
  bodyParser: bodyParser
};
