/**
 * @fileoverview Tests for member-prefix-rule
 */

const { RuleTester } = require("eslint");
const plugin = require("../src/index");

const ruleTester = new RuleTester({
	parserOptions: { ecmaVersion: 2022, sourceType: "module" }
});

const rule = plugin.rules["member-prefix-rule"];

ruleTester.run("member-prefix-rule", rule, {
	valid: [
		// Basic valid cases with m_ prefix
		{
			code: "const m_userName = 'John';",
			options: []
		},
		{
			code: "let m_counter = 0;",
			options: []
		},
		{
			code: "var m_isActive = true;",
			options: []
		},
		
		// CamelCase after prefix
		{
			code: "const m_firstName = 'Jane';",
			options: []
		},
		{
			code: "const m_firstNameMiddleNameLastName = 'test';",
			options: []
		},
		
		// ALL_CAPS constants (should be exempt)
		{
			code: "const MAX_BUFFER_SIZE = 1024;",
			options: []
		},
		{
			code: "const HTTP_200_OK = 200;",
			options: []
		},
		{
			code: "const API_KEY = 'secret';",
			options: []
		},
		{
			code: "const X = 10;",
			options: []
		},
		{
			code: "const PI_VALUE = 3.14;",
			options: []
		},
		
		// Variables with excluded init types (imports/function calls)
		{
			code: "const myVar = require('module');",
			options: []
		},
		{
			code: "const result = calculate();",
			options: []
		},
		{
			code: "const obj = new Object();",
			options: []
		},
		{
			code: "const data = await fetchData();",
			options: []
		},
		{
			code: "const fn = () => {};",
			options: []
		},
		{
			code: "const value = obj.property;",
			options: []
		},
		
		// With g_ prefix when included
		{
			code: "const g_globalConfig = {};",
			options: [{ include: ["g_"] }]
		},
		{
			code: "let g_sharedState = null;",
			options: [{ include: ["g_"] }]
		},
		
		// With s_ prefix when included
		{
			code: "const s_staticValue = 42;",
			options: [{ include: ["s_"] }]
		},
		
		// Multiple prefixes
		{
			code: "const m_member = 1;",
			options: [{ include: ["g_"] }]
		},
		{
			code: "const g_global = 2;",
			options: [{ include: ["g_"] }]
		},
		
		// Exception variables
		{
			code: "const reservedVar = 'special';",
			options: [{ exceptions: ["reservedVar"] }]
		},
		{
			code: "let i = 0;",
			options: [{ exceptions: ["i", "j", "k"] }]
		},
		{
			code: "for (let i = 0; i < 10; i++) {}",
			options: [{ exceptions: ["i"] }]
		},
		
		// Complex valid scenarios
		{
			code: `
				const MAX_VALUE = 100;
				const m_currentValue = 50;
				const result = calculate(m_currentValue);
			`,
			options: []
		},
		{
			code: `
				const m_user = { name: 'John' };
				const m_isValid = true;
				const API_ENDPOINT = 'https://api.example.com';
			`,
			options: []
		}
	],

	invalid: [
		// Basic invalid cases - missing m_ prefix
		{
			code: "const userName = 'John';",
			options: [],
			errors: [{
				message: "local variable 'userName' should be camel case and start with a 'm_': 'm_userName'",
				type: "Program"
			}]
		},
		{
			code: "let counter = 0;",
			options: [],
			errors: [{
				message: "local variable 'counter' should be camel case and start with a 'm_': 'm_counter'",
				type: "Program"
			}]
		},
		{
			code: "var isActive = true;",
			options: [],
			errors: [{
				message: "local variable 'isActive' should be camel case and start with a 'm_': 'm_isActive'",
				type: "Program"
			}]
		},
		
		// Wrong prefix format (uppercase after prefix)
		{
			code: "const m_UserName = 'John';",
			options: [],
			errors: [{
				message: "local variable 'm_UserName' should be camel case and start with a 'm_': 'm_mUserName'",
				type: "Program"
			}]
		},
		
		// Missing prefix with literal initialization
		{
			code: "const firstName = 'Jane';",
			options: [],
			errors: [{
				message: "local variable 'firstName' should be camel case and start with a 'm_': 'm_firstName'",
				type: "Program"
			}]
		},
		{
			code: "const total = 100;",
			options: [],
			errors: [{
				message: "local variable 'total' should be camel case and start with a 'm_': 'm_total'",
				type: "Program"
			}]
		},
		
		// Multiple invalid variables
		{
			code: "const firstName = 'John'; const lastName = 'Doe';",
			options: [],
			errors: [
				{
					message: "local variable 'firstName' should be camel case and start with a 'm_': 'm_firstName'",
					type: "Program"
				},
				{
					message: "local variable 'lastName' should be camel case and start with a 'm_': 'm_lastName'",
					type: "Program"
				}
			]
		},
		
		// With g_ prefix required but not used
		{
			code: "const globalConfig = {};",
			options: [{ include: ["g_"] }],
			errors: [{
				message: "local variable 'globalConfig' should be camel case and start with a 'm_' or 'g_': 'm_globalConfig'",
				type: "Program"
			}]
		},
		
		// Wrong prefix used
		{
			code: "const g_memberVar = 42;",
			options: [],
			errors: [{
				message: "local variable 'g_memberVar' should be camel case and start with a 'm_': 'm_memberVar'",
				type: "Program"
			}]
		},
		
		// Variable not in exceptions list
		{
			code: "const specialVar = 'value';",
			options: [{ exceptions: ["otherVar"] }],
			errors: [{
				message: "local variable 'specialVar' should be camel case and start with a 'm_': 'm_specialVar'",
				type: "Program"
			}]
		},
		
		// PascalCase without prefix
		{
			code: "const MyVariable = 'test';",
			options: [],
			errors: [{
				message: "local variable 'MyVariable' should be camel case and start with a 'm_': 'm_myVariable'",
				type: "Program"
			}]
		},
		
		// snake_case without prefix
		{
			code: "const my_variable = 'test';",
			options: [],
			errors: [{
				message: "local variable 'my_variable' should be camel case and start with a 'm_': 'm_myVariable'",
				type: "Program"
			}]
		},
		
		// kebab-case (though not valid JS identifier, testing normalization)
		{
			code: "const myVariable = 'test';",
			options: [],
			errors: [{
				message: "local variable 'myVariable' should be camel case and start with a 'm_': 'm_myVariable'",
				type: "Program"
			}]
		},
		
		// Complex invalid scenario
		{
			code: `
				const MAX_VALUE = 100;
				const currentValue = 50;
				const m_validValue = 75;
			`,
			options: [],
			errors: [{
				message: "local variable 'currentValue' should be camel case and start with a 'm_': 'm_currentValue'",
				type: "Program"
			}]
		},
		
		// Multiple prefixes required but none used
		{
			code: "const myVar = 10;",
			options: [{ include: ["g_", "s_"] }],
			errors: [{
				message: "local variable 'myVar' should be camel case and start with a 'm_' or 'g_' or 's_': 'm_myVar'",
				type: "Program"
			}]
		},
		
		// Mixed valid and invalid
		{
			code: "const m_valid = 1; const invalid = 2; const CONSTANT = 3;",
			options: [],
			errors: [{
				message: "local variable 'invalid' should be camel case and start with a 'm_': 'm_invalid'",
				type: "Program"
			}]
		}
	]
});

console.log("✓ All member-prefix-rule tests passed");
