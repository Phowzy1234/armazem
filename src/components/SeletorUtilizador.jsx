import { useEffect, useState } from 'react'
import { supabase } from '../Lib/supabase'
import { getUtilizadorAtualId, setUtilizadorAtualId } from '../Lib/utilizadorAtual'

function SeletorUtilizador() {
  const [utilizadores, setUtilizadores] = useState([])
  const [utilizadorId, setUtilizadorId] = useState('')

  useEffect(() => {
    carregarUtilizadores()
  }, [])

  async function carregarUtilizadores() {
    const { data, error } = await supabase
      .from('utilizadores')
      .select('*')
      .order('nome', { ascending: true })

    if (error) {
      console.error(error.message)
      return
    }

    const lista = data || []
    setUtilizadores(lista)

    const guardado = getUtilizadorAtualId()

    if (guardado) {
      setUtilizadorId(guardado)
    } else if (lista.length > 0) {
      setUtilizadorId(String(lista[0].id))
      setUtilizadorAtualId(lista[0].id)
    }
  }

  function mudarUtilizador(e) {
    const novoId = e.target.value
    setUtilizadorId(novoId)
    setUtilizadorAtualId(novoId)
  }

  return (
    <select
      value={utilizadorId}
      onChange={mudarUtilizador}
      style={{
        padding: '10px 14px',
        borderRadius: '14px',
        border: '1px solid #cbd5e1',
        backgroundColor: '#ffffff',
        fontWeight: '600',
      }}
    >
      <option value="">Selecionar utilizador</option>
      {utilizadores.map((utilizador) => (
        <option key={utilizador.id} value={utilizador.id}>
          {utilizador.nome}
        </option>
      ))}
    </select>
  )
}

export default SeletorUtilizador