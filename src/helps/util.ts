const toString = Object.prototype.toString

export function isDate(val: any): val is Date { // 类型保护
  return toString.call(val) === '[object Date]'
}

// export function isObject(val: any): val is Object {
//   return typeof val === 'object' && val !== null
// }

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}
