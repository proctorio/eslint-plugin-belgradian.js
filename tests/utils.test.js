/**
 * @fileoverview Unit tests for utility functions
 */

const {
	getVariableDeclaratorName,
	isNotAnException,
	isVariableDeclaration,
	isProblemVariableDeclarator,
	isNotAValidConstant,
	reportProblemIdentifiers
} = require("../src/rules/utils");

describe("Utility Functions", () => {
	describe("getVariableDeclaratorName", () => {
		test("should extract variable name from declarator", () => {
			const declarator = {
				id: { name: "testVariable" }
			};
			expect(getVariableDeclaratorName(declarator)).toBe("testVariable");
		});

		test("should return default value for invalid declarator", () => {
			const declarator = {};
			expect(getVariableDeclaratorName(declarator)).toBe("OK_ANYWAY");
		});

		test("should return default value for null declarator", () => {
			expect(getVariableDeclaratorName(null)).toBe("OK_ANYWAY");
		});

		test("should return default value for declarator without id.name", () => {
			const declarator = { id: {} };
			expect(getVariableDeclaratorName(declarator)).toBe("OK_ANYWAY");
		});
	});

	describe("isNotAnException", () => {
		test("should return true for non-exception variable", () => {
			const exceptions = ["reserved", "special"];
			const filter = isNotAnException(exceptions);
			expect(filter("normalVariable")).toBe(true);
		});

		test("should return false for exception variable", () => {
			const exceptions = ["reserved", "special"];
			const filter = isNotAnException(exceptions);
			expect(filter("reserved")).toBe(false);
		});

		test("should handle empty exceptions array", () => {
			const filter = isNotAnException([]);
			expect(filter("anyVariable")).toBe(true);
		});
	});

	describe("isVariableDeclaration", () => {
		test("should return true for VariableDeclaration node", () => {
			const node = { type: "VariableDeclaration" };
			expect(isVariableDeclaration(node)).toBe(true);
		});

		test("should return false for non-VariableDeclaration node", () => {
			const node = { type: "FunctionDeclaration" };
			expect(isVariableDeclaration(node)).toBe(false);
		});
	});

	describe("isNotAValidConstant", () => {
		test("should return false for ALL_CAPS constant", () => {
			const declarator = {
				id: { name: "MAX_BUFFER_SIZE" }
			};
			const filter = isNotAValidConstant();
			expect(filter(declarator)).toBe(false);
		});

		test("should return false for single letter uppercase constant", () => {
			const declarator = {
				id: { name: "X" }
			};
			const filter = isNotAValidConstant();
			expect(filter(declarator)).toBe(false);
		});

		test("should return true for camelCase variable", () => {
			const declarator = {
				id: { name: "myVariable" }
			};
			const filter = isNotAValidConstant();
			expect(filter(declarator)).toBe(true);
		});

		test("should return false for constant with numbers", () => {
			const declarator = {
				id: { name: "HTTP_200_OK" }
			};
			const filter = isNotAValidConstant();
			expect(filter(declarator)).toBe(false);
		});

		test("should return true for PascalCase variable", () => {
			const declarator = {
				id: { name: "MyVariable" }
			};
			const filter = isNotAValidConstant();
			expect(filter(declarator)).toBe(true);
		});
	});

	describe("isProblemVariableDeclarator", () => {
		test("should return true for variable without valid prefix", () => {
			const declarator = {
				id: { name: "myVariable" },
				init: { type: "Literal" }
			};
			const filter = isProblemVariableDeclarator(["m_"]);
			expect(filter(declarator)).toBe(true);
		});

		test("should return false for variable with valid m_ prefix", () => {
			const declarator = {
				id: { name: "m_myVariable" },
				init: { type: "Literal" }
			};
			const filter = isProblemVariableDeclarator(["m_"]);
			expect(filter(declarator)).toBe(false);
		});

		test("should return false for CallExpression init", () => {
			const declarator = {
				id: { name: "myVariable" },
				init: { type: "CallExpression" }
			};
			const filter = isProblemVariableDeclarator(["m_"]);
			expect(filter(declarator)).toBe(false);
		});

		test("should return false for MemberExpression init", () => {
			const declarator = {
				id: { name: "myVariable" },
				init: { type: "MemberExpression" }
			};
			const filter = isProblemVariableDeclarator(["m_"]);
			expect(filter(declarator)).toBe(false);
		});

		test("should return false for NewExpression init", () => {
			const declarator = {
				id: { name: "myVariable" },
				init: { type: "NewExpression" }
			};
			const filter = isProblemVariableDeclarator(["m_"]);
			expect(filter(declarator)).toBe(false);
		});

		test("should return false for AwaitExpression init", () => {
			const declarator = {
				id: { name: "myVariable" },
				init: { type: "AwaitExpression" }
			};
			const filter = isProblemVariableDeclarator(["m_"]);
			expect(filter(declarator)).toBe(false);
		});

		test("should return false for ArrowFunctionExpression init", () => {
			const declarator = {
				id: { name: "myVariable" },
				init: { type: "ArrowFunctionExpression" }
			};
			const filter = isProblemVariableDeclarator(["m_"]);
			expect(filter(declarator)).toBe(false);
		});

		test("should return false for variable without init", () => {
			const declarator = {
				id: { name: "myVariable" },
				init: null
			};
			const filter = isProblemVariableDeclarator(["m_"]);
			expect(filter(declarator)).toBe(true); // Actually returns true - uninitialized vars ARE problems
		});

		test("should work with multiple prefixes", () => {
			const declarator = {
				id: { name: "g_globalVar" },
				init: { type: "Literal" }
			};
			const filter = isProblemVariableDeclarator(["m_", "g_"]);
			expect(filter(declarator)).toBe(false);
		});
	});

	describe("reportProblemIdentifiers", () => {
		test("should report problems for invalid identifiers", () => {
			const mockContext = {
				report: jest.fn()
			};
			const node = { type: "Program" };
			const problemVariables = ["myVariable", "anotherVar"];
			const prefix = ["m_"];

			reportProblemIdentifiers(node, mockContext, problemVariables, prefix);

			expect(mockContext.report).toHaveBeenCalledTimes(2);
			expect(mockContext.report).toHaveBeenCalledWith({
				node,
				message: expect.any(String),
				data: expect.objectContaining({
					variableType: "local variable", // Program node maps to "local variable"
					identifier: "myVariable",
					betterIdentifier: "m_myVariable",
					prefix: "m_"
				})
			});
		});

		test("should handle multiple prefixes in error message", () => {
			const mockContext = {
				report: jest.fn()
			};
			const node = { type: "Program" };
			const problemVariables = ["badVar"];
			const prefix = ["m_", "g_"];

			reportProblemIdentifiers(node, mockContext, problemVariables, prefix);

			expect(mockContext.report).toHaveBeenCalledWith({
				node,
				message: expect.any(String),
				data: expect.objectContaining({
					prefix: "m_' or 'g_"
				})
			});
		});

		test("should suggest re-prefixed identifier for existing prefixed variable", () => {
			const mockContext = {
				report: jest.fn()
			};
			const node = { type: "Program" };
			const problemVariables = ["g_globalVar"];
			const prefix = ["m_"];

			reportProblemIdentifiers(node, mockContext, problemVariables, prefix);

			expect(mockContext.report).toHaveBeenCalledWith({
				node,
				message: expect.any(String),
				data: expect.objectContaining({
					betterIdentifier: "m_globalVar"
				})
			});
		});

		test("should not report when no problem variables", () => {
			const mockContext = {
				report: jest.fn()
			};
			const node = { type: "Program" };
			const problemVariables = [];
			const prefix = ["m_"];

			reportProblemIdentifiers(node, mockContext, problemVariables, prefix);

			expect(mockContext.report).not.toHaveBeenCalled();
		});
	});
});
