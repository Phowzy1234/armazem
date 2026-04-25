import { useEffect, useState } from 'react'
import { supabase } from '../Lib/supabase'
import { styles } from '../styles/styles'

function Dashboard() {
  const [dados, setDados] = useState({
    materiaisCriticos: [],
    semStock: [],
    totalSala1: 0,
    totalSala2: 0,
  })

  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarDashboard()
  }, [])

  async function carregarDashboard() {
    setErro('')

    const { data: movimentos, error } = await supabase
      .from('movimentos_stock')
      .select(`
        id,
        tipo,
        quantidade,
        sala_id,
        material_id,
        criado_em,
        materiais (
          id,
          nome,
          unidade,
          descricao,
          stock_minimo,
          ativo
        )
      `)
      .order('criado_em', { ascending: false })

    if (error) {
      setErro(error.message)
      return
    }

    const stockPorMaterial = {}
    let totalSala1 = 0
    let totalSala2 = 0

    ;(movimentos || []).forEach((movimento) => {
      const quantidade = Number(movimento.quantidade)
      const material = movimento.materiais
      if (!material || material.ativo === false) return
      if (!material) return

      if (!stockPorMaterial[material.id]) {
        stockPorMaterial[material.id] = {
          id: material.id,
          nome: material.nome,
          unidade: material.unidade,
          descricao: material.descricao,
          stock_minimo: Number(material.stock_minimo || 0),
          quantidade: 0,
        }
      }

      if (movimento.tipo === 'entrada') {
        stockPorMaterial[material.id].quantidade += quantidade
      } else {
        stockPorMaterial[material.id].quantidade -= quantidade
      }

      if (movimento.sala_id === 1) {
        totalSala1 += movimento.tipo === 'entrada' ? quantidade : -quantidade
      }

      if (movimento.sala_id === 2) {
        totalSala2 += movimento.tipo === 'entrada' ? quantidade : -quantidade
      }
    })

    const listaStock = Object.values(stockPorMaterial)

    const materiaisCriticos = listaStock
      .filter(
        (item) =>
          item.stock_minimo > 0 &&
          item.quantidade > 0 &&
          item.quantidade <= item.stock_minimo
      )
      .sort((a, b) => a.quantidade - b.quantidade)

    const semStock = listaStock
      .filter((item) => item.quantidade <= 0)
      .sort((a, b) => a.nome.localeCompare(b.nome))

    setDados({
      materiaisCriticos,
      semStock,
      totalSala1,
      totalSala2,
    })
  }

  return (
    <div style={styles.pageContent}>
      <div style={styles.heroPanel}>
        <div>
          <p style={styles.heroEyebrow}>PAINEL DE CONTROLO</p>
          <h1 style={styles.heroTitle}>Dashboard do Armazém</h1>
          <p style={styles.heroSubtitle}>
            Consulta rápida dos materiais críticos e do stock atual por sala.
          </p>
        </div>
      </div>

      {erro && <div style={styles.alertError}>Erro: {erro}</div>}

      <div style={styles.dashboardHighlightGrid}>
        <div style={{ ...styles.highlightCard, ...styles.highlightWarning }}>
          <div>
            <p style={styles.highlightLabel}>Materiais críticos</p>
            <h3 style={styles.highlightValue}>{dados.materiaisCriticos.length}</h3>
            <p style={styles.highlightText}>Precisam de reposição em breve.</p>
          </div>
        </div>

        <div style={{ ...styles.highlightCard, ...styles.highlightDanger }}>
          <div>
            <p style={styles.highlightLabel}>Sem stock</p>
            <h3 style={styles.highlightValue}>{dados.semStock.length}</h3>
            <p style={styles.highlightText}>Materiais esgotados.</p>
          </div>
        </div>
      </div>

      <div style={styles.dashboardMainGrid}>
        <div style={styles.dashboardColumn}>
          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>Materiais críticos</h3>
            {dados.materiaisCriticos.length === 0 ? (
              <p style={styles.infoText}>Nenhum material em nível crítico.</p>
            ) : (
              <ul style={styles.materialList}>
                {dados.materiaisCriticos.map((item) => (
                  <li key={item.id} style={styles.materialItem}>
                    <strong>{item.nome}</strong> — {item.quantidade} {item.unidade} | mínimo: {item.stock_minimo}
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        <div style={styles.dashboardColumn}>
          <div style={styles.twoStatsGrid}>
            <div style={styles.miniStatCard}>
              <p style={styles.miniStatLabel}>Sala DSTI</p>
              <h3 style={styles.miniStatValue}>{dados.totalSala1}</h3>
              <p style={styles.miniStatText}>Quantidade total atual</p>
            </div>

            <div style={styles.miniStatCard}>
              <p style={styles.miniStatLabel}>Armazem</p>
              <h3 style={styles.miniStatValue}>{dados.totalSala2}</h3>
              <p style={styles.miniStatText}>Quantidade total atual</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard