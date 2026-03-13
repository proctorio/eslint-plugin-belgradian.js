# eslint-plugin-belgradian

An ESLint plugin that enforces camelCase variable naming with scope prefixes:

- `m_` for field members
- `g_` for global variables (outside of the module or class)

## Installation

```
npm install eslint eslint-plugin-belgradian --save-dev
```

## Usage

### ESLint flat config (eslint.config.js — ESLint 9+)

```js
import belgradian from "eslint-plugin-belgradian";

export default [
  {
    plugins: { belgradian },
    rules: {
      "belgradian/member-prefix-rule": "error"
    }
  }
];
```

### Legacy config (.eslintrc — ESLint 8 and below)

Add `belgradian` to the plugins section of your `.eslintrc` configuration file:

```json
{
  "plugins": ["belgradian"],
  "rules": {
    "belgradian/member-prefix-rule": "error"
  }
}
```

## Options

The rule accepts an options object with:

- **`include`** — additional prefixes to allow (e.g. `["g_"]`)
- **`exceptions`** — variable names to ignore

```json
{
  "rules": {
    "belgradian/member-prefix-rule": [
      "error",
      { "include": ["g_"], "exceptions": ["reservedVariable"] }
    ]
  }
}
```

## Development

```bash
npm test        # run tests with coverage
npm run lint    # lint source and test files
```

## License

[MIT](LICENCE)

---

Inspired by Sander Verweij's [budapestian](https://github.com/sverweij/eslint-plugin-budapestian).