import { getRandomInt } from '../js/lib';

test('Random int is greater or equal to 0.', () => {
  expect(getRandomInt(10)).toBeGreaterThanOrEqual(0);
});
test('getRandomInt(0) is always equal to 0.', () => {
  expect(getRandomInt(0)).toBe(0);
});