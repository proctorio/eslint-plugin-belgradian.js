module.exports = {
	testEnvironment: "node",
	collectCoverageFrom: [
		"src/**/*.js",
		"!src/**/*.test.js"
	],
	coverageDirectory: "coverage",
	coverageReporters: [
		"text",
		"text-summary",
		"html",
		"cobertura",
		"lcov"
	],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80
		}
	},
	testMatch: [
		"**/tests/**/*.js",
		"**/?(*.)+(spec|test).js"
	],
	reporters: [
		"default",
		["jest-junit", {
			outputDirectory: "coverage",
			outputName: "junit.xml",
			classNameTemplate: "{classname}",
			titleTemplate: "{title}",
			ancestorSeparator: " › ",
			usePathForSuiteName: true
		}]
	],
	verbose: true
};
