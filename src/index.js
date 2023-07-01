import { relative } from 'node:path'

import { schema, getMagicComment } from 'magic-comments'
import { validate } from 'schema-utils'

const hasNoComments = (node) => {
  return ['leading', 'inner', 'trailing'].every((prefix) => !node[`${prefix}Comments`])
}

export default function () {
  return {
    visitor: {
      CallExpression(path, state) {
        const { node } = path
        const { opts } = state

        validate(schema, opts, {
          name: 'babel-plugin-magic-comments',
          baseDataPath: 'options'
        })

        if (node.callee?.type === 'Import') {
          const { verbose = false, match = 'module', ...magicCommentOpts } = opts
          const { root, filename } = state.file.opts
          const { code } = state.file
          /**
           * Only one argument for now. Either way, the first is the specifier.
           * @see https://github.com/tc39/proposal-import-attributes
           */
          const specifier = path.get('arguments')[0]
          const specifierValue = code.slice(specifier.node.start, specifier.node.end)

          if (hasNoComments(specifier.node)) {
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
                const relativeFilename = relative(root, filename)
                const updatedImport = code
                  .slice(node.start, node.end)
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
}
