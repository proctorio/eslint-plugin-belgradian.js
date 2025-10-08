const  { onMemberPrefixRuleCreate }  = require("./rules/memberPrefixRule");

module.exports = {
	rules: {
		"member-prefix-rule": {
			meta: {
				type: "problem",
				docs: {
					description: "Enforce Hungarian notation-style prefixes with camelCase formatting",
					category: "Stylistic Issues",
					recommended: false
				},
				schema: [
					{
						type: "object",
						properties: {
							include: {
								type: "array",
								items: {
									type: "string"
								},
								description: "Additional prefixes to enforce beyond the default m_ prefix"
							},
							exceptions: {
								type: "array",
								items: {
									type: "string"
								},
								description: "Variable names that are exempt from prefix requirements"
							}
						},
						additionalProperties: false
					}
				]
			},
			create: onMemberPrefixRuleCreate,
		},
	},
};
