/**
 * @fileoverview Tests for pattern constants
 */

const { VALID_GLOBAL_CONSTANT_PATTERN, VALID_MEMBER_PATTERN_PART } = require("../src/constants/pattern");

describe("Pattern Constants", () => {
	describe("VALID_GLOBAL_CONSTANT_PATTERN", () => {
		test("should match valid ALL_CAPS constants", () => {
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("MAX_VALUE")).toBe(true);
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("API_KEY")).toBe(true);
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("HTTP_200_OK")).toBe(true);
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("X")).toBe(true);
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("PI")).toBe(true);
		});

		test("should match constants with numbers", () => {
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("ERROR_404")).toBe(true);
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("VERSION_2_0")).toBe(true);
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("A1B2C3")).toBe(true);
		});

		test("should match constants with underscores", () => {
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("MY_CONSTANT_VALUE")).toBe(true);
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("A_B_C_D_E")).toBe(true);
		});

		test("should not match lowercase variables", () => {
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("myVariable")).toBe(false);
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("lowercase")).toBe(false);
		});

		test("should not match camelCase variables", () => {
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("myVariable")).toBe(false);
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("firstName")).toBe(false);
		});

		test("should not match PascalCase variables", () => {
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("MyVariable")).toBe(false);
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("FirstName")).toBe(false);
		});

		test("should not match mixed case", () => {
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("Max_Value")).toBe(false);
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("MY_Variable")).toBe(false);
		});

		test("should not match variables starting with lowercase", () => {
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("mAX_VALUE")).toBe(false);
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("x_VALUE")).toBe(false);
		});

		test("should not match variables starting with numbers", () => {
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("1_CONSTANT")).toBe(false);
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("404_ERROR")).toBe(false);
		});

		test("should handle unicode uppercase characters", () => {
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("Ä")).toBe(true);
			expect(VALID_GLOBAL_CONSTANT_PATTERN.test("ÜBER")).toBe(true);
		});
	});

	describe("VALID_MEMBER_PATTERN_PART", () => {
		test("should be a valid regex pattern part", () => {
			const regex = new RegExp(`^m_${VALID_MEMBER_PATTERN_PART}`, "u");
			
			expect(regex.test("m_myVariable")).toBe(true);
			expect(regex.test("m_firstName")).toBe(true);
			expect(regex.test("m_camelCaseVar")).toBe(true);
		});

		test("should match lowercase start", () => {
			const regex = new RegExp(`^m_${VALID_MEMBER_PATTERN_PART}`, "u");
			
			expect(regex.test("m_myVar")).toBe(true);
			expect(regex.test("m_x")).toBe(true);
		});

		test("should allow uppercase after lowercase start", () => {
			const regex = new RegExp(`^m_${VALID_MEMBER_PATTERN_PART}`, "u");
			
			expect(regex.test("m_myVariable")).toBe(true);
			expect(regex.test("m_firstName")).toBe(true);
			expect(regex.test("m_xValue")).toBe(true);
		});

		test("should not match uppercase start", () => {
			const regex = new RegExp(`^m_${VALID_MEMBER_PATTERN_PART}`, "u");
			
			expect(regex.test("m_MyVariable")).toBe(false);
			expect(regex.test("m_FirstName")).toBe(false);
		});

		test("should allow numbers and special characters", () => {
			const regex = new RegExp(`^m_${VALID_MEMBER_PATTERN_PART}`, "u");
			
			expect(regex.test("m_value123")).toBe(true);
			expect(regex.test("m_my$var")).toBe(true);
		});
	});
});
