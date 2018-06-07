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

const config = {
  debugger: {
    enable: true,
    namespace: '/my-custom-namespace'
  }
};
const stream = webserver(config);
stream.write(rootDir);
