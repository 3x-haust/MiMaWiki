import { Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/home'
import { NotFoundPage } from '../pages/notfound'
import { Header } from '../widgets/header'
import { Footer } from '../widgets/footer'

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
