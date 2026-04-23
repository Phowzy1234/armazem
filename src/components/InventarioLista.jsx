import { styles } from '../styles/styles'

function InventarioLista({ lista, nomeSala }) {
  return (
    <div style={styles.pageContent}>
      <div style={styles.sectionHeader}>
        <h1 style={styles.title}>{nomeSala}</h1>
        <p style={styles.subtitle}>Inventário atual desta sala.</p>
      </div>

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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default InventarioLista