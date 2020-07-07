import { appEvents } from 'app/core/core'
const hostname = window.location.hostname
export const influxHost = 'http://' + hostname + ':8086/'

export const get = url => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onreadystatechange = handleResponse
    xhr.onerror = e => reject(e)
    xhr.send()

    function handleResponse () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var res = JSON.parse(xhr.responseText)
          resolve(res)
        } else {
          reject(this.statusText)
        }
      }
    }
  })
}

export const alert = (type, title, msg) => {
  appEvents.emit('alert-' + type, [title, msg])
}

export const copyObject = obj => {
  const json = JSON.stringify(obj)
  return JSON.parse(json)
}

export const formatter = params => {

}
