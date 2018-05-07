/**
 * New test files just to test out if the option pass and return as expected
 */
const { createConfiguration } = require('../../src/lib/options');
const debug = require('debug')('gulp-server-io:inject');
const options = {
  https: {
    devCrtPem: '/path/to/cert.crt',
    devKeyPem: '/path/to/cert.pem'
  },
  serverReload: true,
  inject: {
    target: 'index.html', // This is not a require field
    source: ['style.css']
  }
};

/**
 * We want to able to just pass `true` and take the default options
 */
describe('Testing the core enable-middleware-shorthand', () => {

  let config;

  beforeEach(() => {
    config = createConfiguration(options);
    debug('config', config);
  });

  it('Should pass true and return default option', () => {
    expect(config).toHaveProperty('https', {
      enable: true,
      devCrtPem: '/path/to/cert.crt',
      devKeyPem: '/path/to/cert.pem'
    });
  });
  // this works
  it.skip('Should return the serverReload config object', () => {
    expect(config).toHaveProperty('serverReload', {
      enable: true,
      dir: '/srv',
      config: {
        verbose: true,
        debounce: 500
      },
      callback: () => {
        console.log('server reload callback executed');
      }
    });
  });
});
