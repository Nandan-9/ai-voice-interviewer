import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import SetupPage from './pages/SetupPage'
import InstructionsPage from './pages/InstructionsPage'
import InterviewPage from './pages/InterviewPage'
import ResultsPage from './pages/ResultsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/instructions" element={<InstructionsPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
