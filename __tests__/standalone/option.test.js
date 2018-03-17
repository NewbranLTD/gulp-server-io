/**
 * New test files just to test out if the option pass and return as expected
 */
const {
  enableMiddlewareShorthand,
  defaultProperties,
  defaultOptions
} from '../../src/lib/options';

const options = {
  https: true
};

const expectedResult = {
  
};

/**
 * We want to able to just pass `true` and take the default options
 */
describe('Testing the core enable-middleware-shorthand', () => {

  expect(
    enableMiddlewareShorthand(defaultOptions, options, defaultProperties)
  ).toBe(expectedResult);

});
