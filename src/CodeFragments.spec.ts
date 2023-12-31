import { CodeFragments } from './CodeFragments';

describe('Testing code fragments.', () => {
  const items = {
    str1: 'import fs from "fs";',
    str2: 'console.log(fs);',
    str3: 'export default fs;',
  };

  it('Normal case', () => {
    const fragments = new CodeFragments();

    fragments.push(items.str1);
    fragments.push(items.str2);
    fragments.push(items.str3);

    const code = fragments.complete();
    expect(code).eq(`${items.str1}\n${items.str2}\n${items.str3}`);
  });

  it('Nested fragments', () => {
    const fragments = new CodeFragments();

    fragments.push(items.str1);
    fragments.newline();
    fragments.push(fragments.fragments(items.str2, items.str3));

    const code = fragments.complete();
    expect(code).eq(`${items.str1}\n\n\n  ${items.str2}\n  ${items.str3}`);
  });

  it('Disable indentation', () => {
    const fragments = new CodeFragments();

    fragments.push(items.str1);
    fragments.newline();
    fragments.push(fragments.fragments(items.str2, items.str3));

    const code = fragments.complete({ indent: false });
    expect(code).eq(`${items.str1}\n\n\n${items.str2}\n${items.str3}`);
  });

  it('Dynamic fragments', () => {
    const fragments = new CodeFragments<{ prefix: string }>();

    fragments.push((ctx) => `${ctx.prefix}${items.str1}`);
    fragments.newline();
    fragments.push(
      fragments.fragments(items.str2, (ctx) => `${ctx.prefix}${items.str3}$$$`)
    );

    const code = fragments.complete({
      context: { prefix: '@@@' },
      indent: false,
    });
    expect(code).eq(`@@@${items.str1}\n\n\n${items.str2}\n@@@${items.str3}$$$`);
  });

  it('Custom separator (string)', () => {
    const fragments = new CodeFragments();

    fragments.push(items.str1);
    fragments.push(items.str2);
    fragments.push(items.str3);

    const separator = '#####';
    const code = fragments.complete({
      separator,
    });
    expect(code).eq(
      `${items.str1}${separator}${items.str2}${separator}${items.str3}`
    );
  });

  it('Custom separator (function)', () => {
    const fragments = new CodeFragments();

    fragments.push(items.str1);
    fragments.push(
      fragments.fragments(items.str2, new CodeFragments(items.str2))
    );
    fragments.push(items.str3);

    const code = fragments.complete({
      indent: false,
      separator: ({ depth }) => `[${depth}]`,
    });
    expect(code).eq(
      `${items.str1}[0]${items.str2}[1]${items.str2}[0]${items.str3}`
    );
  });
});
