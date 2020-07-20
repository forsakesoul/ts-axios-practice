import axios, { Canceler } from '../../src/index'

const CancelToken = axios.CancelToken
const source= CancelToken.source()

axios.get('/cancel/get', {
  cancelToken: source.token
}).catch((e) => {
  if (axios.isCancel(e)) {
    console.log('Request canceled', e.message)
  }
})

setTimeout(() => {
  source.cancel('Operation canceled by user')
  setTimeout(() => {
    axios.post('/cancel/post', {a: 1}, {
      cancelToken: source.token
    }).catch(e => {
      if (axios.isCancel(e)) {
        console.log('😭', e.message)
      }
    })
  }, 100);
}, 100)

let cancel: Canceler
axios.get('/cancel/get', {
  cancelToken: new CancelToken(c => {
    cancel = c
  })
}).catch(e => {
  if (axios.isCancel(e)) {
    console.log('500 Request canceled', e)
  }
})

setTimeout(() => {
  cancel();
}, 500);