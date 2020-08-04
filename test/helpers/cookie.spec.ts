import cookie from '../../src/helps/cookie'

describe('helpers: cookie', () => {
  test('should read cookies', () => {
    document.cookie = 'foo=baz'
    expect(cookie.read('foo')).toBe('baz')
  })
  test('should return null if cookie name is not exist', () => {
    document.cookie = 'foo=baz'
    expect(cookie.read('bar')).toBe(null)
  })
})
