import globals from "globals";

export default [
	{
		files: ["src/**/*.js"],
		languageOptions: {
			globals: {
				...globals.node
			}
		},
		rules: {
			"no-unused-vars": "error",
			"no-undef": "error"
		}
	},
	{
		files: ["test/**/*.js"],
		languageOptions: {
			globals: {
				...globals.node,
				describe: "readonly",
				it: "readonly",
				expect: "readonly",
				vi: "readonly",
				beforeEach: "readonly",
				afterEach: "readonly",
				beforeAll: "readonly",
				afterAll: "readonly"
			}
		},
		rules: {
			"no-unused-vars": "error",
			"no-undef": "error"
		}
	}
];
