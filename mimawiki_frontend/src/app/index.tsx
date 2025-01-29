import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/home'
import NotFoundPage from '../pages/notfound'
import SignupPage from '../pages/signup'
import LoginPage from '../pages/login'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App