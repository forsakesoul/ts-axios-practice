import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helps/url'
import { flattenHeaders } from '../helps/headers'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  // 将 config 转换为 response
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.data = transform(config.data, config.headers, config.transformRequest!)
  // 扁平 headers
  config.headers = flattenHeaders(config.headers, config.method!)
}

function transformUrl(config: AxiosRequestConfig): string {
  const { url, params, paramsSerializer } = config
  return buildURL(url!, params, paramsSerializer)
}

function transformResponseData(res: AxiosResponse): any {
  res.data = transform(res.data, res.headers, res.config.transformResponse!)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
