/**
 * Представим, что на одном из проектов нам потребовался DSL для решения бизнес-задачи. Наши пользователи - большие поклонники Lisp, поэтому синтаксис этого языка им более привычен, чем синтаксис JS.
 * Парсер оригинального синтаксиса Lisp нам написать хоть и не так сложно, но все же для MVP это может быть неразумно, а вот простенький интерпретатор нам точно будет полезен.
 *
 * Что мы хотим получить:
 * 1. Возможность объявлять функции таким образом: [defn, 'funcName', ['a', 'b'], ['sum', 'a', 'b']], где
 *      defn - ключевое слово для определения функции
 *      'funcName' - имя функции
 *      ['a', 'b'] - перечисление аргументов функции
 *      ['sum', 'a', 'b'] - тело функции (т. е. вызов функции sum с аргументами a и b)
 * 2. Соответственно вызов функции должен быть таким ['funcName', 'a', 'b']
 *
 * Ниже уже реализован некоторый runtime и есть пример вызова interpret. Необходимо имплементировать interpret и defn.
 *
 * P.S.
 * Даже если не получится выполнять задание в полной мере (например, где-то застряли), все равно скидывайте в качестве решения то, что получилось.
 */

export function interpret(...code) {
  let scope = this ?? {};

  if (code.length === 1) {
    code = code[0];

    if (typeof code === 'string') {
      return scope[code];
    }

    if (!Array.isArray(code)) {
      return code;
    }

    let [operation, ...args] = code;

    switch (typeof operation) {
      case 'function':
        if (operation === defn) {
          let [name, params, body] = args;
          scope[name] = defn(name, params, body);
          return;
        } else {
          let fn = operation;
          let fnArgs = args.map((arg) => interpret.bind(scope)(arg));
          return fn(...fnArgs);
        }
      default:
        let procedure = interpret.bind(scope)(operation);
        let procedureArgs = args.map((arg) => interpret(arg));
        return procedure(...procedureArgs);
    }
  } else {
    let result;

    code.forEach((c) => {
      result = interpret.bind(scope)(c);
    });

    return result;
  }
}

export const defn = (_functionName, params, body) => {
  return (...args) => {
    let scope = zipObject(params, args);
    return interpret.bind(scope)(body);
  };
};

const zipObject = (keys, values) => {
  let result = {};
  keys.forEach((key, index) => {
    result[key] = values[index];
  });
  return result;
};

// Функция, используемая в runtime
export const sum = (...args) => args.reduce((prev, curr) => prev + curr);
export const diff = (...args) => args.reduce((prev, curr) => prev - curr);

// Пример вызова функции interpret
// const result = interpret(
//   [defn, 'sum3', ['a', 'b', 'c'], [sum, 'a', 'b', 'c']],
//   ['sum3', 10, 20, 30],
// );

// console.assert(result === 60);
