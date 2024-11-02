// App.js (React)
import React, { useState } from 'react'

function App() {
  let film = `https://film2movie.upera.tv/3002586-11-480.mp4?ref=lKB6`
  let image = `https://www.film2movie.asia/content/uploads/Ghorbat07.jpg`
  const [url, setUrl] = useState(film)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [isPaused, setIsPaused] = useState(false) // NEW: Track if download is paused

  const startDownload = () => {
    window.api.startDownload(url) // Only pass the URL
    setStatus('Downloading...')
  }

  // Setting up listeners
  window.api.onProgress((newProgress) => {
    if (!isNaN(newProgress)) {
      setProgress(newProgress)
    }
  })

  window.api.onComplete((filePath) => {
    setStatus(`Download complete: ${filePath}`)
  })

  window.api.onFailure((error) => {
    setStatus(`Download failed: ${error}`)
  })
  const pauseDownload = () => {
    window.api.pauseDownload() // To be implemented in `preload.js` and main
    setIsPaused(true)
    setStatus('Paused')
  }

  const resumeDownload = () => {
    window.api.resumeDownload() // To be implemented in `preload.js` and main
    setIsPaused(false)
    setStatus('Resuming...')
  }
  return (
    <div>
      <h1>Electron Download Manager</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
      />
      <button onClick={startDownload}>Start Download</button>
      <button onClick={isPaused ? resumeDownload : pauseDownload}>
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <div>
        <p>Status: {status}</p>
        <progress value={progress} max="100">
          {progress}%
        </progress>
      </div>
    </div>
  )
}

export default App
