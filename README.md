# 🍢 code-fragments

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Codecov][codecov-src]][codecov-href]

[npm-version-src]: https://img.shields.io/npm/v/code-fragments?style=flat-square
[npm-version-href]: https://npmjs.com/package/code-fragments
[npm-downloads-src]: https://img.shields.io/npm/dm/code-fragments?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/code-fragments
[codecov-src]: https://img.shields.io/codecov/c/gh/vzt7/code-fragments/main?style=flat-square
[codecov-href]: https://codecov.io/gh/vzt7/code-fragments

[code-fragments](https://github.com/vzt7/code-fragments) is an extremely simple and easy-to-use JS "template" 🤡.

## ⚡️ Usage

The code-fragments package exposes `createFragments` and `CodeFragments` to create fragments.

```ts
import { createFragments } from 'code-fragments';

const fragments = createFragments();

// or
import { CodeFragments } from 'code-fragments';

const fragments = new CodeFragments();
```

Just use code fragments as an array, and call `fragments.complete` to output the final code.

Accept nested fragments, which will be indented with 2 spaces per depth:

```ts
const fragments = createFragments();

fragments.push(
  'const fn = () => {',
  fragments.fragments('// ...', 'return null;'), // Same as createFragments('// ...', 'return null;')
  '};'
);
fragments.push('fn();');
fragments.push('console.log('fn has been called.');');

const code = fragments.complete();
/* You got:
`const fn = () => {
  // ...
  return null;
};
fn();
console.log('fn has been called.');`
*/
```

Accept a function to lazy complete dynamic fragments.

```ts
const fragments = new CodeFragments<{ callback: () => string }>(); // Specify the context type for your dynamic fragments.

fragments.push('const fn = () => { return null };');
fragments.push('fn();');
fragments.push((context) => `console.log('${context.name} has been called.');`);

const code = fragments.complete({
  context: {
    name: 'fn',
  },
});
/* You got:
`const fn = () => { return null };
fn();
console.log('fn has been called.');`
*/
```

## 📖 API

https://www.jsdocs.io/package/code-fragments

## License

Published under [MIT](./LICENSE).
