const { VALID_GLOBAL_CONSTANT_PATTERN, VALID_MEMBER_PATTERN_PART } = require("../src/constants/pattern");

describe("pattern constants", () =>
{
	describe("VALID_GLOBAL_CONSTANT_PATTERN", () =>
	{
		it("should match uppercase constants", () =>
		{
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("MY_CONSTANT")).to.equal(true);
		});

		it("should match single uppercase letter", () =>
		{
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("X")).to.equal(true);
		});

		it("should match uppercase with numbers", () =>
		{
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("MAX_VALUE_2")).to.equal(true);
		});

		it("should not match lowercase names", () =>
		{
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("myVariable")).to.equal(false);
		});

		it("should not match camelCase names", () =>
		{
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("camelCase")).to.equal(false);
		});

		it("should not match names starting with underscore", () =>
		{
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("_PRIVATE")).to.equal(false);
		});
	});

	describe("VALID_MEMBER_PATTERN_PART", () =>
	{
		it("should be a string pattern for regex construction", () =>
		{
			expect(typeof VALID_MEMBER_PATTERN_PART).to.equal("string");
		});

		it("should match camelCase names when used in a regex", () =>
		{
			const regex = new RegExp(`^m_${VALID_MEMBER_PATTERN_PART}`, "u");
			expect(regex.test("m_testVariable")).to.equal(true);
		});

		it("should not match names without proper prefix when used in a regex", () =>
		{
			const regex = new RegExp(`^m_${VALID_MEMBER_PATTERN_PART}`, "u");
			expect(regex.test("testVariable")).to.equal(false);
		});
	});
});
