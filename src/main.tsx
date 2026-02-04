import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n' // Initialize i18n before App
import './index.css'
import App from './App.tsx'
import { reportWebVitals } from './utils/webVitals'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

reportWebVitals()
