const { onMemberPrefixRuleCreate } = require("../src/rules/memberPrefixRule");

describe("memberPrefixRule", () =>
{
	describe("onMemberPrefixRuleCreate", () =>
	{
		it("should return an object with a Program visitor", () =>
		{
			const context = {
				options: [{}],
				report: vi.fn()
			};
			const result = onMemberPrefixRuleCreate(context);
			expect(result).toHaveProperty("Program");
			expect(typeof result.Program).to.equal("function");
		});

		it("should report problem variables without m_ prefix", () =>
		{
			const reportFn = vi.fn();
			const context = {
				options: [{ include: [], exceptions: [] }],
				report: reportFn
			};

			const node = {
				type: "Program",
				body: [
					{
						type: "VariableDeclaration",
						declarations: [
							{
								id: { name: "badVariable" },
								init: null
							}
						]
					}
				]
			};

			const visitors = onMemberPrefixRuleCreate(context);
			visitors.Program(node);

			expect(reportFn).toHaveBeenCalled();
		});

		it("should not report variables with m_ prefix", () =>
		{
			const reportFn = vi.fn();
			const context = {
				options: [{ include: [], exceptions: [] }],
				report: reportFn
			};

			const node = {
				type: "Program",
				body: [
					{
						type: "VariableDeclaration",
						declarations: [
							{
								id: { name: "m_validVariable" },
								init: null
							}
						]
					}
				]
			};

			const visitors = onMemberPrefixRuleCreate(context);
			visitors.Program(node);

			expect(reportFn).not.toHaveBeenCalled();
		});

		it("should not report variables in exceptions list", () =>
		{
			const reportFn = vi.fn();
			const context = {
				options: [{ include: [], exceptions: ["allowedVar"] }],
				report: reportFn
			};

			const node = {
				type: "Program",
				body: [
					{
						type: "VariableDeclaration",
						declarations: [
							{
								id: { name: "allowedVar" },
								init: null
							}
						]
					}
				]
			};

			const visitors = onMemberPrefixRuleCreate(context);
			visitors.Program(node);

			expect(reportFn).not.toHaveBeenCalled();
		});

		it("should not report uppercase constants", () =>
		{
			const reportFn = vi.fn();
			const context = {
				options: [{ include: [], exceptions: [] }],
				report: reportFn
			};

			const node = {
				type: "Program",
				body: [
					{
						type: "VariableDeclaration",
						declarations: [
							{
								id: { name: "MY_CONSTANT" },
								init: null
							}
						]
					}
				]
			};

			const visitors = onMemberPrefixRuleCreate(context);
			visitors.Program(node);

			expect(reportFn).not.toHaveBeenCalled();
		});

		it("should not report CallExpression initializers", () =>
		{
			const reportFn = vi.fn();
			const context = {
				options: [{ include: [], exceptions: [] }],
				report: reportFn
			};

			const node = {
				type: "Program",
				body: [
					{
						type: "VariableDeclaration",
						declarations: [
							{
								id: { name: "result" },
								init: { type: "CallExpression" }
							}
						]
					}
				]
			};

			const visitors = onMemberPrefixRuleCreate(context);
			visitors.Program(node);

			expect(reportFn).not.toHaveBeenCalled();
		});

		it("should handle default options when no options provided", () =>
		{
			const reportFn = vi.fn();
			const context = {
				options: [],
				report: reportFn
			};

			const node = {
				type: "Program",
				body: []
			};

			const visitors = onMemberPrefixRuleCreate(context);
			visitors.Program(node);

			expect(reportFn).not.toHaveBeenCalled();
		});

		it("should support custom include prefixes", () =>
		{
			const reportFn = vi.fn();
			const context = {
				options: [{ include: ["g_"], exceptions: [] }],
				report: reportFn
			};

			const node = {
				type: "Program",
				body: [
					{
						type: "VariableDeclaration",
						declarations: [
							{
								id: { name: "g_globalVar" },
								init: null
							}
						]
					}
				]
			};

			const visitors = onMemberPrefixRuleCreate(context);
			visitors.Program(node);

			expect(reportFn).not.toHaveBeenCalled();
		});
	});
});
