import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { jest } from '@jest/globals'
import { transformFileSync } from '@babel/core'

import plugin from '../src/index.js'

const directory = dirname(fileURLToPath(import.meta.url))

jest.mock('magic-comments', () => {
  return {
    ...jest.requireActual('magic-comments'),
    getMagicComment: jest.fn(() => '')
  }
})

describe('babel-plugin-magic-comments', () => {
  it('adds webpackChunkName magic comments', () => {
    const { code: basic } = transformFileSync(
      resolve(directory, '__fixtures__/basic.js'),
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
      resolve(directory, '__fixtures__/dynamic.js'),
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

    const { code: file } = transformFileSync(resolve(directory, '__fixtures__/file.js'), {
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
    const { code } = transformFileSync(resolve(directory, '__fixtures__/basic.js'), {
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
    const { code } = transformFileSync(resolve(directory, '__fixtures__/basic.js'), {
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
