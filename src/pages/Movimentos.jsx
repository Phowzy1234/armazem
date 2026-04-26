import { useEffect, useState } from 'react'
import { supabase } from '../Lib/supabase'
import { styles } from '../styles/styles'

function Movimentos() {
  const [movimentos, setMovimentos] = useState([])
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarMovimentos()
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
    if (salaId === 2) return 'Armazem'
    return 'Sala desconhecida'
  }

  function tipoBonito(tipo) {
    if (tipo === 'entrada') return 'Entrada'
    if (tipo === 'saida') return 'Saída'
    return tipo
  }

  return (
    <div style={styles.pageContent}>
      <div style={styles.sectionHeader}>
        <h1 style={styles.title}>Movimentos</h1>
        <p style={styles.subtitle}>Histórico de entradas e saídas do armazém.</p>
      </div>

      {erro && <div style={styles.alertError}>Erro: {erro}</div>}

      <div style={styles.infoBox}>
        {movimentos.length === 0 ? (
          <p style={styles.infoText}>Ainda não existem movimentos registados.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Material</th>
                  <th style={styles.th}>Tipo</th>
                  <th style={styles.th}>Sala</th>
                  <th style={styles.th}>Quantidade</th>
                  <th style={styles.th}>Unidade</th>
                  <th style={styles.th}>Utilizador</th>
                  <th style={styles.th}>Data</th>
                </tr>
              </thead>
              <tbody>
                {movimentos.map((movimento) => (
                  <tr key={movimento.id}>
                    <td style={styles.td}>{movimento.materiais?.nome || '-'}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.movimentoBadge,
                          ...(movimento.tipo === 'entrada'
                            ? styles.movimentoEntrada
                            : styles.movimentoSaida),
                        }}
                      >
                        {tipoBonito(movimento.tipo)}
                      </span>
                    </td>
                    <td style={styles.td}>{nomeSala(movimento.sala_id)}</td>
                    <td style={styles.td}>{movimento.quantidade}</td>
                    <td style={styles.td}>{movimento.materiais?.unidade || '-'}</td>
                    <td style={styles.td}>
                      {movimento.perfis?.username || '-'}
                    </td>
                    <td style={styles.td}>
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
      </div>
    </div>
  )
}

export default Movimentos