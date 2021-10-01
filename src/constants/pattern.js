const VALID_GLOBAL_CONSTANT_PATTERN = /^[\p{Lu}][\p{Lu}\p{N}_]*$/u;
const VALID_MEMBER_PATTERN_PART = "[a-z]+[A-Z]*\\S*";

module.exports = { 
	VALID_GLOBAL_CONSTANT_PATTERN,
	VALID_MEMBER_PATTERN_PART
};