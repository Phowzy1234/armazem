import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './Lib/supabase'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Movimentos from './pages/Movimentos'
import Materiais from './pages/Materiais'
import MaterialDetalhe from './pages/MaterialDetalhe'
import AdicionarStock from './pages/AdicionarStock'
import Sala1 from './pages/Sala1'
import Sala2 from './pages/Sala2'
import Login from './pages/Login'
import Registo from './pages/Registo'
import { styles } from './styles/styles'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div style={{ padding: '30px' }}>A carregar...</div>
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={session ? <Navigate to="/" replace /> : <Login />}
      />

      <Route
        path="/registo"
        element={session ? <Navigate to="/" replace /> : <Registo />}
      />

      <Route
        path="*"
        element={
          <ProtectedRoute session={session}>
            <div style={styles.app}>
              <Navbar />
              <div style={styles.container}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/movimentos" element={<Movimentos />} />
                  <Route path="/materiais" element={<Materiais />} />
                  <Route path="/materiais/:id" element={<MaterialDetalhe />} />
                  <Route path="/adicionar" element={<AdicionarStock />} />
                  <Route path="/sala1" element={<Sala1 />} />
                  <Route path="/sala2" element={<Sala2 />} />
                </Routes>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App