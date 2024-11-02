import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Add your download-related functions here
  startDownload: (url, savePath) => ipcRenderer.invoke('start-download', url, savePath),
  onProgress: (callback) =>
    ipcRenderer.on('download-progress', (event, progress) => callback(progress)),
  onComplete: (callback) => ipcRenderer.on('download-complete', (event, path) => callback(path)),
  onFailure: (callback) => ipcRenderer.on('download-failed', (event, error) => callback(error))
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // Fallback for when context isolation is disabled
  window.electron = electronAPI
  window.api = api
}
