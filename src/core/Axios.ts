import dispatchRequest from './dispatchRequest'
import { AxiosPromise, AxiosRequestConfig, Method } from '../types'

export default class Axios {
  request(url: any, config?: any): AxiosPromise {
    // 内部参数校验，实现函数重载功能
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }
    return dispatchRequest(config)
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithOutData('get', url, config)
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithOutData('delete', url, config)
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithOutData('head', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithData('post', url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithData('put', url, data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.requestMethodWithData('patch', url, data, config)
  }

  private requestMethodWithOutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(
      Object.assign(config || {}, {
        methods: method,
        url
      })
    )
  }

  private requestMethodWithData(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) {
    return this.request(
      Object.assign(config || {}, {
        methods: method,
        url,
        data
      })
    )
  }
}
