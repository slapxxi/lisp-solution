import { defn, interpret, sum } from './index';

it('interprets numbers', () => {
  let result = interpret(10);
  expect(result).toEqual(10);
});

it('interprets variables', () => {
  let result = interpret.bind({ test: 100 })('test');
  expect(result).toEqual(100);
});

it('interprets function definitions', () => {
  let scope = {};
  interpret.bind(scope)([defn, 's3', ['a', 'b', 'c'], [sum, 'a', 'b', 'c']]);
  expect(scope).toHaveProperty('s3');
});

it('interprets function calls', () => {
  let result = interpret([sum, 56, 13]);
  expect(result).toEqual(69);
});

it('interprets function body', () => {
  let scope = { a: 10, b: 20, c: 30 };
  let result = interpret.bind(scope)([sum, 'a', 'b', 'c']);
  expect(result).toEqual(60);
});

it('interprets multiple instructions', () => {
  let result = interpret(
    [defn, 'sum3', ['a', 'b', 'c'], [sum, 'a', 'b', 'c']],
    ['sum3', 10, 20, 30]
  );

  expect(result).toEqual(60);
});
