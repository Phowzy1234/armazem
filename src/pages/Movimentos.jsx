import { useEffect, useState } from 'react'
import { supabase } from '../Lib/supabase'
import { styles } from '../styles/styles'

function Movimentos() {
  const [movimentos, setMovimentos] = useState([])
  const [erro, setErro] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900)

  useEffect(() => {
    carregarMovimentos()

    function handleResize() {
      setIsMobile(window.innerWidth <= 900)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  async function carregarMovimentos() {
    setErro('')

    const { data, error } = await supabase
      .from('movimentos_stock')
      .select(`
        id,
        tipo,
        quantidade,
        sala_id,
        criado_em,
        materiais (
          id,
          nome,
          unidade
        ),
        perfis!movimentos_stock_utilizador_auth_id_fkey (
          id,
          username
        )
      `)
      .order('criado_em', { ascending: false })

    if (error) {
      setErro(error.message)
      return
    }

    setMovimentos(data || [])
  }

  function nomeSala(salaId) {
    if (salaId === 1) return 'Sala DSTI'
    if (salaId === 2) return 'Armazém'
    return 'Sala desconhecida'
  }

  function tipoBonito(tipo) {
    if (tipo === 'entrada') return 'Entrada'
    if (tipo === 'saida') return 'Saída'
    return tipo
  }

  const totalMovimentos = movimentos.length
  const totalEntradas = movimentos.filter((m) => m.tipo === 'entrada').length
  const totalSaidas = movimentos.filter((m) => m.tipo === 'saida').length

  return (
    <div style={styles.pageContent}>
      <section
        style={{
          ...styles.movimentosHero,
          ...(isMobile ? styles.movimentosHeroMobile : {}),
        }}
      >
        <div>
          <p style={styles.movimentosHeroEyebrow}>HISTÓRICO</p>
          <h1
            style={{
              ...styles.movimentosHeroTitle,
              ...(isMobile ? styles.movimentosHeroTitleMobile : {}),
            }}
          >
            Movimentos de stock
          </h1>
          <p
            style={{
              ...styles.movimentosHeroText,
              ...(isMobile ? styles.movimentosHeroTextMobile : {}),
            }}
          >
            Consulta todas as entradas e saídas registadas no sistema.
          </p>
        </div>
      </section>

      {erro && <div style={styles.alertError}>Erro: {erro}</div>}

      <section
        style={{
          ...styles.movimentosStatsGrid,
          ...(isMobile ? styles.movimentosStatsGridMobile : {}),
        }}
      >
        <div style={styles.movimentosStatCard}>
          <p style={styles.movimentosStatLabel}>Total de movimentos</p>
          <h3 style={styles.movimentosStatValue}>{totalMovimentos}</h3>
          <p style={styles.movimentosStatSub}>Registos no histórico</p>
        </div>

        <div style={styles.movimentosStatCardSuccess}>
          <p style={styles.movimentosStatLabel}>Entradas</p>
          <h3 style={styles.movimentosStatValue}>{totalEntradas}</h3>
          <p style={styles.movimentosStatSub}>Movimentos de reposição</p>
        </div>

        <div style={styles.movimentosStatCardDanger}>
          <p style={styles.movimentosStatLabel}>Saídas</p>
          <h3 style={styles.movimentosStatValue}>{totalSaidas}</h3>
          <p style={styles.movimentosStatSub}>Movimentos de retirada</p>
        </div>
      </section>

      <section style={styles.movimentosPanel}>
        <div style={styles.movimentosPanelHeader}>
          <div>
            <p style={styles.movimentosPanelEyebrow}>TABELA</p>
            <h3 style={styles.movimentosPanelTitle}>Histórico detalhado</h3>
          </div>

          <span style={styles.dashboardCountBadge}>{totalMovimentos}</span>
        </div>

        {movimentos.length === 0 ? (
          <p style={styles.dashboardEmptyText}>Ainda não existem movimentos registados.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.movimentosTable}>
              <thead>
                <tr>
                  <th style={styles.movimentosTh}>Material</th>
                  <th style={styles.movimentosTh}>Tipo</th>
                  <th style={styles.movimentosTh}>Sala</th>
                  <th style={styles.movimentosTh}>Quantidade</th>
                  <th style={styles.movimentosTh}>Unidade</th>
                  <th style={styles.movimentosTh}>Utilizador</th>
                  <th style={styles.movimentosTh}>Data</th>
                </tr>
              </thead>

              <tbody>
                {movimentos.map((movimento) => (
                  <tr key={movimento.id}>
                    <td style={styles.movimentosTdStrong}>
                      {movimento.materiais?.nome || '-'}
                    </td>

                    <td style={styles.movimentosTd}>
                      <span
                        style={{
                          ...styles.movimentosBadge,
                          ...(movimento.tipo === 'entrada'
                            ? styles.movimentosBadgeEntrada
                            : styles.movimentosBadgeSaida),
                        }}
                      >
                        {tipoBonito(movimento.tipo)}
                      </span>
                    </td>

                    <td style={styles.movimentosTd}>{nomeSala(movimento.sala_id)}</td>
                    <td style={styles.movimentosTd}>{movimento.quantidade}</td>
                    <td style={styles.movimentosTd}>
                      {movimento.materiais?.unidade || '-'}
                    </td>
                    <td style={styles.movimentosTd}>
                      {movimento.perfis?.username || '-'}
                    </td>
                    <td style={styles.movimentosTd}>
                      {movimento.criado_em
                        ? new Date(movimento.criado_em).toLocaleString('pt-PT')
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default Movimentos