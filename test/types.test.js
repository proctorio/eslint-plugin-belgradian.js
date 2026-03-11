const { NODE_TYPE2IDENTIFIER_TYPE } = require("../src/constants/types");

describe("types constants", () =>
{
	describe("NODE_TYPE2IDENTIFIER_TYPE", () =>
	{
		it("should map Program to member variable", () =>
		{
			expect(NODE_TYPE2IDENTIFIER_TYPE.Program).to.equal("member variable");
		});

		it("should be an object", () =>
		{
			expect(typeof NODE_TYPE2IDENTIFIER_TYPE).to.equal("object");
		});
	});
});
