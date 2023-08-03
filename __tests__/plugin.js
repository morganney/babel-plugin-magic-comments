import { resolve } from 'node:path'

import { describe, it, expect } from '@jest/globals'
import { transformFileSync } from '@babel/core'

/**
 * Switching to TypeScript has made a mess of my
 * simple, clean snapshots :cry:.
 *
 * @TODO switch to node:test
 */
import plugin from '../src/index.ts'

describe('babel-plugin-magic-comments', () => {
  it('adds webpackChunkName magic comments', () => {
    const { code: basic } = transformFileSync(
      resolve(__dirname, '__fixtures__/basic.js'),
      {
        plugins: [
          [
            plugin,
            {
              verbose: true,
              match: 'import',
              webpackChunkName: '**/module.js'
            }
          ]
        ]
      }
    )

    expect(basic).toMatchSnapshot()

    const { code: dynamic } = transformFileSync(
      resolve(__dirname, '__fixtures__/dynamic.js'),
      {
        plugins: [
          [
            plugin,
            {
              webpackChunkName: true
            }
          ]
        ]
      }
    )

    expect(dynamic).toMatchSnapshot()

    const { code: file } = transformFileSync(resolve(__dirname, '__fixtures__/file.js'), {
      plugins: [
        [
          plugin,
          {
            webpackChunkName: true
          }
        ]
      ]
    })

    expect(file).toMatchSnapshot()
  })

  it('adds the other magic comments', () => {
    const { code } = transformFileSync(resolve(__dirname, '__fixtures__/basic.js'), {
      plugins: [
        [
          plugin,
          {
            webpackPrefetch: true,
            webpackPreload: true,
            webpackMode: 'eager',
            webpackFetchPriority: 'high',
            webpackIgnore: true,
            webpackExports: () => ['foo', 'bar'],
            webpackInclude: /\.json$/,
            webpackExclude: (modulePath, importPath) => {
              if (importPath.includes('folder/module')) {
                return /\.skip\.json$/
              }
            }
          }
        ]
      ]
    })

    expect(code).toMatchSnapshot()
  })

  it('does not add magic comments when there are none', () => {
    const { code } = transformFileSync(resolve(__dirname, '__fixtures__/basic.js'), {
      plugins: [
        [
          plugin,
          {
            webpackChunkName: () => ''
          }
        ]
      ]
    })

    expect(code).toMatchSnapshot()
  })
})
