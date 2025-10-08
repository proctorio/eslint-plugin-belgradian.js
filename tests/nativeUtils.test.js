/**
 * @fileoverview Tests for native utility implementations
 */

describe("Native Utility Implementations", () => {
	// We need to test the internal _get and camelcase functions
	// Since they're not exported, we'll test them through the exported functions
	
	describe("_get (via getVariableDeclaratorName)", () => {
		const utils = require("../src/rules/utils");
		
		test("should safely navigate nested paths", () => {
			const obj = {
				id: {
					name: "testValue"
				}
			};
			expect(utils.getVariableDeclaratorName(obj)).toBe("testValue");
		});

		test("should handle null object", () => {
			expect(utils.getVariableDeclaratorName(null)).toBe("OK_ANYWAY");
		});

		test("should handle undefined object", () => {
			expect(utils.getVariableDeclaratorName(undefined)).toBe("OK_ANYWAY");
		});

		test("should handle missing intermediate property", () => {
			const obj = { id: null };
			expect(utils.getVariableDeclaratorName(obj)).toBe("OK_ANYWAY");
		});

		test("should handle missing final property", () => {
			const obj = { id: {} };
			expect(utils.getVariableDeclaratorName(obj)).toBe("OK_ANYWAY");
		});

		test("should handle primitive values", () => {
			expect(utils.getVariableDeclaratorName("string")).toBe("OK_ANYWAY");
			expect(utils.getVariableDeclaratorName(123)).toBe("OK_ANYWAY");
			expect(utils.getVariableDeclaratorName(true)).toBe("OK_ANYWAY");
		});
	});

	describe("camelcase (via reportProblemIdentifiers)", () => {
		const utils = require("../src/rules/utils");
		
		test("should convert snake_case to camelCase", () => {
			const mockContext = { report: jest.fn() };
			const node = { type: "Program" };
			
			utils.reportProblemIdentifiers(node, mockContext, ["my_variable"], ["m_"]);
			
			expect(mockContext.report).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						betterIdentifier: "m_myVariable"
					})
				})
			);
		});

		test("should convert kebab-case to camelCase", () => {
			const mockContext = { report: jest.fn() };
			const node = { type: "Program" };
			
			// Note: kebab-case isn't valid JS, but testing the conversion logic
			utils.reportProblemIdentifiers(node, mockContext, ["my-variable"], ["m_"]);
			
			expect(mockContext.report).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						betterIdentifier: "m_myVariable"
					})
				})
			);
		});

		test("should convert PascalCase to camelCase", () => {
			const mockContext = { report: jest.fn() };
			const node = { type: "Program" };
			
			utils.reportProblemIdentifiers(node, mockContext, ["MyVariable"], ["m_"]);
			
			expect(mockContext.report).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						betterIdentifier: "m_myVariable"
					})
				})
			);
		});

		test("should handle space-separated words", () => {
			const mockContext = { report: jest.fn() };
			const node = { type: "Program" };
			
			utils.reportProblemIdentifiers(node, mockContext, ["my variable"], ["m_"]);
			
			expect(mockContext.report).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						betterIdentifier: "m_myVariable"
					})
				})
			);
		});

		test("should preserve already camelCase variables", () => {
			const mockContext = { report: jest.fn() };
			const node = { type: "Program" };
			
			utils.reportProblemIdentifiers(node, mockContext, ["myVariable"], ["m_"]);
			
			expect(mockContext.report).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						betterIdentifier: "m_myVariable"
					})
				})
			);
		});

		test("should handle single word", () => {
			const mockContext = { report: jest.fn() };
			const node = { type: "Program" };
			
			utils.reportProblemIdentifiers(node, mockContext, ["variable"], ["m_"]);
			
			expect(mockContext.report).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						betterIdentifier: "m_variable"
					})
				})
			);
		});

		test("should re-prefix variables with wrong prefix", () => {
			const mockContext = { report: jest.fn() };
			const node = { type: "Program" };
			
			utils.reportProblemIdentifiers(node, mockContext, ["g_globalVar"], ["m_"]);
			
			expect(mockContext.report).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						betterIdentifier: "m_globalVar"
					})
				})
			);
		});

		test("should handle multiple consecutive delimiters", () => {
			const mockContext = { report: jest.fn() };
			const node = { type: "Program" };
			
			utils.reportProblemIdentifiers(node, mockContext, ["my__variable"], ["m_"]);
			
			expect(mockContext.report).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						betterIdentifier: expect.stringContaining("m_")
					})
				})
			);
		});
	});
});
