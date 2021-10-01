const _get = require("lodash.get");
const camelcase = require("camelcase");
const NODE_TYPE2IDENTIFIER_TYPE = require("../constants/types");
const { VALID_MEMBER_PATTERN_PART, VALID_GLOBAL_CONSTANT_PATTERN } = require("../constants/pattern")

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
	let isValid = true;

	if (Array.isArray(prefix))
	{
		prefix.forEach(pref =>
		{
			const regex = _getRegexExp(pref);
			isValid = regex.test(string);
		})
	}

	return isValid;
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
	if (_isOneOfValidPrefixedIdentifiers(string, ["m_", "g_", "s_"]))
	{
		return prefix + string.substring(2);
	}

	return _prefixCamelCaseIdentifier(string, prefix);
}

function _normalizePrefixList(prefix)
{
	return prefix.join("' or '");
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