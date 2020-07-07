import { appEvents } from 'app/core/core'

export const alert = (type, title, msg) => {
  appEvents.emit('alert-' + type, [title, msg])
}

export const copyObject = obj => {
  const json = JSON.stringify(obj)
  return JSON.parse(json)
}
