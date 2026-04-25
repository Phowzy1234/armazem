import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../Lib/supabase'
import { getUtilizadorAtualId } from '../Lib/utilizadorAtual'
import { styles } from '../styles/styles'

function InventarioLista({ lista, nomeSala, salaId, onAtualizar }) {
  const [quantidades, setQuantidades] = useState({})
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  function getQuantidade(materialId) {
    return quantidades[materialId] || '1'
  }

  function setQuantidade(materialId, valor) {
    setQuantidades((prev) => ({
      ...prev,
      [materialId]: valor,
    }))
  }

  async function moverStock(material, tipo) {
    setErro('')
    setMensagem('')

    const utilizadorId = getUtilizadorAtualId()

    if (!utilizadorId) {
      setErro('Seleciona um utilizador no topo da aplicação.')
      return
    }

    const quantidadeNumero = Number(getQuantidade(material.id))

    if (!quantidadeNumero || quantidadeNumero <= 0) {
      setErro('A quantidade tem de ser maior que zero.')
      return
    }

    if (tipo === 'saida' && quantidadeNumero > Number(material.quantidade)) {
      setErro(`Não podes retirar mais do que ${material.quantidade} ${material.unidade}.`)
      return
    }

    const { error } = await supabase.from('movimentos_stock').insert([
      {
        material_id: Number(material.id),
        sala_id: Number(salaId),
        tipo,
        quantidade: quantidadeNumero,
        utilizador_id: Number(utilizadorId),
      },
    ])

    if (error) {
      setErro(error.message)
      return
    }

    setMensagem(
      tipo === 'entrada'
        ? `Adicionados ${quantidadeNumero} ${material.unidade} a ${material.nome}.`
        : `Retirados ${quantidadeNumero} ${material.unidade} de ${material.nome}.`
    )

    if (onAtualizar) {
      await onAtualizar()
    }
  }

  return (
    <div style={styles.pageContent}>
      <div style={styles.sectionHeader}>
        <h1 style={styles.title}>{nomeSala}</h1>
        <p style={styles.subtitle}>Inventário atual desta sala.</p>
      </div>

      {erro && <div style={styles.alertError}>Erro: {erro}</div>}
      {mensagem && <div style={styles.alertSuccess}>{mensagem}</div>}

      {lista.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyText}>Não existem materiais nesta sala.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {lista.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.cardTop}>
                <h3 style={styles.cardTitle}>{item.nome}</h3>
                <span style={styles.badge}>{item.unidade}</span>
              </div>

              <p style={styles.stockValue}>
                {item.quantidade} <span style={styles.stockUnit}>{item.unidade}</span>
              </p>

              {item.descricao ? (
                <p style={styles.cardDescription}>{item.descricao}</p>
              ) : (
                <p style={styles.cardDescriptionMuted}>Sem descrição.</p>
              )}

              <div style={styles.quickActionBox}>
                <label style={styles.quickActionLabel}>Quantidade</label>

                <div style={styles.quickActionRow}>
                  <input
                    type="number"
                    min="1"
                    value={getQuantidade(item.id)}
                    onChange={(e) => setQuantidade(item.id, e.target.value)}
                    style={styles.quickQuantityInput}
                  />

                  <button
                    type="button"
                    onClick={() => moverStock(item, 'saida')}
                    style={styles.minusButton}
                    title="Retirar stock"
                  >
                    −
                  </button>

                  <button
                    type="button"
                    onClick={() => moverStock(item, 'entrada')}
                    style={styles.plusButton}
                    title="Adicionar stock"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={styles.addNewMaterialBox}>
        <p style={styles.addNewMaterialText}>
          Adiciona materias novos
        </p>

        <Link to="/adicionar" style={styles.primaryButtonLink}>
          Adicionar material novo
        </Link>
      </div>
    </div>
  )
}

export default InventarioLista