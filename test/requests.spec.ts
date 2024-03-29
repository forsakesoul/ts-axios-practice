import axios, { AxiosResponse, AxiosError } from '../src/index'
import { getAjaxRequest } from './helper'

describe('requests', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should treat single string arg as url', done => {
    axios('/foo')

    // 返回 promise 结束调用
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('GET')
      done()
    })
  })

  test('should treat method value as lowercase string', done => {
    axios({
      url: '/foo',
      method: 'POST'
    }).then(response => {
      expect(response.config.method).toBe('post')
      done()
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200
      })
    })
  })

  test('should reject on network errors', done => {
    jasmine.Ajax.uninstall()
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })
    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })

    axios('/foo')
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    // https://hpstream.github.io/ts-axios/chapter11/requests.html#%E6%B5%8B%E8%AF%95%E4%BB%A3%E7%A0%81%E7%BC%96%E5%86%99
    function next(reason: AxiosResponse | AxiosError) {
      // TODO: 这块 reason 是 undefined
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Network Error')
      expect(reason.request).toEqual(expect.any(XMLHttpRequest))

      jasmine.Ajax.install()

      done()
    }
  })

  test('should reject when request timeout', done => {
    let err: AxiosError
    axios('/foo', {
      timeout: 2000,
      method: 'post'
    }).catch(error => {
      err = error
    })

    getAjaxRequest().then(request => {
      // @ts-ignore
      request.eventBus.trigger('timeout')

      setTimeout(() => {
        // TODO: error
        console.log(typeof err, Object.prototype.toString.call(err))
        expect(err instanceof Error).toBeTruthy()
        expect(err.message).toBe('Timeout of 2000 ms exceeded')
        done()
      }, 100)
    })
  })

  test('should reject when validateStatus return false', done => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })

    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })

    axios('/foo', {
      validateStatus(status) {
        return status !== 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 500
      })
      done()
    })

    function next(reason: AxiosError | AxiosResponse) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Request failed with status code 500')
      expect((reason as AxiosError).response!.status).toBe(500)
    }
  })

  test('should resolve when validateStatus returns true', done => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })

    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })

    axios('/foo', {
      validateStatus(status) {
        return status === 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 500
      })
      done()
    })

    function next(res: AxiosError | AxiosResponse) {
      expect(resolveSpy).toHaveBeenCalled()
      expect(rejectSpy).not.toHaveBeenCalled()
      expect(res.config.url).toBe('/foo')
    }
  })

  test('should return JSON when resolved', done => {
    let response: AxiosResponse
    axios('/api/account/singup', {
      auth: {
        username: '',
        password: ''
      },
      method: 'post',
      headers: {
        Accept: 'application/json'
      }
    }).then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"error": 0}'
      })
    })

    setTimeout(() => {
      expect(response.data).toEqual({ error: 0 })
      done()
    }, 100)
  })

  test('should return JSON when rejecting', done => {
    let response: AxiosResponse
    axios('/api/account/singup', {
      auth: {
        username: '',
        password: ''
      },
      method: 'post',
      headers: {
        Accept: 'application/json'
      }
    }).catch(error => {
      response = error.response
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 400,
        statusText: 'Bad Request',
        responseText: '{"error": "BAD USERNAME", "code": 1}'
      })
    })

    setTimeout(() => {
      expect(typeof response.data).toBe('object')
      expect(response.data.error).toBe('BAD USERNAME')
      expect(response.data.code).toBe(1)
      done()
    }, 100)
  })

  test('should supply correct response', done => {
    let response: AxiosResponse

    axios.post('/foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"foo": "bar"}',
        responseHeaders: {
          'Content-Type': 'application/json'
        }
      })
    })

    setTimeout(() => {
      expect(response.data.foo).toBe('bar')
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(response.headers['content-type']).toBe('application/json')
      done()
    }, 100)
  })

  test('should allow overriding Content-Type header case-insensitive', done => {
    let response: AxiosResponse

    axios
      .post('/foo', {
        prop: 'value',
        headers: {
          'content-type': 'application/json'
        }
      })
      .then(res => {
        response = res
      })

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['Content-Type']).toBe('application/json;charset=utf-8')
      done()
    })
  })
})
