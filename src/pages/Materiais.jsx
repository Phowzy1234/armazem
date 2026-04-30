import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../Lib/supabase'
import { styles } from '../styles/styles'
import { getAuthUserId } from '../Lib/authUser'

function Materiais() {
  const [materiais, setMateriais] = useState([])
  const [pesquisa, setPesquisa] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900)
  const [quantidadePorMaterial, setQuantidadePorMaterial] = useState({})

  useEffect(() => {
    carregarMateriais()

    function handleResize() {
      setIsMobile(window.innerWidth <= 900)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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

  function estadoStock(material) {
    const minimo = Number(material.stock_minimo || 0)
    const total = Number(material.total || 0)

    if (total <= 0) {
      return {
        texto: 'Sem stock',
        estilo: styles.materiaisEstadoDanger,
      }
    }

    if (minimo > 0 && total <= minimo) {
      return {
        texto: 'Crítico',
        estilo: styles.materiaisEstadoWarning,
      }
    }

    return {
      texto: 'Normal',
      estilo: styles.materiaisEstadoOk,
    }
  }

  function estadoFisico(material) {
    if (material.estado === 'Usado') {
      return { texto: 'Usado', estilo: styles.estadoUsado }
    }

    if (material.estado === 'Obsoleto') {
      return { texto: 'Obsoleto', estilo: styles.estadoObsoleto }
    }

    return { texto: 'Novo', estilo: styles.estadoNovo }
  }

  function getQuantidade(materialId) {
    return quantidadePorMaterial[materialId] || '1'
  }

  function setQuantidade(materialId, valor) {
    setQuantidadePorMaterial((prev) => ({
      ...prev,
      [materialId]: valor,
    }))
  }

    function getSalaDoFiltro(material) {
    if (filtro === 'sala1') return 1
    if (filtro === 'sala2') return 2

    const sala1 = Number(material.sala1 || 0)
    const sala2 = Number(material.sala2 || 0)

    if (sala1 > 0 && sala2 <= 0) return 1
    if (sala2 > 0 && sala1 <= 0) return 2
    if (sala1 >= sala2) return 1

    return 2
  }

  function getNomeSalaDoFiltro(material) {
  const salaId = getSalaDoFiltro(material)
  return salaId === 1 ? 'Sala DSTI' : 'Armazém'
  }

  async function registarMovimento(material, tipo) {
    setErro('')
    setMensagem('')

    const utilizadorId = await getAuthUserId()

    if (!utilizadorId) {
      setErro('Não foi possível identificar o utilizador autenticado.')
      return
    }

    const salaId = getSalaDoFiltro(material)

    

    const quantidade = Number(getQuantidade(material.id))

    if (!quantidade || quantidade <= 0) {
      setErro('A quantidade tem de ser maior que zero.')
      return
    }

    if (tipo === 'saida') {
      const stockSala =
        salaId === 1 ? Number(material.sala1 || 0) : Number(material.sala2 || 0)

      if (quantidade > stockSala) {
        setErro(
          `Não podes retirar mais do que o stock existente em ${material.nome} na ${getNomeSalaDoFiltro(material)}.`
        )
        return
      }
    }

    const { error } = await supabase
      .from('movimentos_stock')
      .insert([
        {
          material_id: Number(material.id),
          sala_id: salaId,
          tipo,
          quantidade,
          utilizador_auth_id: utilizadorId,
        },
      ])

    if (error) {
      setErro(error.message)
      return
    }

    setMensagem(
      tipo === 'entrada'
        ? `Adicionado stock a ${material.nome} na ${getNomeSalaDoFiltro(material)}.`
        : `Retirado stock de ${material.nome} na ${getNomeSalaDoFiltro(material)}.`
    )

    await carregarMateriais()
  }

  const materiaisFiltrados = useMemo(() => {
    return materiais.filter((material) => {
      const matchPesquisa =
        material.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
        (material.descricao || '').toLowerCase().includes(pesquisa.toLowerCase())

      if (!matchPesquisa) return false

      if (filtro === 'sala1') return material.sala1 > 0
      if (filtro === 'sala2') return material.sala2 > 0

      return true
    })
  }, [materiais, pesquisa, filtro])

  return (
    <div style={styles.pageContent}>
      <section
        style={{
          ...styles.materiaisHero,
          ...(isMobile ? styles.materiaisHeroMobile : {}),
        }}
      >
        <div>
          <p style={styles.materiaisHeroEyebrow}>CATÁLOGO</p>
          <h1
            style={{
              ...styles.materiaisHeroTitle,
              ...(isMobile ? styles.materiaisHeroTitleMobile : {}),
            }}
          >
            Materiais
          </h1>
          <p
            style={{
              ...styles.materiaisHeroText,
              ...(isMobile ? styles.materiaisHeroTextMobile : {}),
            }}
          >
            Consulta e ajusta rapidamente os materiais do armazém.
          </p>
        </div>
      </section>

      {erro && <div style={styles.alertError}>Erro: {erro}</div>}
      {mensagem && <div style={styles.alertSuccess}>{mensagem}</div>}

      <section style={styles.materiaisFiltrosPanel}>
        <div
          style={{
            ...styles.materiaisFiltrosGrid,
            ...(isMobile ? styles.materiaisFiltrosGridMobile : {}),
          }}
        >
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
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              style={styles.input}
            >
              <option value="todos">Todos</option>
              <option value="sala1">Sala DSTI</option>
              <option value="sala2">Armazém</option>
            </select>
          </div>
        </div>
      </section>

      <section style={styles.materiaisPanel}>
        <div style={styles.materiaisPanelHeader}>
          <div>
            <p style={styles.materiaisPanelEyebrow}>LISTAGEM</p>
            <h3 style={styles.materiaisPanelTitle}>Materiais ativos</h3>
          </div>

          <span style={styles.dashboardCountBadge}>
            {materiaisFiltrados.length}
          </span>
        </div>

        {filtro === 'todos' && (
          <div style={styles.materiaisFiltroInfo}>
            Escolhe <strong>Sala DSTI</strong> ou <strong>Armazém</strong> no filtro
            para usar os botões de movimento rápido.
          </div>
        )}

        {materiaisFiltrados.length === 0 ? (
          <p style={styles.dashboardEmptyText}>Não foram encontrados materiais.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.materiaisTable}>
              <thead>
                <tr>
                  <th style={styles.materiaisTh}>Material</th>
                  <th style={styles.materiaisTh}>Sala DSTI</th>
                  <th style={styles.materiaisTh}>Armazém</th>
                  <th style={styles.materiaisTh}>Estado stock</th>
                  <th style={styles.materiaisTh}>Estado físico</th>
                  <th style={styles.materiaisTh}>Movimento rápido</th>
                  <th style={styles.materiaisTh}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {materiaisFiltrados.map((material) => {
                  const stock = estadoStock(material)
                  const fisico = estadoFisico(material)

                  return (
                    <tr key={material.id}>
                      <td style={styles.materiaisTdMain}>
                        <div>
                          <p style={styles.materiaisNome}>{material.nome}</p>
                          <p style={styles.materiaisDescricao}>
                            {material.descricao || 'Sem descrição'}
                          </p>
                        </div>
                      </td>

                      <td style={styles.materiaisTd}>{material.sala1}</td>
                      <td style={styles.materiaisTd}>{material.sala2}</td>

                      <td style={styles.materiaisTd}>
                        <span
                          style={{
                            ...styles.materiaisEstadoBase,
                            ...stock.estilo,
                          }}
                        >
                          {stock.texto}
                        </span>
                      </td>

                      <td style={styles.materiaisTd}>
                        <span
                          style={{
                            ...styles.materiaisEstadoBase,
                            ...fisico.estilo,
                          }}
                        >
                          {fisico.texto}
                        </span>
                      </td>

                      <td style={styles.materiaisTd}>
                        <div style={styles.materiaisQuickWrap}>
                          <input
                            type="number"
                            min="1"
                            value={getQuantidade(material.id)}
                            onChange={(e) =>
                              setQuantidade(material.id, e.target.value)
                            }
                            style={styles.materiaisQuickInput}
                          />

                          <button
                            type="button"
                            onClick={() => registarMovimento(material, 'saida')}
                            style={styles.materiaisQuickMinus}
                          >
                            −
                          </button>

                          <button
                            type="button"
                            onClick={() => registarMovimento(material, 'entrada')}
                            style={styles.materiaisQuickPlus}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td style={styles.materiaisTd}>
                        <Link
                          to={`/materiais/${material.id}`}
                          style={styles.secondaryButtonLink}
                        >
                          Ver detalhe
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default Materiais