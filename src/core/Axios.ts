import dispatchRequest from './dispatchRequest'
import { AxiosPromise, AxiosRequestConfig, Method } from '../types'

export default class Axios {
  request<T = any>(url: any, config?: any): AxiosPromise<T> {
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

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this.requestMethodWithOutData('get', url, config)
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this.requestMethodWithOutData('delete', url, config)
  }

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this.requestMethodWithOutData('head', url, config)
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this.requestMethodWithData('post', url, data, config)
  }

  options<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this.requestMethodWithData('options', url, data, config)
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this.requestMethodWithData('put', url, data, config)
  }

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this.requestMethodWithData('patch', url, data, config)
  }

  private requestMethodWithOutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(
      Object.assign(config || {}, {
        method,
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
        method,
        url,
        data
      })
    )
  }
}
