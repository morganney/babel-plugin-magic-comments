# [`babel-plugin-magic-comments`](https://www.npmjs.com/package/babel-plugin-magic-comments)

![CI](https://github.com/morganney/babel-plugin-magic-comments/actions/workflows/ci.yml/badge.svg)
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
      ['babel-plugin-magic-comments', {
        webpackChunkName: true,
        webpackMode: "eager",
        webpackFetchPriority: "high"
      }]
    ]
  }
}
```
