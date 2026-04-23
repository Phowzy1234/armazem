import { useEffect, useState } from 'react'
import { supabase } from '../Lib/supabase'
import { styles } from '../styles/styles'
import { getUtilizadorAtualId } from '../Lib/utilizadorAtual'

function AdicionarStock() {
  const [materiais, setMateriais] = useState([])
  const [salas, setSalas] = useState([])

  const [modoMaterial, setModoMaterial] = useState('novo')
  const [materialExistenteId, setMaterialExistenteId] = useState('')
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [unidade, setUnidade] = useState('')
  const [stockMinimo, setStockMinimo] = useState('')
  const [salaId, setSalaId] = useState('')
  const [quantidade, setQuantidade] = useState('')

  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    carregarMateriais()
    carregarSalas()
  }, [])

  async function carregarMateriais() {
    const { data, error } = await supabase
      .from('materiais')
      .select('*')
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

    const utilizadorId = getUtilizadorAtualId()

    if (!utilizadorId) {
      setErro('Seleciona um utilizador no topo da aplicação.')
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
          utilizador_id: Number(utilizadorId),
        },
      ])

    if (erroMovimento) {
      setErro(erroMovimento.message)
      return
    }

    setMensagem('Quantidade adicionada com sucesso.')
    setMaterialExistenteId('')
    setNome('')
    setDescricao('')
    setUnidade('')
    setStockMinimo('')
    setSalaId('')
    setQuantidade('')

    carregarMateriais()
  }

  return (
    <div style={styles.pageContent}>
      <div style={styles.sectionHeader}>
        <h1 style={styles.title}>Adicionar stock</h1>
        <p style={styles.subtitle}>
          Escolhe um material existente ou cria um novo.
        </p>
      </div>

      {erro && <div style={styles.alertError}>Erro: {erro}</div>}
      {mensagem && <div style={styles.alertSuccess}>{mensagem}</div>}

      <div style={styles.formCard}>
        <form onSubmit={adicionarMaterial}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo de material</label>
            <select
              value={modoMaterial}
              onChange={(e) => setModoMaterial(e.target.value)}
              style={styles.input}
            >
              <option value="novo">Criar material novo</option>
              <option value="existente">Usar material existente</option>
            </select>
          </div>

          {modoMaterial === 'existente' ? (
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
          ) : (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nome do material</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Descrição</label>
                <input
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.twoColumns}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Unidade</label>
                  <input
                    type="text"
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
            </>
          )}

          <div style={styles.twoColumns}>
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
              />
            </div>
          </div>

          <button type="submit" style={styles.primaryButton}>
            Guardar
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdicionarStock