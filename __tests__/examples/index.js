/**
 * Just to test out feature in bits
 */
const chalk = require('chalk');
const createConfiguration = require('../../src/lib/options');
const options = {
  https: {
    devCrtPem: '/path/to/cert.crt',
    devKeyPem: '/path/to/cert.pem'
  },
  debugger: false,
  serverReload: true,
  mock: {
    enable: true
  }
};

const config = createConfiguration(options);

console.log(chalk.yellow(JSON.stringify(config, null, 2)));
