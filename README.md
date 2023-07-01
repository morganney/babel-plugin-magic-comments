# [`babel-plugin-magic-comments`](https://www.npmjs.com/package/babel-plugin-magic-comments)

![CI](https://github.com/morganney/babel-plugin-magic-comments/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/morganney/babel-plugin-magic-comments/branch/main/graph/badge.svg?token=92J7AMZH8N)](https://codecov.io/gh/morganney/babel-plugin-magic-comments)
[![NPM version](https://img.shields.io/npm/v/babel-plugin-magic-comments.svg)](https://www.npmjs.com/package/babel-plugin-magic-comments)

Babel plugin to add webpack [magic comments](https://webpack.js.org/api/module-methods/#magic-comments) to your dynamic `import()` expressions at build time.

## Getting Started

First install `babel-plugin-magic-comments`:

```
npm install babel-plugin-magic-comments
```

Next add the plugin to your `babel.config.js`:

```js
export default () => {
  return {
    plugins: [
      ['magic-comments', {
        verbose: true,
        webpackChunkName: true,
        webpackFetchPriority: "high"
      }]
    ]
  }
}
```

Or include it directly in your `webpack.config.js`:

```js
module: {
  rules: [
    {
      test: /\.[jt]sx?$/,
      use: {
        loader: 'babel-loader',
        options: {
          plugins: [
            ['magic-comments', {
              verbose: true,
              webpackChunkName: true,
              webpackFetchPriority: "high"
            }]
          ]
        }
      }
    }
  ]
}
```

Here is the [options documentation](https://github.com/morganney/magic-comments-loader#options) with the exception of (`mode`) which this package does not support.
