import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../Lib/supabase'
import { styles } from '../styles/styles'
import { normalizarUsername, usernameParaEmail } from '../Lib/authHelpers'

function Registo() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  async function fazerRegisto(e) {
    e.preventDefault()
    setErro('')
    setMensagem('')

    const usernameLimpo = normalizarUsername(username)

    if (!usernameLimpo) {
      setErro('Preenche o username.')
      return
    }

    if (password.length < 6) {
      setErro('A palavra-passe tem de ter pelo menos 6 caracteres.')
      return
    }

    const emailGerado = usernameParaEmail(usernameLimpo)

    const { data, error } = await supabase.auth.signUp({
      email: emailGerado,
      password,
      options: {
        data: {
          username: usernameLimpo,
        },
      },
    })

    if (error) {
      if (error.message.toLowerCase().includes('user already registered')) {
        setErro('Esse username já existe.')
        return
      }

      setErro(error.message)
      return
    }

    const userId = data.user?.id

    if (!userId) {
      setErro('Não foi possível criar o utilizador.')
      return
    }

    const { error: perfilError } = await supabase
      .from('perfis')
      .insert([
        {
          id: userId,
          username: usernameLimpo,
        },
      ])

    if (perfilError) {
      setErro(perfilError.message)
      return
    }

    setMensagem('Conta criada com sucesso.')
    navigate('/')
  }

  return (
    <div style={styles.authPage}>
      <div style={styles.authCard}>
        <h1 style={styles.authTitle}>Registo</h1>
        <p style={styles.authSubtitle}>Cria uma conta para usar o sistema.</p>

        {erro && <div style={styles.alertError}>Erro: {erro}</div>}
        {mensagem && <div style={styles.alertSuccess}>{mensagem}</div>}

        <form onSubmit={fazerRegisto}>
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
            Criar conta
          </button>
        </form>

        <p style={styles.authFooterText}>
          Já tens conta?{' '}
          <Link to="/login" style={styles.authLink}>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Registo