import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import AdicionarStock from './pages/AdicionarStock'
import Sala1 from './pages/Sala1'
import Sala2 from './pages/Sala2'
import Movimentos from './pages/Movimentos'
import Materiais from './pages/Materiais'
import MaterialDetalhe from './pages/MaterialDetalhe'
import { styles } from './styles/styles'

function App() {
  return (
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
  )
}

export default App