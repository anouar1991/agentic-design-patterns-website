import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import { AuthProvider } from './contexts/AuthContext'
import { ProgressProvider } from './contexts/ProgressContext'
import { MotionProvider } from './contexts/MotionContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'
import PageLoadingSkeleton, { ChapterLoadingSkeleton } from './components/PageLoadingSkeleton'

// Route-based code splitting: lazy load pages that aren't the initial landing
const Introduction = lazy(() => import('./pages/Introduction'))
const Chapters = lazy(() => import('./pages/Chapters'))
const Chapter = lazy(() => import('./pages/Chapter'))
const LearningPath = lazy(() => import('./pages/LearningPath'))
const Playground = lazy(() => import('./pages/Playground'))
const Leaderboard = lazy(() => import('./pages/Leaderboard'))
const Profile = lazy(() => import('./pages/Profile'))

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MotionProvider>
          <AuthProvider>
            <ProgressProvider>
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="introduction" element={<Suspense fallback={<PageLoadingSkeleton />}><Introduction /></Suspense>} />
                <Route path="chapters" element={<Suspense fallback={<PageLoadingSkeleton />}><Chapters /></Suspense>} />
                <Route path="chapter/:id" element={<Suspense fallback={<ChapterLoadingSkeleton />}><Chapter /></Suspense>} />
                <Route path="learning-path" element={<Suspense fallback={<PageLoadingSkeleton />}><LearningPath /></Suspense>} />
                <Route path="playground" element={<Suspense fallback={<PageLoadingSkeleton />}><Playground /></Suspense>} />
                <Route path="leaderboard" element={<Suspense fallback={<PageLoadingSkeleton />}><Leaderboard /></Suspense>} />
                <Route path="profile" element={<Suspense fallback={<PageLoadingSkeleton />}><Profile /></Suspense>} />
              </Route>
            </Routes>
            </BrowserRouter>
            </ProgressProvider>
          </AuthProvider>
        </MotionProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
