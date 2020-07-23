import axios from '../../src/axios'
import NProgress from 'nprogress'

const instance = axios.create()

function calculatePercentage(loaded: number, total: number) {
  return Math.floor(loaded * 1.0) / total
}

function loadProcessBar() {
  const setupStartProcess = () => {
    instance.interceptors.request.use(config => {
      NProgress.start()
      return config
    })
  }
  const setUpdateProcess = () => {
    const update = (e: ProgressEvent) => {
      console.log(e)
      NProgress.set(calculatePercentage(e.loaded, e.total))
    }
    instance.defaults.onUploadProgress = update
    instance.defaults.onDownloadProgress = update
  }
  const setupStopProcess = () => {
    instance.interceptors.response.use(response => {
      NProgress.done()
      return response
    }, err => {
      NProgress.done()
      return Promise.reject(err)
    })
  }

  setupStartProcess()
  setUpdateProcess()
  setupStopProcess()
}
loadProcessBar()

const downloadEl = document.getElementById('download')

downloadEl!.addEventListener('click', e=> {
  instance.get('https://img.mukewang.com/5f117a9500017d6818720764.jpg')
})

const uploadEl = document.getElementById('upload')

uploadEl!.addEventListener('click', e => {
  const data = new FormData()
  const fileEl = document.getElementById('file') as HTMLInputElement
  if (fileEl.files) {
    data.append('file', fileEl.files[0])
    instance.post('/more/upload', data)
  }
})