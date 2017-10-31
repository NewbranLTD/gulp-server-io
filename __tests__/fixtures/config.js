'use strict';
/**
 * Share all this options across different test
 */
const path = require('path');
const baseUrl = 'localhost';
const defaultPort = 8000;
const defaultUrl = ['http://', baseUrl, ':', defaultPort].join('');
const defaultSSLUrl = ['https://', baseUrl, ':', defaultPort].join('');
const root = path.resolve(path.join(__dirname, 'app'));

module.exports = {
  baseUrl: baseUrl,
  defaultPort: defaultPort,
  defaultUrl: defaultUrl,
  defaultSSLUrl: defaultSSLUrl,
  root: root
};