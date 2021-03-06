module.exports = {
    parser: "@typescript-eslint/parser",
    // Specifies the ESLint parser
    extends: [
        // Uses the recommended rules from @eslint-plugin-react
        "plugin:react/recommended",
        // Uses the recommended rules from @typescript-eslint/eslint-plugin
        "plugin:@typescript-eslint/recommended",
        // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors.
        // Make sure this is always the last configuration in the extends array.
        "plugin:prettier/recommended"
    ],
    parserOptions: {
        ecmaVersion: 2018,
        // Allows for the parsing of modern ECMAScript features
        sourceType: "module",
        // Allows for the use of imports
        ecmaFeatures: {
            jsx: true
            // Allows for the parsing of JSX
        }
    },
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        quotes: ["error", "double"],
        "@typescript-eslint/no-var-requires": 0,
        "@typescript-eslint/explicit-function-return-type": "off",
        "block-spacing": ["error", "always"],
        "space-before-blocks": ["error", "always"],
        "object-curly-spacing": ["error", "always"],
        "eol-last": ["error", "always"],
        "comma-dangle": ["error", "never"],
        "no-unused-vars": "error",
        "@typescript-eslint/ban-ts-ignore": 0
    },
    settings: {
        react: {
            version: "detect"
            // Tells eslint-plugin-react to automatically detect the version of React to use
        }
    }
};
