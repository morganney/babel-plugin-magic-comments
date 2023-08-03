import { relative } from 'node:path'

import { declare } from '@babel/helper-plugin-utils'
import { schema, getMagicComment } from 'magic-comments'
import { validate } from 'schema-utils'

import type { MagicComments, Match } from 'magic-comments'
import type { Schema } from 'schema-utils/declarations/validate.js'
import { Expression } from '@babel/types'

interface Options extends MagicComments {
  match?: Match
  verbose?: boolean
}

const hasNoComments = (node: Expression) => {
  return !node.leadingComments && !node.trailingComments && !node.innerComments
}

export default declare((api, opts: Options) => {
  api.assertVersion(7)

  return {
    visitor: {
      CallExpression(path) {
        validate(schema as Schema, opts, {
          name: 'babel-plugin-magic-comments',
          baseDataPath: 'options'
        })

        if (path.get('callee').isImport()) {
          const { verbose = false, match = 'module', ...magicCommentOpts } = opts
          const { root, filename } = this.file.opts
          const { code } = this.file

          /**
           * Only one argument for now. Either way, the first is the specifier.
           * @see https://github.com/tc39/proposal-import-attributes
           */
          const specifier = path.get('arguments')[0]
          const { start, end } = specifier.node
          const specifierValue = code.slice(start as number, end as number)

          if (hasNoComments(specifier.node as Expression) && filename) {
            const magicComment = getMagicComment({
              match,
              open: true,
              modulePath: filename,
              importPath: specifierValue,
              options: magicCommentOpts
            })

            if (magicComment) {
              specifier.addComment('leading', magicComment)

              if (verbose) {
                const { node } = path
                const relativeFilename = relative(root as string, filename)
                const updatedImport = code
                  .slice(node.start as number, node.end as number)
                  .replace(specifierValue, `/*${magicComment}*/ ${specifierValue}`)

                // eslint-disable-next-line no-console
                console.log(`[BPMC] ${relativeFilename}: ${updatedImport}`)
              }
            }
          }
        }
      }
    }
  }
})

export type { Options }
