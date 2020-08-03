import axios from "../../src";

function getA() {
  return axios.get('/all/A')
}

function getB() {
  return axios.get('/all/B')
}

axios.all([getA(), getB()]).then(
  axios.spread(function(resA, resB) {
    console.log(resA.data)
    console.log(resB.data)
  })
)

const fakeConfig = {
  baseURL: 'https://www.baidu.com',
  url: '/user/1234',
  params: {
    idClient: 1,
    idTest: 2,
    test: 'test'
  }
}

console.log(axios.getUri(fakeConfig))