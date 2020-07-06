import { AxiosTransformer } from '../types'

export default function transform(
  data: any,
  headers: any,
  fns: AxiosTransformer | AxiosTransformer[]
): any {
  if (!fns) {
    return data
  }
  if (!Array.isArray(fns)) {
    fns = [fns]
  }

  fns.forEach(fn => {
    // 管道似调用
    data = fn(data, headers)
  })
  return data
}
