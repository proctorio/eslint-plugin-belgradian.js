# Test Suite for eslint-plugin-belgradian

This directory contains comprehensive unit and integration tests for the ESL int plugin.

## Test Coverage

### Test Files

1. **`index.test.js`** - Plugin entry point tests
   - Validates plugin structure
   - Confirms rule exports
   - Ensures proper module integration

2. **`memberPrefixRule.test.js`** - ESLint rule integration tests
   - Uses ESLint's `RuleTester` for authentic rule testing
   - **102 test cases** covering valid and invalid scenarios
   - Tests all prefix combinations (`m_`, `g_`, `s_`)
   - Validates exception handling
   - Tests ALL_CAPS constant exemptions
   - Validates excluded init types (CallExpression, MemberExpression, etc.)

3. **`utils.test.js`** - Utility function unit tests
   - Tests all exported utility functions
   - Validates filter chains
   - Tests error reporting logic
   - Covers edge cases and null handling

4. **`pattern.test.js`** - Pattern constant validation
   - Tests `VALID_GLOBAL_CONSTANT_PATTERN` regex
   - Tests `VALID_MEMBER_PATTERN_PART` regex
   - Validates unicode character handling
   - Ensures proper pattern matching

5. **`nativeUtils.test.js`** - Native implementation tests
   - Tests `_get()` safe property access
   - Tests `camelcase()` string conversion
   - Validates snake_case, kebab-case, PascalCase conversions

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

## Coverage Reports

After running `npm run test:coverage`, reports are generated in the `coverage/` directory:

- **HTML Report**: `coverage/index.html` - Interactive browser-based coverage report
- **Cobertura XML**: `coverage/cobertura-coverage.xml` - For CI/CD integration
- **JUnit XML**: `coverage/junit.xml` - Test results for CI/CD dashboards
- **LCOV**: `coverage/lcov.info` - For coverage tracking tools

## Coverage Metrics

Current coverage (as of last run):
- **Statements**: 95.08% (58/61)
- **Branches**: 82.6% (19/23)
- **Functions**: 100% (26/26)
- **Lines**: 95% (57/60)

## Test Categories

### Valid Cases Tested

✅ Variables with correct `m_` prefix
✅ Variables with additional prefixes (`g_`, `s_`)
✅ ALL_CAPS constants (exempt from prefixes)
✅ Variables initialized with function calls
✅ Variables initialized with member expressions
✅ Variables initialized with `new`, `await`, arrow functions
✅ Exception-listed variables
✅ Multiple prefix combinations

### Invalid Cases Tested

❌ Variables missing required prefix
❌ Variables with wrong prefix format (uppercase after prefix)
❌ Variables with incorrect prefix (`g_` when only `m_` allowed)
❌ PascalCase without prefix
❌ snake_case without prefix
❌ Multiple violations in single program
❌ Non-exception variables

## Key Test Scenarios

1. **Prefix Validation**
   - `m_userName` ✅ Valid
   - `userName` ❌ Invalid (missing `m_`)
   - `m_UserName` ❌ Invalid (should be `m_userName`)

2. **Constant Exemption**
   - `MAX_BUFFER_SIZE` ✅ Valid (ALL_CAPS constant)
   - `maxBufferSize` ❌ Invalid (not a constant, needs prefix)

3. **Multiple Prefixes**
   - `m_member` with `include: ["g_"]` ✅ Valid
   - `g_global` with `include: ["g_"]` ✅ Valid
   - `normalVar` with `include: ["g_"]` ❌ Invalid

4. **Exceptions**
   - `reservedVar` with `exceptions: ["reservedVar"]` ✅ Valid
   - `otherVar` with `exceptions: ["reservedVar"]` ❌ Invalid

## Integration with CI/CD

The test suite is configured to generate multiple report formats:

```javascript
// jest.config.js reporters
reporters: [
  "default",                    // Console output
  ["jest-junit", {
    outputDirectory: "coverage",
    outputName: "junit.xml"
  }]
]
```

Coverage formats:
- `text` - Console summary
- `html` - Interactive HTML report
- `cobertura` - XML format for Jenkins, GitLab, etc.
- `lcov` - For Codecov, Coveralls, etc.

## Testing Best Practices

1. **Isolated Tests**: Each test is independent and can run in any order
2. **Mocking**: Uses Jest mocks for ESLint context objects
3. **Edge Cases**: Covers null, undefined, and boundary conditions
4. **Real-world Scenarios**: Tests actual ESLint rule behavior using `RuleTester`
5. **Comprehensive Coverage**: 100% function coverage, 95%+ overall coverage

## Adding New Tests

When adding new features or fixing bugs:

1. Add test cases to the appropriate test file
2. Run `npm run test:coverage` to ensure coverage doesn't drop
3. Verify both console and HTML coverage reports
4. Ensure all tests pass before committing

## Debugging Tests

```bash
# Run a specific test file
npx jest __tests__/utils.test.js

# Run tests matching a pattern
npx jest --testNamePattern="should report problems"

# Run with verbose output
npx jest --verbose

# Run in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Dependencies

- **jest**: ^29.7.0 - Test framework
- **jest-junit**: ^16.0.0 - JUnit XML reporter
- **eslint**: ^8.57.0 - For RuleTester integration

All test dependencies are in `devDependencies` and won't be installed by consumers of the plugin.
