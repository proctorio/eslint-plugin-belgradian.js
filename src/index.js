const  { onMemberPrefixRuleCreate }  = require("./rules/memberPrefixRule");

module.exports = {
	rules: {
		"member-prefix-rule": {
			create: onMemberPrefixRuleCreate,
		},
	},
};