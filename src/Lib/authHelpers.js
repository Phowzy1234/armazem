export function normalizarUsername(username) {
  return username.trim().toLowerCase().replace(/\s+/g, '')
}

export function usernameParaEmail(username) {
  return `${normalizarUsername(username)}@equipa.local`
}