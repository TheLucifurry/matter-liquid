import antfu from '@antfu/eslint-config'

export default antfu({
  vue: false,
}, {
  rules: {
    'no-restricted-syntax': 'warn',
    'no-console': 'warn',
    'unused-imports/no-unused-vars': 'off',
  },
})
