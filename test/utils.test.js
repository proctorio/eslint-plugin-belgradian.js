const { getVariableDeclaratorName, isNotAnException, isVariableDeclaration, isProblemVariableDeclarator, isNotAValidConstant } = require("../src/rules/utils");

describe("utils", () =>
{
	describe("getVariableDeclaratorName", () =>
	{
		it("should return the declarator id name", () =>
		{
			const declarator = { id: { name: "m_testVar" } };
			expect(getVariableDeclaratorName(declarator)).to.equal("m_testVar");
		});

		it("should return OK_ANYWAY when id.name is missing", () =>
		{
			const declarator = {};
			expect(getVariableDeclaratorName(declarator)).to.equal("OK_ANYWAY");
		});

		it("should return OK_ANYWAY when id exists but name does not", () =>
		{
			const declarator = { id: {} };
			expect(getVariableDeclaratorName(declarator)).to.equal("OK_ANYWAY");
		});
	});

	describe("isNotAValidConstant", () =>
	{
		it("should return false for valid uppercase constants", () =>
		{
			const checker = isNotAValidConstant();
			const declarator = { id: { name: "MY_CONSTANT" } };
			expect(checker(declarator)).to.equal(false);
		});

		it("should return true for non-constant names", () =>
		{
			const checker = isNotAValidConstant();
			const declarator = { id: { name: "myVariable" } };
			expect(checker(declarator)).to.equal(true);
		});

		it("should return false for single uppercase letter", () =>
		{
			const checker = isNotAValidConstant();
			const declarator = { id: { name: "X" } };
			expect(checker(declarator)).to.equal(false);
		});
	});

	describe("isNotAnException", () =>
	{
		it("should return true when variable is not in exceptions list", () =>
		{
			const checker = isNotAnException(["allowed"]);
			expect(checker("notAllowed")).to.equal(true);
		});

		it("should return false when variable is in exceptions list", () =>
		{
			const checker = isNotAnException(["allowed"]);
			expect(checker("allowed")).to.equal(false);
		});

		it("should return true when exceptions list is empty", () =>
		{
			const checker = isNotAnException([]);
			expect(checker("anything")).to.equal(true);
		});
	});

	describe("isVariableDeclaration", () =>
	{
		it("should return true for VariableDeclaration nodes", () =>
		{
			expect(isVariableDeclaration({ type: "VariableDeclaration" })).to.equal(true);
		});

		it("should return false for other node types", () =>
		{
			expect(isVariableDeclaration({ type: "FunctionDeclaration" })).to.equal(false);
		});
	});

	describe("isProblemVariableDeclarator", () =>
	{
		it("should return true for a variable without proper prefix", () =>
		{
			const checker = isProblemVariableDeclarator(["m_"]);
			const declarator = { id: { name: "badName" }, init: null };
			expect(checker(declarator)).to.equal(true);
		});

		it("should return false for a variable with proper prefix", () =>
		{
			const checker = isProblemVariableDeclarator(["m_"]);
			const declarator = { id: { name: "m_goodName" }, init: null };
			expect(checker(declarator)).to.equal(false);
		});

		it("should return false for CallExpression init types", () =>
		{
			const checker = isProblemVariableDeclarator(["m_"]);
			const declarator = { id: { name: "badName" }, init: { type: "CallExpression" } };
			expect(checker(declarator)).to.equal(false);
		});

		it("should return false for MemberExpression init types", () =>
		{
			const checker = isProblemVariableDeclarator(["m_"]);
			const declarator = { id: { name: "badName" }, init: { type: "MemberExpression" } };
			expect(checker(declarator)).to.equal(false);
		});

		it("should return false for ArrowFunctionExpression init types", () =>
		{
			const checker = isProblemVariableDeclarator(["m_"]);
			const declarator = { id: { name: "badName" }, init: { type: "ArrowFunctionExpression" } };
			expect(checker(declarator)).to.equal(false);
		});
	});
});
