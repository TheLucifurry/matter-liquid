const antfu = require('@antfu/eslint-config').default

module.exports = antfu({
  vue: false,
  ignores: ['./build'],
}, {
  rules: {
    'no-restricted-syntax': 'warn',
    'no-console': 'warn',
    'unused-imports/no-unused-vars': 'warn',
  },
})

// TODO: Use it, after migrate to package.json:type=module
// import antfu from '@antfu/eslint-config'

// export default antfu()
