module.exports = {
    root: true,
    env: {
        node: true,
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
        'plugin:vue/base',
        'plugin:vue/vue3-essential',
        'plugin:vue/vue3-strongly-recommended',
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        '@vue/prettier',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2024,
        parser: '@typescript-eslint/parser',
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'prettier/prettier': [
            'warn',
            {
                trailingComma: 'all',
                arrowParens: 'always',
                singleQuote: true,
                semi: true,
                tabWidth: 4,
                endOfLine: 'auto',
            },
        ],
    },
    overrides: [
        {
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)',
            ],
            env: {
                jest: true,
            },
        },
    ],
};
