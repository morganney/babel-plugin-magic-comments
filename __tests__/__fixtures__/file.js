import('./folder/module.js').then(() => {
  const slug = 'module'
  const json = `foo-bar-baz-${import(`./${slug}.json`)}abc`

  return json
})

import(/* some comment */ './folder/skip.js')

reg([
  { module: import('@pkg/foo'), elem: 'Foo' },
  { module: import('@pkg/bar'), elem: 'Bar' },
  { module: import('@pkg/baz'), elem: 'Baz' }
])

Promise.all([import('@pkg/a'), import('@pkg/b'), import('@pkg/c')])
