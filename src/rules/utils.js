const NODE_TYPE2IDENTIFIER_TYPE = require("../constants/types");
const { VALID_MEMBER_PATTERN_PART, VALID_GLOBAL_CONSTANT_PATTERN } = require("../constants/pattern")

/**
 * Native implementation of lodash.get for safe property access
 * @param {Object} obj - The object to query
 * @param {string} path - The path of the property to get (e.g., "id.name")
 * @param {*} defaultValue - The value returned if the resolved value is undefined
 * @returns {*} The resolved value or defaultValue
 */
function _get(obj, path, defaultValue)
{
	const keys = path.split('.');
	let result = obj;
	
	for (const key of keys)
	{
		if (result == null || typeof result !== 'object')
		{
			return defaultValue;
		}
		result = result[key];
	}
	
	return result === undefined ? defaultValue : result;
}

/**
 * Native implementation of camelcase conversion
 * Converts strings to camelCase format
 * @param {string} str - The string to convert
 * @returns {string} The camelCased string
 */
function camelcase(str)
{
	// Remove leading/trailing whitespace and split by common delimiters
	return str
		.trim()
		.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
		.replace(/^[A-Z]/, (char) => char.toLowerCase());
}

function getVariableDeclaratorName(declarator)
{
	return _get(declarator, "id.name", "OK_ANYWAY");
}

function isNotAValidConstant()
{
	return (declarator) => 
	{
		const string = getVariableDeclaratorName(declarator);
		return !VALID_GLOBAL_CONSTANT_PATTERN.test(string);
	}
}

function isNotAnException(exceptions)
{
	return (variableName) => !exceptions.includes(variableName);
}

function _getRegexExp(prefix)
{
	return RegExp(`^${prefix}${VALID_MEMBER_PATTERN_PART}`, "u");
}

function _isValidPrefixedIdentifierList(string, prefix)
{
	if (Array.isArray(prefix))
	{
		return prefix.some(pref =>
		{
			const regex = _getRegexExp(pref);
			return regex.test(string);
		});
	}

	const regex = _getRegexExp(prefix);
	return regex.test(string);
}

function isProblemVariableDeclarator(prefix)
{
	return (declarator) =>
		!_isValidPrefixedIdentifierList(
			getVariableDeclaratorName(declarator),
			prefix
		) &&
		(!declarator.init ||
			![
				"CallExpression",
				"MemberExpression",
				"NewExpression",
				"AwaitExpression",
				"ExpressionStatement",
				"ArrowFunctionExpression"
			].includes(declarator.init.type)
		);
}

function isVariableDeclaration(node)
{
	return node.type === "VariableDeclaration"
}

function _prefixCamelCaseIdentifier(pIdentifier, pPrefix)
{
	return `${pPrefix}${camelcase(pIdentifier)}`;
}

function _isOneOfValidPrefixedIdentifiers(string, prefixes)
{
	return prefixes.some((prefix) =>
	{
		const regex = _getRegexExp(prefix);

		return regex.test(string);
	});
}

function _normalizePrefixedIdentifier(string, prefix)
{
	// Get the first prefix from the array for suggestions
	const firstPrefix = Array.isArray(prefix) ? prefix[0] : prefix;
	
	if (_isOneOfValidPrefixedIdentifiers(string, ["m_", "g_", "s_"]))
	{
		return firstPrefix + string.substring(2);
	}

	return _prefixCamelCaseIdentifier(string, firstPrefix);
}

function _normalizePrefixList(prefix)
{
	if (Array.isArray(prefix))
	{
		return prefix.join("' or '");
	}
	return prefix;
}

function reportProblemIdentifiers(node, context, pProblemVariables, prefix)
{
	pProblemVariables.forEach(
		(problemVariableName) =>
		{
			context.report({
				node,
				message: `{{ variableType }} '{{ identifier }}' should be camel case and start with a '{{ prefix }}': '{{ betterIdentifier }}'`,
				data: {
					variableType: _get(
						NODE_TYPE2IDENTIFIER_TYPE,
						node.type,
						"local variable"
					),
					identifier: problemVariableName,
					betterIdentifier: _normalizePrefixedIdentifier(
						problemVariableName,
						prefix
					),
					prefix: _normalizePrefixList(prefix)
				}
			});
		}
	);
}

module.exports = {
	getVariableDeclaratorName,
	isNotAnException,
	isVariableDeclaration,
	isProblemVariableDeclarator,
	isNotAValidConstant,
	reportProblemIdentifiers
}