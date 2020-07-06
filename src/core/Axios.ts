import dispatchRequest from './dispatchRequest'
import {
  AxiosPromise,
  AxiosRequestConfig,
  Method,
  AxiosResponse,
  ResolvedFn,
  RejectedFn
} from '../types'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

export default class Axios {
  defaults: AxiosRequestConfig
  interceptors: Interceptors

  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

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

    // 合并配置
    config = mergeConfig(this.defaults, config)

    // 添加拦截器
    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })

    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    let promise = Promise.resolve(config)
    while (chain.length) {
      const { resolved, rejected } = chain.shift()! // reject 可能空，所以此处使用类型断言
      promise = promise.then(resolved, rejected)
    }

    return promise
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
