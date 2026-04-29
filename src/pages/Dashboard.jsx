import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900)

  useEffect(() => {
    carregarDashboard()

    function handleResize() {
      setIsMobile(window.innerWidth <= 900)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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
      <section
        style={{
          ...styles.dashboardHero,
          ...(isMobile ? styles.dashboardHeroMobile : {}),
        }}
      >
        <div style={styles.dashboardHeroContent}>
          <p style={styles.dashboardHeroEyebrow}>VISÃO GERAL</p>
          <h1
            style={{
              ...styles.dashboardHeroTitle,
              ...(isMobile ? styles.dashboardHeroTitleMobile : {}),
            }}
          >
            Dashboard do armazém
          </h1>
          <p
            style={{
              ...styles.dashboardHeroText,
              ...(isMobile ? styles.dashboardHeroTextMobile : {}),
            }}
          >
            Consulta rápida dos materiais críticos, ruturas e estado atual das salas.
          </p>
        </div>

        <div
          style={{
            ...styles.dashboardHeroActions,
            ...(isMobile ? styles.dashboardHeroActionsMobile : {}),
          }}
        >
          <Link to="/adicionar" style={styles.dashboardPrimaryAction}>
            Adicionar stock
          </Link>

          <Link to="/materiais" style={styles.dashboardSecondaryAction}>
            Ver materiais
          </Link>
        </div>
      </section>

      {erro && <div style={styles.alertError}>Erro: {erro}</div>}

      <section
        style={{
          ...styles.dashboardSimpleTopGrid,
          ...(isMobile ? styles.dashboardSimpleTopGridMobile : {}),
        }}
      >
        <div style={styles.dashboardStatCardAlert}>
          <p style={styles.dashboardStatLabel}>Materiais críticos</p>
          <h3 style={styles.dashboardStatValue}>{dados.materiaisCriticos.length}</h3>
          <p style={styles.dashboardStatSub}>Precisam de atenção em breve</p>
        </div>

        <div style={styles.dashboardStatCardDanger}>
          <p style={styles.dashboardStatLabel}>Sem stock</p>
          <h3 style={styles.dashboardStatValue}>{dados.semStock.length}</h3>
          <p style={styles.dashboardStatSub}>Materiais atualmente esgotados</p>
        </div>
      </section>

      <section
        style={{
          ...styles.dashboardSimpleMainGrid,
          ...(isMobile ? styles.dashboardSimpleMainGridMobile : {}),
        }}
      >
        

        <div style={styles.dashboardSideColumn}>
          <div style={styles.dashboardPanel}>
            <div style={styles.dashboardPanelHeader}>
              <div>
                <p style={styles.dashboardPanelEyebrow}>SALAS</p>
                <h3 style={styles.dashboardPanelTitle}>Estado das salas</h3>
              </div>
            </div>

            <div style={styles.dashboardRoomGrid}>
              <div style={styles.dashboardRoomCard}>
                <p style={styles.dashboardRoomName}>Sala DSTI</p>
                <h3 style={styles.dashboardRoomValue}>{dados.totalSala1}</h3>
                <p style={styles.dashboardRoomSub}>Quantidade total atual</p>
                <Link to="/sala1" style={styles.dashboardMiniLink}>
                  Abrir sala
                </Link>
              </div>

              <div style={styles.dashboardRoomCard}>
                <p style={styles.dashboardRoomName}>Armazém</p>
                <h3 style={styles.dashboardRoomValue}>{dados.totalSala2}</h3>
                <p style={styles.dashboardRoomSub}>Quantidade total atual</p>
                <Link to="/sala2" style={styles.dashboardMiniLink}>
                  Abrir sala
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard