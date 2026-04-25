import { useEffect, useState } from 'react'
import { supabase } from '../Lib/supabase'
import InventarioLista from '../components/InventarioLista'

function Sala2() {
  const [inventario, setInventario] = useState([])

  useEffect(() => {
    carregarInventario()
  }, [])

  async function carregarInventario() {
    const { data, error } = await supabase
      .from('movimentos_stock')
      .select(`
        id,
        tipo,
        quantidade,
        material_id,
        materiais (
          id,
          nome,
          descricao,
          unidade
        )
      `)
      .eq('sala_id', 2)

    if (error) {
      console.error(error.message)
      return
    }

    const agrupado = {}

    ;(data || []).forEach((movimento) => {
      const material = movimento.materiais
      if (!material) return

      if (!agrupado[material.id]) {
        agrupado[material.id] = {
          id: material.id,
          nome: material.nome,
          descricao: material.descricao,
          unidade: material.unidade,
          quantidade: 0,
        }
      }

      if (movimento.tipo === 'entrada') {
        agrupado[material.id].quantidade += Number(movimento.quantidade)
      }

      if (movimento.tipo === 'saida') {
        agrupado[material.id].quantidade -= Number(movimento.quantidade)
      }
    })

    setInventario(Object.values(agrupado).filter((item) => item.quantidade > 0))
  }

  return (
    <InventarioLista
      lista={inventario}
      nomeSala="Inventário do Armazem"
      salaId={2}
      onAtualizar={carregarInventario}
    />
  )
}

export default Sala2