const { getVariableDeclaratorName, isNotAnException, isProblemVariableDeclarator, reportProblemIdentifiers, isVariableDeclaration, isNotAValidConstant } = require("./utils");

/**
 * @fileoverview Enforce global variables to adhere to a pattern
 * @author sverweij
 */
function _getProblemVariablesFromBody(body, exceptions, prefix)
{
	return body
		.filter(isVariableDeclaration)
		.reduce((all, constantDeclaration) =>
		{
			return all.concat(
				constantDeclaration.declarations
					.filter(isProblemVariableDeclarator(prefix))
					.filter(isNotAValidConstant())
					.map(getVariableDeclaratorName)
					.filter(isNotAnException(exceptions))
			);
		}, []);
}

const onMemberPrefixRuleCreate = (context) =>
{
	const { options } = context;
	const { include = [], exceptions = [] } = options[0] || {};
	const rulePrefix = ["m_"];

	return {
		Program(node)
		{
			const prefixes = [...rulePrefix, ...include];

			const problemGlobalVariables = _getProblemVariablesFromBody(
				node.body,
				exceptions,
				prefixes
			);

			reportProblemIdentifiers(
				node,
				context,
				problemGlobalVariables,
				prefixes
			);
		}
	}
};

module.exports = { onMemberPrefixRuleCreate };