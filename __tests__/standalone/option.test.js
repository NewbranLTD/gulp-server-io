/**
 * New test files just to test out if the option pass and return as expected
 */
const { createConfiguration } = require('../../src/lib/options');

const options = {
  https: {
    devCrtPem: '/path/to/cert.crt',
    devKeyPem: '/path/to/cert.pem'
  }
};

/**
 * We want to able to just pass `true` and take the default options
 */
describe('Testing the core enable-middleware-shorthand', () => {

  let config;

  beforeEach(() => {
    config = createConfiguration(options);
  });

  it('Should pass true and return default option', () => {
    expect(config).toHaveProperty('https', {
      enable: true,
      devCrtPem: '/path/to/cert.crt',
      devKeyPem: '/path/to/cert.pem'
    });
  });
});
