/**
 * New test files just to test out if the option pass and return as expected
 */
const { createConfiguration } = require('../../src/lib/options');

const options = {
  https: {
    devCrtPem: '/path/to/cert.crt',
    devKeyPem: '/path/to/cert.pem'
  },
  serverReload: true
};

/**
 * We want to able to just pass `true` and take the default options
 */
describe('Testing the core enable-middleware-shorthand', () => {

  let config;

  beforeEach(() => {
    config = createConfiguration(options);
  });

  it.skip('Should pass true and return default option', () => {
    expect(config).toHaveProperty('https', {
      enable: true,
      devCrtPem: '/path/to/cert.crt',
      devKeyPem: '/path/to/cert.pem'
    });
  });

  it('Should return the serverReload config object', () => {
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
