import { useEffect, useState } from 'react'
import { supabase } from '../Lib/supabase'
import { styles } from '../styles/styles'
import { getAuthUserId } from '../Lib/authUser'

function AdicionarStock() {
  const [materiais, setMateriais] = useState([])
  const [salas, setSalas] = useState([])

  const [modoMaterial, setModoMaterial] = useState('novo')
  const [materialExistenteId, setMaterialExistenteId] = useState('')
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [unidade, setUnidade] = useState('')
  const [stockMinimo, setStockMinimo] = useState('')
  const [estado, setEstado] = useState('Novo')
  const [salaId, setSalaId] = useState('')
  const [quantidade, setQuantidade] = useState('')

  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900)

  useEffect(() => {
    carregarMateriais()
    carregarSalas()

    function handleResize() {
      setIsMobile(window.innerWidth <= 900)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  async function carregarMateriais() {
    const { data, error } = await supabase
      .from('materiais')
      .select('*')
      .eq('ativo', true)
      .order('nome', { ascending: true })

    if (error) {
      setErro(error.message)
    } else {
      setMateriais(data || [])
    }
  }

  async function carregarSalas() {
    const { data, error } = await supabase
      .from('salas')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      setErro(error.message)
    } else {
      setSalas(data || [])
    }
  }

  async function adicionarMaterial(e) {
    e.preventDefault()
    setErro('')
    setMensagem('')

    const utilizadorId = await getAuthUserId()

    if (!utilizadorId) {
      setErro('Não foi possível identificar o utilizador autenticado.')
      return
    }

    if (!salaId || !quantidade) {
      setErro('Escolhe a sala e a quantidade.')
      return
    }

    const quantidadeNumero = Number(quantidade)

    if (quantidadeNumero <= 0) {
      setErro('A quantidade tem de ser maior que zero.')
      return
    }

    let materialIdFinal = null

    if (modoMaterial === 'novo') {
      if (!nome || !unidade) {
        setErro('Preenche o nome e a unidade do material novo.')
        return
      }

      const { data: materialCriado, error: erroMaterial } = await supabase
        .from('materiais')
        .insert([
          {
            nome,
            descricao,
            unidade,
            stock_minimo: Number(stockMinimo || 0),
            estado,
          },
        ])
        .select()
        .single()

      if (erroMaterial) {
        setErro(erroMaterial.message)
        return
      }

      materialIdFinal = materialCriado.id
    } else {
      if (!materialExistenteId) {
        setErro('Seleciona um material existente.')
        return
      }

      materialIdFinal = Number(materialExistenteId)
    }

    const { error: erroMovimento } = await supabase
      .from('movimentos_stock')
      .insert([
        {
          material_id: materialIdFinal,
          sala_id: Number(salaId),
          tipo: 'entrada',
          quantidade: quantidadeNumero,
          utilizador_auth_id: utilizadorId,
        },
      ])

    if (erroMovimento) {
      setErro(erroMovimento.message)
      return
    }

    setMensagem('Stock adicionado com sucesso.')
    setMaterialExistenteId('')
    setNome('')
    setDescricao('')
    setUnidade('')
    setStockMinimo('')
    setEstado('Novo')
    setSalaId('')
    setQuantidade('')

    carregarMateriais()
  }

  return (
    <div style={styles.pageContent}>
      <section
        style={{
          ...styles.adicionarHero,
          ...(isMobile ? styles.adicionarHeroMobile : {}),
        }}
      >
        <div>
          <p style={styles.adicionarHeroEyebrow}>ENTRADA DE STOCK</p>
          <h1
            style={{
              ...styles.adicionarHeroTitle,
              ...(isMobile ? styles.adicionarHeroTitleMobile : {}),
            }}
          >
            Adicionar stock
          </h1>
          <p
            style={{
              ...styles.adicionarHeroText,
              ...(isMobile ? styles.adicionarHeroTextMobile : {}),
            }}
          >
            Escolhe um material existente ou cria um novo e regista a entrada
            diretamente na sala pretendida.
          </p>
        </div>
      </section>

      {erro && <div style={styles.alertError}>Erro: {erro}</div>}
      {mensagem && <div style={styles.alertSuccess}>{mensagem}</div>}

      <section style={styles.adicionarPanel}>
        <div style={styles.adicionarPanelHeader}>
          <div>
            <p style={styles.adicionarPanelEyebrow}>FORMULÁRIO</p>
            <h3 style={styles.adicionarPanelTitle}>Registo de entrada</h3>
          </div>
        </div>

        <form onSubmit={adicionarMaterial}>
          <div style={styles.adicionarModoWrap}>
            <label style={styles.label}>Tipo de registo</label>

            <div
              style={{
                ...styles.adicionarModoGrid,
                ...(isMobile ? styles.adicionarModoGridMobile : {}),
              }}
            >
              <button
                type="button"
                onClick={() => setModoMaterial('novo')}
                style={{
                  ...styles.adicionarModoButton,
                  ...(modoMaterial === 'novo'
                    ? styles.adicionarModoButtonActive
                    : {}),
                }}
              >
                Criar material novo
              </button>

              <button
                type="button"
                onClick={() => setModoMaterial('existente')}
                style={{
                  ...styles.adicionarModoButton,
                  ...(modoMaterial === 'existente'
                    ? styles.adicionarModoButtonActive
                    : {}),
                }}
              >
                Usar material existente
              </button>
            </div>
          </div>

          {modoMaterial === 'existente' ? (
            <div style={styles.adicionarSection}>
              <p style={styles.adicionarSectionTitle}>Selecionar material</p>

              <div style={styles.formGroup}>
                <label style={styles.label}>Material existente</label>
                <select
                  value={materialExistenteId}
                  onChange={(e) => setMaterialExistenteId(e.target.value)}
                  style={styles.input}
                >
                  <option value="">Seleciona um material</option>
                  {materiais.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.nome} ({material.unidade})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div style={styles.adicionarSection}>
              <p style={styles.adicionarSectionTitle}>Criar material</p>

              <div style={styles.formGroup}>
                <label style={styles.label}>Nome do material</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  style={styles.input}
                  placeholder="Ex: Cabos HDMI"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Descrição</label>
                <input
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  style={styles.input}
                  placeholder="Ex: Cabo HDMI de 2 metros"
                />
              </div>

              <div
                style={{
                  ...styles.twoColumns,
                  ...(isMobile ? styles.adicionarTwoColumnsMobile : {}),
                }}
              >
                <div style={styles.formGroup}>
                  <label style={styles.label}>Unidade</label>
                  <input
                    type="text"
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value)}
                    style={styles.input}
                    placeholder="Ex: unidades"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Stock mínimo</label>
                  <input
                    type="number"
                    value={stockMinimo}
                    onChange={(e) => setStockMinimo(e.target.value)}
                    style={styles.input}
                    placeholder="Ex: 5"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Estado</label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  style={styles.input}
                >
                  <option value="Novo">Novo</option>
                  <option value="Usado">Usado</option>
                  <option value="Obsoleto">Obsoleto/Avariado</option>
                </select>
              </div>
            </div>
          )}

          <div style={styles.adicionarSection}>
            <p style={styles.adicionarSectionTitle}>Entrada na sala</p>

            <div
              style={{
                ...styles.twoColumns,
                ...(isMobile ? styles.adicionarTwoColumnsMobile : {}),
              }}
            >
              <div style={styles.formGroup}>
                <label style={styles.label}>Sala</label>
                <select
                  value={salaId}
                  onChange={(e) => setSalaId(e.target.value)}
                  style={styles.input}
                >
                  <option value="">Seleciona uma sala</option>
                  {salas.map((sala) => (
                    <option key={sala.id} value={sala.id}>
                      {sala.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Quantidade</label>
                <input
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  style={styles.input}
                  placeholder="Ex: 10"
                />
              </div>
            </div>
          </div>

          <div style={styles.adicionarActions}>
            <button type="submit" style={styles.primaryButton}>
              Guardar entrada
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AdicionarStock