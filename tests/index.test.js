/**
 * @fileoverview Tests for the plugin entry point
 */

const plugin = require("../src/index");

describe("ESLint Plugin Entry Point", () => {
	test("should export rules object", () => {
		expect(plugin).toHaveProperty("rules");
		expect(typeof plugin.rules).toBe("object");
	});

	test("should export member-prefix-rule", () => {
		expect(plugin.rules).toHaveProperty("member-prefix-rule");
		expect(typeof plugin.rules["member-prefix-rule"]).toBe("object");
	});

	test("member-prefix-rule should have create function", () => {
		expect(plugin.rules["member-prefix-rule"]).toHaveProperty("create");
		expect(typeof plugin.rules["member-prefix-rule"].create).toBe("function");
	});

	test("should have correct rule structure", () => {
		const rule = plugin.rules["member-prefix-rule"];
		expect(rule).toMatchObject({
			create: expect.any(Function)
		});
	});
});
