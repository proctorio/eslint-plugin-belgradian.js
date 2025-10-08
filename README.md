# eslint-plugin-belgradian

[![npm version](https://img.shields.io/npm/v/eslint-plugin-belgradian.svg)](https://www.npmjs.com/package/eslint-plugin-belgradian)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

ESLint plugin for enforcing Hungarian notation-style prefixes with camelCase variable names in JavaScript code.

This plugin extends ESLint's camelCase rules to require specific scope-based prefixes:
- `m_` for member/field variables
- `g_` for global variables (outside modules or classes)
- Custom prefixes via configuration

## Why Use This?

Hungarian notation with prefixes helps to:
- **Reduce mental overhead** – No need to invent different names for similar concepts at different scopes
- **Enhance visual grepping** – Instantly identify variable scope without scrolling
- **Prevent shadowing bugs** – Makes variable shadowing obvious and easier to spot
- **Improve code consistency** – Enforces a uniform naming convention across your codebase

## Installation

First, install [ESLint](https://eslint.org):

```bash
npm install eslint --save-dev
```

Next, install `eslint-plugin-belgradian`:

```bash
npm install eslint-plugin-belgradian --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag), you must also install `eslint-plugin-belgradian` globally.

## Usage

Add `belgradian` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["belgradian"]
}
```

Then configure the rules you want to use under the rules section.

### Basic Configuration

Enable the rule with default settings (requires `m_` prefix):

```json
{
  "rules": {
    "belgradian/member-prefix-rule": "error"
  }
}
```

### Advanced Configuration

Add additional required prefixes and exceptions:

```json
{
  "rules": {
    "belgradian/member-prefix-rule": [
      "error",
      {
        "include": ["g_", "s_"],
        "exceptions": ["reservedVariable", "i", "j", "k"]
      }
    ]
  }
}
```

#### Configuration Options

- **`include`** (array): Additional prefixes to enforce beyond the default `m_` prefix
  - Example: `["g_", "s_"]` requires variables to use `m_`, `g_`, or `s_` prefixes
- **`exceptions`** (array): Variable names that are exempt from prefix requirements
  - Example: `["i", "j", "k"]` allows loop counters without prefixes

## Examples

### ✅ Valid Code

```javascript
// Member variable with m_ prefix
const m_userName = "John";

// Global variable with g_ prefix
const g_config = {};

// ALL_CAPS constants are always allowed
const MAX_BUFFER_SIZE = 1024;

// Exception-listed variables
const i = 0;
```

### ❌ Invalid Code

```javascript
// Missing m_ prefix
const userName = "John";  // Error: should be m_userName

// Missing g_ prefix  
const config = {};  // Error: should be g_config

// Wrong prefix format
const m_UserName = "John";  // Error: should be m_userName (camelCase after prefix)
```

## Rules

| Rule | Description | Fixable |
|------|-------------|---------|
| `belgradian/member-prefix-rule` | Enforces Hungarian notation prefixes with camelCase formatting | ❌ |

## How It Works

The plugin:
1. Validates that variable names start with a required prefix (`m_`, `g_`, or custom prefixes)
2. Ensures the portion after the prefix follows camelCase convention
3. Exempts ALL_CAPS constants from prefix requirements
4. Excludes imported/derived values (function calls, member expressions, etc.)
5. Provides helpful suggestions in error messages

## Zero Dependencies

This plugin has **no external dependencies** and uses native JavaScript implementations for all functionality, making it lightweight and secure.

## Requirements

- Node.js >= 16.7.0
- ESLint >= 7.0.0

## Testing

This plugin includes a comprehensive test suite with over 100 test cases and 95%+ code coverage.

```bash
# Run tests
npm test

# Run tests with coverage reports
npm run test:coverage

# Watch mode for development
npm run test:watch
```

Coverage reports are generated in multiple formats:
- **HTML**: `coverage/index.html`
- **Cobertura**: `coverage/cobertura-coverage.xml`
- **JUnit**: `coverage/junit.xml`
- **Console**: Displayed automatically after test runs

See [`tests/README.md`](tests/README.md) for detailed testing documentation.

## Related

Inspired by Sander Verweij's [eslint-plugin-budapestian](https://github.com/sverweij/eslint-plugin-budapestian).

## License

Copyright © 2021-2025 Proctorio, Inc.

Licensed under the Apache License, Version 2.0. See [LICENCE](LICENCE) file for details.

## Contributing

Issues and pull requests are welcome! Please feel free to contribute.

For security issues, please see our [security.txt](security.txt) file.