import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../Lib/supabase'
import { styles } from '../styles/styles'
import { usernameParaEmail, normalizarUsername } from '../Lib/authHelpers'

function Login() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  async function fazerLogin(e) {
    e.preventDefault()
    setErro('')
    setMensagem('')

    const usernameLimpo = normalizarUsername(username)

    if (!usernameLimpo) {
      setErro('Preenche o username.')
      return
    }

    const emailGerado = usernameParaEmail(usernameLimpo)

    const { error } = await supabase.auth.signInWithPassword({
      email: emailGerado,
      password,
    })

    if (error) {
      setErro('Username ou palavra-passe inválidos.')
      return
    }

    setMensagem('Login feito com sucesso.')
    navigate('/')
  }

  return (
    <div style={styles.authPage}>
      <div style={styles.authCard}>
        <h1 style={styles.authTitle}>Entrar</h1>
        <p style={styles.authSubtitle}>Acede à gestão de armazém.</p>

        {erro && <div style={styles.alertError}>Erro: {erro}</div>}
        {mensagem && <div style={styles.alertSuccess}>{mensagem}</div>}

        <form onSubmit={fazerLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="Ex: rodrigo"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Palavra-passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.primaryButton}>
            Entrar
          </button>
        </form>

        <p style={styles.authFooterText}>
          Ainda não tens conta?{' '}
          <Link to="/registo" style={styles.authLink}>
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login