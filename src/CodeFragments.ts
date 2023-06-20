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
    this.push(new CodeFragments(...args));
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
    }
  ): string {
    const {
      context,
      indent = true,
      startline = false,
      endline = false,
      depth = 0,
      spaces = 2,
    } = options || {};
    const _fragments = [...fragments];
    if (startline && _fragments[0] !== '\n') {
      _fragments.unshift('\n');
    }
    if (endline && _fragments.at(-1) !== '\n') {
      _fragments.push('\n');
    }

    const separator = '\n' + (indent ? ' '.repeat(spaces * depth) : '');

    return _fragments
      .map((item) => {
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
      })
      .join(separator);
  }

  complete(options?: {
    context?: Context;
    indent?: boolean;
    startline?: boolean;
    endline?: boolean;
    depth?: number;
    spaces?: number;
  }) {
    return this._complete(this, { context: {} as Context, ...options });
  }
}

export const createFragments = <Context = any>(...args: Fragments<Context>[]) =>
  new CodeFragments<Context>(...args);
