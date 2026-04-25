import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../Lib/supabase'
import { styles } from '../styles/styles'

function Materiais() {
  const [materiais, setMateriais] = useState([])
  const [pesquisa, setPesquisa] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarMateriais()
  }, [])

  async function carregarMateriais() {
    setErro('')

    const { data: materiaisData, error: materiaisError } = await supabase
      .from('materiais')
      .select('*')
      .eq('ativo', true)
      .order('nome', { ascending: true })

    if (materiaisError) {
      setErro(materiaisError.message)
      return
    }

    const { data: movimentosData, error: movimentosError } = await supabase
      .from('movimentos_stock')
      .select('material_id, tipo, quantidade, sala_id')

    if (movimentosError) {
      setErro(movimentosError.message)
      return
    }

    const mapa = {}

    ;(movimentosData || []).forEach((movimento) => {
      if (!mapa[movimento.material_id]) {
        mapa[movimento.material_id] = {
          sala1: 0,
          sala2: 0,
          total: 0,
        }
      }

      const quantidade = Number(movimento.quantidade)
      const valor = movimento.tipo === 'entrada' ? quantidade : -quantidade

      if (movimento.sala_id === 1) mapa[movimento.material_id].sala1 += valor
      if (movimento.sala_id === 2) mapa[movimento.material_id].sala2 += valor

      mapa[movimento.material_id].total += valor
    })

    const listaFinal = (materiaisData || []).map((material) => ({
      ...material,
      sala1: mapa[material.id]?.sala1 || 0,
      sala2: mapa[material.id]?.sala2 || 0,
      total: mapa[material.id]?.total || 0,
    }))

    setMateriais(listaFinal)
  }

  const materiaisFiltrados = useMemo(() => {
    return materiais.filter((material) => {
      const matchPesquisa =
        material.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
        (material.descricao || '').toLowerCase().includes(pesquisa.toLowerCase())

      if (!matchPesquisa) return false

      if (filtro === 'baixo') {
        return Number(material.stock_minimo || 0) > 0 && material.total <= Number(material.stock_minimo || 0)
      }

      if (filtro === 'semstock') {
        return material.total <= 0
      }

      if (filtro === 'sala1') {
        return material.sala1 > 0
      }

      if (filtro === 'sala2') {
        return material.sala2 > 0
      }

      return true
    })
  }, [materiais, pesquisa, filtro])

  return (
    <div style={styles.pageContent}>
      <div style={styles.sectionHeader}>
        <h1 style={styles.title}>Materiais</h1>
        <p style={styles.subtitle}>Pesquisa, controlo e consulta rápida dos materiais.</p>
      </div>

      {erro && <div style={styles.alertError}>Erro: {erro}</div>}

      <div style={styles.formCard}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
          <div>
            <label style={styles.label}>Pesquisar</label>
            <input
              type="text"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              placeholder="Procurar por nome ou descrição"
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>Filtro</label>
            <select value={filtro} onChange={(e) => setFiltro(e.target.value)} style={styles.input}>
              <option value="todos">Todos</option>
              <option value="baixo">Stock baixo</option>
              <option value="semstock">Sem stock</option>
              <option value="sala1">Com stock na Sala 1</option>
              <option value="sala2">Com stock na Sala 2</option>
            </select>
          </div>
        </div>
      </div>

      <div style={styles.infoBox}>
        {materiaisFiltrados.length === 0 ? (
          <p style={styles.infoText}>Não foram encontrados materiais.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Material</th>
                  <th style={styles.th}>Sala 1</th>
                  <th style={styles.th}>Sala 2</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Mínimo</th>
                  <th style={styles.th}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {materiaisFiltrados.map((material) => (
                  <tr key={material.id}>
                    <td style={styles.td}>
                      <strong>{material.nome}</strong>
                      <br />
                      <span style={{ color: '#64748b', fontSize: '13px' }}>
                        {material.descricao || 'Sem descrição'}
                      </span>
                    </td>
                    <td style={styles.td}>{material.sala1}</td>
                    <td style={styles.td}>{material.sala2}</td>
                    <td style={styles.td}>{material.total} {material.unidade}</td>
                    <td style={styles.td}>{material.stock_minimo || 0}</td>
                    <td style={styles.td}>
                      <Link to={`/materiais/${material.id}`} style={styles.secondaryButtonLink}>
                        Ver detalhe
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Materiais