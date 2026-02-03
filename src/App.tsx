import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Introduction from './pages/Introduction'
import Chapters from './pages/Chapters'
import Chapter from './pages/Chapter'
import LearningPath from './pages/LearningPath'
import Playground from './pages/Playground'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import { AuthProvider } from './contexts/AuthContext'
import { ProgressProvider } from './contexts/ProgressContext'
import { MotionProvider } from './contexts/MotionContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'

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
                <Route path="introduction" element={<Introduction />} />
                <Route path="chapters" element={<Chapters />} />
                <Route path="chapter/:id" element={<Chapter />} />
                <Route path="learning-path" element={<LearningPath />} />
                <Route path="playground" element={<Playground />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="profile" element={<Profile />} />
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
