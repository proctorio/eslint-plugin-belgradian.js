# eslint-plugin-belgradian

The plugin is supposed to help
write elements in cascalCase and prefix them with a scope:

- `m_` for field members
- `g_` for global variables (outside of the Module or Class)

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-belgradian`:

```
$ npm install eslint-plugin-belgradian --save-dev
```

## Basic usage

Add `belgradian` to the plugins section of your `.eslintrc` configuration file. 
You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["belgradian"]
}
```

Then configure the rules you want to use under the rules section:

```json
{
  "rules": {
    "belgradian/member-prefix-rule": "error"
  }
}
```

Or:

```json
{
  "rules": {
    "belgradian/member-prefix-rule": [
		2, 
		{ "include": ["g_"], "exceptions": ["reservedVariable"] }
	]
  }
}
```

Inspired by Sander Verweij's [budapestian](https://github.com/sverweij/eslint-plugin-budapestian).