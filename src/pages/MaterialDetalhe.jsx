import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../Lib/supabase'
import { styles } from '../styles/styles'
import { getAuthUserId } from '../Lib/authUser'

function MaterialDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [material, setMaterial] = useState(null)
  const [stockSala1, setStockSala1] = useState(0)
  const [stockSala2, setStockSala2] = useState(0)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900)

  const [novoEstado, setNovoEstado] = useState('Novo')

  useEffect(() => {
    carregarTudo()

    function handleResize() {
      setIsMobile(window.innerWidth <= 900)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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
    setNovoEstado(materialData.estado || 'Novo')

    const { data: movimentos, error: movimentosError } = await supabase
      .from('movimentos_stock')
      .select('tipo, quantidade, sala_id')
      .eq('material_id', id)

    if (movimentosError) {
      setErro(movimentosError.message)
      return
    }

    let totalSala1 = 0
    let totalSala2 = 0

    ;(movimentos || []).forEach((movimento) => {
      const quantidade = Number(movimento.quantidade)

      if (movimento.sala_id === 1) {
        totalSala1 += movimento.tipo === 'entrada' ? quantidade : -quantidade
      }

      if (movimento.sala_id === 2) {
        totalSala2 += movimento.tipo === 'entrada' ? quantidade : -quantidade
      }
    })

    setStockSala1(totalSala1)
    setStockSala2(totalSala2)
  }

  function estadoFisico(materialAtual) {
    if (!materialAtual || materialAtual.estado === 'Novo') {
      return { texto: 'Novo', estilo: styles.estadoNovo }
    }

    if (materialAtual.estado === 'Usado') {
      return { texto: 'Usado', estilo: styles.estadoUsado }
    }

    return { texto: 'Obsoleto', estilo: styles.estadoObsoleto }
  }

  async function alterarEstado() {
    setErro('')
    setMensagem('')

    const { error } = await supabase
      .from('materiais')
      .update({ estado: novoEstado })
      .eq('id', id)

    if (error) {
      setErro(error.message)
      return
    }

    setMensagem('Estado do material atualizado com sucesso.')
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
        material_id: Number(id),
        sala_id: 1,
        tipo: 'saida',
        quantidade: Number(stockSala1),
        utilizador_auth_id: utilizadorId,
      })
    }

    if (stockSala2 > 0) {
      movimentosParaInserir.push({
        material_id: Number(id),
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
    navigate('/materiais')
  }

  if (!material) {
    return (
      <div style={styles.pageContent}>
        {erro ? (
          <div style={styles.alertError}>Erro: {erro}</div>
        ) : (
          <div style={styles.infoBox}>
            <p style={styles.infoText}>A carregar material...</p>
          </div>
        )}
      </div>
    )
  }

  const estado = estadoFisico(material)
  const total = Number(stockSala1 || 0) + Number(stockSala2 || 0)

  return (
    <div style={styles.pageContent}>
      <section
        style={{
          ...styles.materialDetalheHero,
          ...(isMobile ? styles.materialDetalheHeroMobile : {}),
        }}
      >
        <div>
          <p style={styles.materialDetalheEyebrow}>DETALHE DO MATERIAL</p>
          <h1
            style={{
              ...styles.materialDetalheTitle,
              ...(isMobile ? styles.materialDetalheTitleMobile : {}),
            }}
          >
            {material.nome}
          </h1>
          <p style={styles.materialDetalheText}>
            {material.descricao || 'Sem descrição disponível.'}
          </p>
        </div>

        <div style={styles.materialDetalheHeroBadges}>
          <span style={styles.salaCardBadge}>{material.unidade}</span>
          <span
            style={{
              ...styles.materiaisEstadoBase,
              ...estado.estilo,
            }}
          >
            {estado.texto}
          </span>
        </div>
      </section>

      {erro && <div style={styles.alertError}>Erro: {erro}</div>}
      {mensagem && <div style={styles.alertSuccess}>{mensagem}</div>}

      <section
        style={{
          ...styles.materialDetalheStatsGrid,
          ...(isMobile ? styles.materialDetalheStatsGridMobile : {}),
        }}
      >
        <div style={styles.materialDetalheStatCard}>
          <p style={styles.materialDetalheStatLabel}>Sala DSTI</p>
          <h3 style={styles.materialDetalheStatValue}>{stockSala1}</h3>
          <p style={styles.materialDetalheStatSub}>Stock atual nesta sala</p>
        </div>

        <div style={styles.materialDetalheStatCard}>
          <p style={styles.materialDetalheStatLabel}>Armazém</p>
          <h3 style={styles.materialDetalheStatValue}>{stockSala2}</h3>
          <p style={styles.materialDetalheStatSub}>Stock atual nesta sala</p>
        </div>

        <div style={styles.materialDetalheStatCard}>
          <p style={styles.materialDetalheStatLabel}>Stock total</p>
          <h3 style={styles.materialDetalheStatValue}>
            {total} {material.unidade}
          </h3>
          <p style={styles.materialDetalheStatSub}>Quantidade global disponível</p>
        </div>
      </section>

      <section
        style={{
          ...styles.materialDetalheMainGrid,
          ...(isMobile ? styles.materialDetalheMainGridMobile : {}),
        }}
      >
        <div style={styles.materialDetalhePanel}>
          <div style={styles.materialDetalhePanelHeader}>
            <div>
              <p style={styles.materialDetalhePanelEyebrow}>INFORMAÇÃO</p>
              <h3 style={styles.materialDetalhePanelTitle}>Dados do material</h3>
            </div>
          </div>

          <div style={styles.materialDetalheInfoList}>
            <div style={styles.materialDetalheInfoItem}>
              <span style={styles.materialDetalheInfoLabel}>Nome</span>
              <span style={styles.materialDetalheInfoValue}>{material.nome}</span>
            </div>

            <div style={styles.materialDetalheInfoItem}>
              <span style={styles.materialDetalheInfoLabel}>Descrição</span>
              <span style={styles.materialDetalheInfoValue}>
                {material.descricao || 'Sem descrição'}
              </span>
            </div>

            <div style={styles.materialDetalheInfoItem}>
              <span style={styles.materialDetalheInfoLabel}>Unidade</span>
              <span style={styles.materialDetalheInfoValue}>{material.unidade}</span>
            </div>

            <div style={styles.materialDetalheInfoItem}>
              <span style={styles.materialDetalheInfoLabel}>Stock mínimo</span>
              <span style={styles.materialDetalheInfoValue}>
                {material.stock_minimo || 0}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.materialDetalhePanel}>
          <div style={styles.materialDetalhePanelHeader}>
            <div>
              <p style={styles.materialDetalhePanelEyebrow}>GESTÃO</p>
              <h3 style={styles.materialDetalhePanelTitle}>Estado e ações</h3>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Estado físico</label>
            <select
              value={novoEstado}
              onChange={(e) => setNovoEstado(e.target.value)}
              style={styles.input}
            >
              <option value="Novo">Novo</option>
              <option value="Usado">Usado</option>
              <option value="Obsoleto">Obsoleto</option>
            </select>
          </div>

          <div style={styles.materialDetalheActions}>
            <button type="button" onClick={alterarEstado} style={styles.primaryButton}>
              Guardar estado
            </button>

            <button
              type="button"
              onClick={removerDefinitivamenteDoStock}
              style={styles.dangerButton}
            >
              Remover definitivamente
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MaterialDetalhe