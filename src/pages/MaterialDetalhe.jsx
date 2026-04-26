import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../Lib/supabase'
import { styles } from '../styles/styles'
import { getAuthUserId } from '../Lib/authUser'

function MaterialDetalhe() {
  const { id } = useParams()

  const [material, setMaterial] = useState(null)
  const [movimentos, setMovimentos] = useState([])
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [unidade, setUnidade] = useState('')
  const [stockMinimo, setStockMinimo] = useState('')

  const [stockSala1, setStockSala1] = useState(0)
  const [stockSala2, setStockSala2] = useState(0)
  const [stockTotal, setStockTotal] = useState(0)

  useEffect(() => {
    carregarTudo()
  }, [id])

  async function carregarTudo() {
    setErro('')
    setMensagem('')

    const { data: materialData, error: materialError } = await supabase
      .from('materiais')
      .select('*')
      .eq('id', id)
      .single()

    if (materialError) {
      setErro(materialError.message)
      return
    }

    setMaterial(materialData)
    setNome(materialData.nome || '')
    setDescricao(materialData.descricao || '')
    setUnidade(materialData.unidade || '')
    setStockMinimo(materialData.stock_minimo || 0)

    const { data: movimentosData, error: movimentosError } = await supabase
      .from('movimentos_stock')
      .select(`
        id,
        tipo,
        quantidade,
        sala_id,
        criado_em,
        utilizadores (
          id,
          nome
        )
      `)
      .eq('material_id', id)
      .order('criado_em', { ascending: false })

    if (movimentosError) {
      setErro(movimentosError.message)
      return
    }

    setMovimentos(movimentosData || [])

    let sala1 = 0
    let sala2 = 0

    ;(movimentosData || []).forEach((movimento) => {
      const valor =
        movimento.tipo === 'entrada'
          ? Number(movimento.quantidade)
          : -Number(movimento.quantidade)

      if (movimento.sala_id === 1) sala1 += valor
      if (movimento.sala_id === 2) sala2 += valor
    })

    setStockSala1(sala1)
    setStockSala2(sala2)
    setStockTotal(sala1 + sala2)
  }

  async function guardarAlteracoes(e) {
    e.preventDefault()
    setErro('')
    setMensagem('')

    const { error } = await supabase
      .from('materiais')
      .update({
        nome,
        descricao,
        unidade,
        stock_minimo: Number(stockMinimo || 0),
      })
      .eq('id', id)

    if (error) {
      setErro(error.message)
      return
    }

    setMensagem('Material atualizado com sucesso.')
    carregarTudo()
  }

  async function removerDefinitivamenteDoStock() {
  setErro('')
  setMensagem('')

  const utilizadorId = await getAuthUserId()

  if (!utilizadorId) {
    setErro('Não foi possível identificar o utilizador autenticado.')
    return
  }

  const confirmar = window.confirm(
    'Tens a certeza que queres remover este material definitivamente do stock? O sistema vai retirar todo o stock das salas e arquivar o material.'
  )

  if (!confirmar) return

  const movimentosParaInserir = []

  if (stockSala1 > 0) {
    movimentosParaInserir.push({
      material_id: id,
      sala_id: 1,
      tipo: 'saida',
      quantidade: Number(stockSala1),
      utilizador_auth_id: utilizadorId,
    })
  }

  if (stockSala2 > 0) {
    movimentosParaInserir.push({
      material_id: id,
      sala_id: 2,
      tipo: 'saida',
      quantidade: Number(stockSala2),
      utilizador_auth_id: utilizadorId,
    })
  }

  if (movimentosParaInserir.length > 0) {
    const { error: erroMovimentos } = await supabase
      .from('movimentos_stock')
      .insert(movimentosParaInserir)

    if (erroMovimentos) {
      setErro(erroMovimentos.message)
      return
    }
  }

  const { error: erroArquivar } = await supabase
    .from('materiais')
    .update({ ativo: false })
    .eq('id', id)

  if (erroArquivar) {
    setErro(erroArquivar.message)
    return
  }

  setMensagem('Material removido definitivamente do stock com sucesso.')
  carregarTudo()
}

  if (!material) {
    return (
      <div style={styles.pageContent}>
        {erro ? <div style={styles.alertError}>Erro: {erro}</div> : <p>A carregar...</p>}
      </div>
    )
  }

  return (
    <div style={styles.pageContent}>
      <div style={styles.sectionHeader}>
        <h1 style={styles.title}>{material.nome}</h1>
        <p style={styles.subtitle}>
          Detalhe completo do material, stock e histórico.
        </p>
      </div>

      {erro && <div style={styles.alertError}>Erro: {erro}</div>}
      {mensagem && <div style={styles.alertSuccess}>{mensagem}</div>}

      <div style={styles.dashboardHighlightGrid}>
        <div style={{ ...styles.highlightCard, ...styles.highlightInfo }}>
          <p style={styles.highlightLabel}>Sala DSTI</p>
          <h3 style={styles.highlightValue}>{stockSala1}</h3>
          <p style={styles.highlightText}>{material.unidade}</p>
        </div>

        <div style={{ ...styles.highlightCard, ...styles.highlightSuccess }}>
          <p style={styles.highlightLabel}>Armazem</p>
          <h3 style={styles.highlightValue}>{stockSala2}</h3>
          <p style={styles.highlightText}>{material.unidade}</p>
        </div>

        <div style={{ ...styles.highlightCard, ...styles.highlightWarning }}>
          <p style={styles.highlightLabel}>Stock total</p>
          <h3 style={styles.highlightValue}>{stockTotal}</h3>
          <p style={styles.highlightText}>{material.unidade}</p>
        </div>

        <div style={{ ...styles.highlightCard, ...styles.highlightDanger }}>
          <p style={styles.highlightLabel}>Stock mínimo</p>
          <h3 style={styles.highlightValue}>{material.stock_minimo || 0}</h3>
          <p style={styles.highlightText}>Valor de alerta</p>
        </div>
      </div>

      <div style={styles.dashboardMainGrid}>
        <div style={styles.dashboardColumn}>
          <div style={styles.formCard}>
            <h3 style={styles.infoTitle}>Editar material</h3>

            <form onSubmit={guardarAlteracoes}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nome</label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Descrição</label>
                <input
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.twoColumns}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Unidade</label>
                  <input
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Stock mínimo</label>
                  <input
                    type="number"
                    value={stockMinimo}
                    onChange={(e) => setStockMinimo(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>

              <button type="submit" style={styles.primaryButton}>
                Guardar alterações
              </button>

              <button
                type="button"
                onClick={removerDefinitivamenteDoStock}
                style={styles.dangerButton}
              >
                Remover definitivamente do stock
              </button>
            </form>
          </div>
        </div>

        <div style={styles.dashboardColumn}>
          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>Histórico deste material</h3>

            {movimentos.length === 0 ? (
              <p style={styles.infoText}>
                Ainda não existem movimentos para este material.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Tipo</th>
                      <th style={styles.th}>Sala</th>
                      <th style={styles.th}>Quantidade</th>
                      <th style={styles.th}>Utilizador</th>
                      <th style={styles.th}>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimentos.map((movimento) => (
                      <tr key={movimento.id}>
                        <td style={styles.td}>{movimento.tipo}</td>
                        <td style={styles.td}>
                          {movimento.sala_id === 1 ? 'Sala DSTI' : 'Armazem'}
                        </td>
                        <td style={styles.td}>{movimento.quantidade}</td>
                        <td style={styles.td}>{movimento.utilizadores?.nome || '-'}</td>
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
      </div>
    </div>
  )
}

export default MaterialDetalhe