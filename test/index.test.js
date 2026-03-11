const plugin = require("../src/index");

describe("index", () =>
{
	it("should export rules object", () =>
	{
		expect(plugin).toHaveProperty("rules");
	});

	it("should export member-prefix-rule", () =>
	{
		expect(plugin.rules).toHaveProperty("member-prefix-rule");
	});

	it("should have a create function for member-prefix-rule", () =>
	{
		expect(typeof plugin.rules["member-prefix-rule"].create).to.equal("function");
	});
});
