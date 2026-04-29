const CHAVE_UTILIZADOR = 'utilizador_atual_id'

export function getUtilizadorAtualId() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(CHAVE_UTILIZADOR) || ''
}

export function setUtilizadorAtualId(id) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CHAVE_UTILIZADOR, String(id))
}