import replaceApi from '../dist/utils/regexp-replace'

describe('regexp replace', () => {
  it('replaceApi(example) single', () => {
    const regexp = replaceApi('example')
    expect(regexp).toEqual(
      /^\/example(?:\/|-json|\/json|\/static\/index\.html)?$/,
    )
    expect('/example/json').toMatch(regexp)
    expect('/example-json').toMatch(regexp)
    expect('/example').toMatch(regexp)
    expect('/example/').toMatch(regexp)
    expect('/example/static/index.html').toMatch(regexp)
    expect('/example/v1/cat').not.toMatch(regexp)
  })
  it('replaceApi(example/path) with slash', () => {
    const regexp = replaceApi('example/path')
    expect(regexp).toEqual(
      /^\/example\/path(?:\/|-json|\/json|\/static\/index\.html)?$/,
    )
    expect('/example/path/json').toMatch(regexp)
    expect('/example/path-json').toMatch(regexp)
    expect('/example/path').toMatch(regexp)
    expect('/example/path/').toMatch(regexp)
    expect('/example/path/static/index.html').toMatch(regexp)
    expect('/example/path/v1/cat').not.toMatch(regexp)
  })
})
