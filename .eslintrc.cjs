module.exports = {
	env: { browser: true, es2020: true, node: true },
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react-hooks/recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: { ecmaVersion: "latest", sourceType: "module" },
	plugins: ["react-refresh"],
	rules: {
		"@typescript-eslint/no-explicit-any": ["off"],
		"@typescript-eslint/no-non-null-assertion": ["off"],
	},
	globals: {
		window: true,
		document: true,
		localStorage: true,
		FormData: true,
		FileReader: true,
		Blob: true,
		navigator: true,
	},
};
