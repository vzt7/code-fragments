type Fragments<T = any> = string | ((context: T) => string) | Fragments<T>[];

export class CodeFragments<Context = any> extends Array<Fragments<Context>> {
  constructor(...initialValue: Fragments<Context>[]) {
    super();

    if (initialValue.length > 0) {
      this.push(...initialValue);
    }
  }

  newline() {
    this.push('\n');
  }

  fragments(...args: Fragments<Context>[]) {
    return new CodeFragments(...args);
  }

  private _complete(
    fragments: Fragments<Context>[],
    options: {
      context: Context;
      indent?: boolean;
      startline?: boolean;
      endline?: boolean;
      depth?: number;
      spaces?: number;
      separator?: string | ((options: { depth: number }) => string);
    }
  ): string {
    const {
      context,
      indent = true,
      startline = false,
      endline = false,
      depth = 0,
      spaces = 2,
      separator,
    } = options || {};
    const _fragments = [...fragments];
    if (startline && _fragments[0] !== '\n') {
      _fragments.unshift('\n');
    }
    if (endline && _fragments.at(-1) !== '\n') {
      _fragments.push('\n');
    }

    const getCode = (item: (typeof _fragments)[number]) => {
      if (typeof item === 'string') {
        return item;
      }
      if (item instanceof CodeFragments) {
        const padSpaces = indent ? ' '.repeat(spaces * (depth + 1)) : '';
        return padSpaces + item.complete({ ...options, depth: depth + 1 });
      }
      if (typeof item === 'function') {
        return item(context);
      }
      return this._complete(item, { ...options, depth: depth + 1 });
    };
    const getSeparator = () => {
      const _separator =
        separator ?? '\n' + (indent ? ' '.repeat(spaces * depth) : '');
      if (typeof _separator === 'function') {
        return _separator({ depth });
      }
      return _separator;
    };

    return _fragments.map((item) => getCode(item)).join(getSeparator());
  }

  complete(options?: Partial<Parameters<typeof this._complete>['1']>) {
    return this._complete(this, { context: {} as Context, ...options });
  }
}

export const createFragments = <Context = any>(...args: Fragments<Context>[]) =>
  new CodeFragments<Context>(...args);
