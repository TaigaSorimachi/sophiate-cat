import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import SophiateGalaxy from './SophiateGalaxy'
import DemoShowcase from './DemoShowcase'

function App() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const normalized = path.replace(/\/+$/, '') || '/'
  if (normalized === '/demos' || normalized === '/demo') {
    return <DemoShowcase />
  }
  return <SophiateGalaxy />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
