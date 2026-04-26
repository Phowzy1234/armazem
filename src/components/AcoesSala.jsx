import { useState } from 'react'
import { supabase } from '../Lib/supabase'
import { styles } from '../styles/styles'
import { getAuthUserId } from '../Lib/authUser'

function AcoesSala({ salaAtualId, outraSalaId, materiaisDaSala, aoAtualizar }) {
  const [materialId, setMaterialId] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  

  async function retirarStock(e) {
    e.preventDefault()
    setErro('')
    setMensagem('')

    const utilizadorId = await getAuthUserId()

    if (!utilizadorId) {
      setErro('Seleciona um utilizador no topo da aplicação.')
      return
    }

    const quantidadeNumero = Number(quantidade)

    if (!materialId || !quantidadeNumero || quantidadeNumero <= 0) {
      setErro('Seleciona um material e uma quantidade válida.')
      return
    }

    const material = materiaisDaSala.find((item) => item.id === Number(materialId))

    if (!material) {
      setErro('Material não encontrado.')
      return
    }

    if (quantidadeNumero > material.quantidade) {
      setErro('Não existe stock suficiente para retirar essa quantidade.')
      return
    }

    const { error } = await supabase.from('movimentos_stock').insert([
      {
        utilizador_auth_id: utilizadorId,
        material_id: Number(materialId),
        sala_id: salaAtualId,
        tipo: 'saida',
        quantidade: quantidadeNumero,
      },
    ])

    if (error) {
      setErro(error.message)
      return
    }

    setMensagem('Stock retirado com sucesso.')
    setMaterialId('')
    setQuantidade('')
    await aoAtualizar()
  }

  async function transferirStock(e) {
    e.preventDefault()
    setErro('')
    setMensagem('')

    const utilizadorId = await getAuthUserId()

    if (!utilizadorId) {
      setErro('Seleciona um utilizador no topo da aplicação.')
      return
    }

    const quantidadeNumero = Number(quantidade)

    if (!materialId || !quantidadeNumero || quantidadeNumero <= 0) {
      setErro('Seleciona um material e uma quantidade válida.')
      return
    }

    const material = materiaisDaSala.find((item) => item.id === Number(materialId))

    if (!material) {
      setErro('Material não encontrado.')
      return
    }

    if (quantidadeNumero > material.quantidade) {
      setErro('Não existe stock suficiente para transferir essa quantidade.')
      return
    }

    const { error: erroSaida } = await supabase.from('movimentos_stock').insert([
      {
        utilizador_auth_id: utilizadorId,
        material_id: Number(materialId),
        sala_id: salaAtualId,
        tipo: 'saida',
        quantidade: quantidadeNumero,
      },
    ])

    if (erroSaida) {
      setErro(erroSaida.message)
      return
    }

    const { error: erroEntrada } = await supabase.from('movimentos_stock').insert([
      {
        utilizador_auth_id: utilizadorId,
        material_id: Number(materialId),
        sala_id: outraSalaId,
        tipo: 'entrada',
        quantidade: quantidadeNumero,
      },
    ])

    if (erroEntrada) {
      setErro(erroEntrada.message)
      return
    }

    setMensagem('Material transferido com sucesso.')
    setMaterialId('')
    setQuantidade('')
    await aoAtualizar()
  }

  return (
    <div style={styles.formCard}>
      <h3 style={{ marginTop: 0 }}>Ações da sala</h3>

      {erro && <div style={styles.alertError}>Erro: {erro}</div>}
      {mensagem && <div style={styles.alertSuccess}>{mensagem}</div>}

      <div style={styles.formGroup}>
        <label style={styles.label}>Material</label>
        <select
          value={materialId}
          onChange={(e) => setMaterialId(e.target.value)}
          style={styles.input}
        >
          <option value="">Seleciona um material</option>
          {materiaisDaSala.map((material) => (
            <option key={material.id} value={material.id}>
              {material.nome} ({material.quantidade} {material.unidade})
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

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button onClick={retirarStock} style={styles.primaryButton} type="button">
          Retirar stock
        </button>

        <button onClick={transferirStock} style={styles.secondaryButton} type="button">
          Transferir para a outra sala
        </button>
      </div>
    </div>
  )
}

export default AcoesSala