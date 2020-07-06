import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helps/url'
import { transformRequest, transformResponse } from '../helps/data'
import { processHeaders, flattenHeaders } from '../helps/headers'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  // 将 config 转换为 response
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  // 在 data 处理前
  config.headers = transformHeaders(config)
  // JSON 化 data
  config.data = transformRequestData(config)
  // 扁平 headers
  config.headers = flattenHeaders(config.headers, config.method!)
}

function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params)
}

function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

function transformResponseData(res: AxiosResponse): any {
  res.data = transformResponse(res.data)
  return res
}
