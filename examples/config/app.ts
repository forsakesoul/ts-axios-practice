import axios, { AxiosTransformer } from '../../src/index'
import qs from 'qs'

axios.defaults.headers.common['test2'] = 123

axios({
  transformRequest: [
    (function (data) {
      return qs.stringify(data)
    }),
    ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as AxiosTransformer[]),
    (function (data) {
      if (typeof data === 'object') {
        data.b = 2
        return data
      }
    })
  ],
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  },
  headers: {
    test: '321'
  }
}).then(res => {
  console.log(res.data)
})


const instance = axios.create({
  transformRequest: [
    (function (data) {
      // return qs.stringify(data) // * form data
      return data // * request payload
      // return JSON.stringify(data)
    }),
    ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as AxiosTransformer[]),
    (function (data) {
      if (typeof data === 'object') {
        data.ccc = 2
        return data
      }
    })
  ],
})

instance({
  url: '/config/post2',
  method: 'post',
  data: {
    aa: 3
  },
  headers: {
    security: 'omg'
  }
}).then(res => {
  console.log(res)
})