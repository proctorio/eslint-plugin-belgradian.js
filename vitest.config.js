import { defineConfig } from "vitest/config";

export default defineConfig({
	test:
	{
		include: ["test/**/*.{Test,test}.js"],
		globals: true,
		reporters: ["default", "junit"],
		outputFile:
		{
			junit: "./.test_output/test-results.xml"
		},
		coverage:
		{
			enabled: true,
			provider: "v8",
			include: ["src/**"],
			reporter: ["text", "cobertura"],
			reportsDirectory: "./.test_output",
			thresholds:
			{
				branches: 50,
				statements: 80,
				functions: 80,
				lines: 70
			}
		}
	}
});
