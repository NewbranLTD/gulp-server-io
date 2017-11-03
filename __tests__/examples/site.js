/* eslint-disable */
/**
 * testing the stream write etc here
 */
const webserver = require('../../index');
const {
  root,
  rootDir,
  baseUrl,
  defaultUrl,
  defaultPort,
  defaultSSLUrl
} = require('../fixtures/config.js');

const config = {};
const stream = webserver({});
stream.write(rootDir);
