import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../Lib/supabase'
import { styles } from '../styles/styles'

function Materiais() {
  const [materiais, setMateriais] = useState([])
  const [pesquisa, setPesquisa] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [erro, setErro] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900)

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

  function estadoMaterial(material) {
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

  const materiaisFiltrados = useMemo(() => {
    return materiais.filter((material) => {
      const matchPesquisa =
        material.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
        (material.descricao || '').toLowerCase().includes(pesquisa.toLowerCase())

      if (!matchPesquisa) return false

      if (filtro === 'baixo') {
        return (
          Number(material.stock_minimo || 0) > 0 &&
          material.total <= Number(material.stock_minimo || 0)
        )
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
            Consulta, procura e analisa rapidamente os materiais ativos do armazém.
          </p>
        </div>
      </section>

      {erro && <div style={styles.alertError}>Erro: {erro}</div>}

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
              <option value="baixo">Stock crítico</option>
              <option value="semstock">Sem stock</option>
              <option value="sala1">Com stock na Sala DSTI</option>
              <option value="sala2">Com stock no Armazém</option>
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
                  <th style={styles.materiaisTh}>Total</th>
                  <th style={styles.materiaisTh}>Mínimo</th>
                  <th style={styles.materiaisTh}>Estado</th>
                  <th style={styles.materiaisTh}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {materiaisFiltrados.map((material) => {
                  const estado = estadoMaterial(material)

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
                        {material.total} {material.unidade}
                      </td>
                      <td style={styles.materiaisTd}>
                        {material.stock_minimo || 0}
                      </td>

                      <td style={styles.materiaisTd}>
                        <span
                          style={{
                            ...styles.materiaisEstadoBase,
                            ...estado.estilo,
                          }}
                        >
                          {estado.texto}
                        </span>
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