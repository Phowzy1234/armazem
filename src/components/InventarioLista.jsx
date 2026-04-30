import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../Lib/supabase'
import { getAuthUserId } from '../Lib/authUser'
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

    const utilizadorId = await getAuthUserId()

    if (!utilizadorId) {
      setErro('Não foi possível identificar o utilizador autenticado.')
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
        utilizador_auth_id: utilizadorId,
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

  function estadoFisico(item) {
    if (item.estado === 'Usado') {
      return { texto: 'Usado', estilo: styles.estadoUsado }
    }

    if (item.estado === 'Obsoleto') {
      return { texto: 'Obsoleto', estilo: styles.estadoObsoleto }
    }

    return { texto: 'Novo', estilo: styles.estadoNovo }
  }

  return (
    <div style={styles.pageContent}>
      <section style={styles.salaHero}>
        <div>
          <p style={styles.salaHeroEyebrow}>INVENTÁRIO</p>
          <h1 style={styles.salaHeroTitle}>{nomeSala}</h1>
          <p style={styles.salaHeroText}>
            Consulta o stock atual desta sala e faz ajustes rápidos sem sair da página.
          </p>
        </div>

        <div style={styles.salaHeroActions}>
          <Link to="/adicionar" style={styles.dashboardPrimaryAction}>
            Adicionar stock
          </Link>
        </div>
      </section>

      {erro && <div style={styles.alertError}>Erro: {erro}</div>}
      {mensagem && <div style={styles.alertSuccess}>{mensagem}</div>}

      {lista.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyText}>Não existem materiais nesta sala.</p>
        </div>
      ) : (
        <div style={styles.salaGrid}>
          {lista.map((item) => {
            const fisico = estadoFisico(item)

            return (
              <div key={item.id} style={styles.salaCard}>
                <div style={styles.salaCardTop}>
                  <div>
                    <h3 style={styles.salaCardTitle}>{item.nome}</h3>
                    <p style={styles.salaCardSub}>
                      {item.descricao || 'Sem descrição'}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      alignItems: 'flex-end',
                    }}
                  >
                    <span style={styles.salaCardBadge}>{item.unidade}</span>

                    <span
                      style={{
                        ...styles.materiaisEstadoBase,
                        ...fisico.estilo,
                      }}
                    >
                      {fisico.texto}
                    </span>
                  </div>
                </div>

                <div style={styles.salaStockBox}>
                  <p style={styles.salaStockLabel}>Stock atual</p>
                  <h2 style={styles.salaStockValue}>
                    {item.quantidade}{' '}
                    <span style={styles.salaStockUnit}>{item.unidade}</span>
                  </h2>
                </div>

                <div style={styles.salaActionSection}>
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
            )
          })}
        </div>
      )}

      <div style={styles.addNewMaterialBox}>
        <p style={styles.addNewMaterialText}>
          Não encontras o material que precisas nesta sala?
        </p>

        <Link to="/adicionar" style={styles.primaryButtonLink}>
          Adicionar material novo
        </Link>
      </div>
    </div>
  )
}

export default InventarioLista