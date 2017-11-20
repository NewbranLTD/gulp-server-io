'use strict';
/**
 * see if this will add to the coverage
 */
const openFn = require('../../src/lib/open');

describe('Testing the open function', () => {
  test('Expect calling open to be ok', () => {
    expect(openFn()).toBe(true);
  });
});
