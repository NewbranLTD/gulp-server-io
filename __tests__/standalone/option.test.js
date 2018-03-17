/**
 * New test files just to test out if the option pass and return as expected
 */
const {
  enableMiddlewareShorthand,
  defaultProperties,
  defaultOptions
} = require('../../src/lib/options');

const options = {
  https: true
};

const expectedResult = {

};

/**
 * We want to able to just pass `true` and take the default options
 */
describe('Testing the core enable-middleware-shorthand', () => {

  let config;

  beforeEach(() => {
    config = enableMiddlewareShorthand(defaultOptions, options, defaultProperties);
  });

  it('Should pass true and return default option', () => {
    expect(config).toHaveProperty('https');
    expect(config).toHaveProperty('https', {
      enable: true,
      devCrtPem: "/Users/joelck/Sites/github/gulp-server-io/src/certs/cert.crt",
      devKeyPem: "/Users/joelck/Sites/github/gulp-server-io/src/certs/cert.pem"
    });
  });



});
