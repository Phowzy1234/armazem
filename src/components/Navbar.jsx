import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { styles } from '../styles/styles'
import SeletorUtilizador from './SeletorUtilizador'

function Navbar() {
  const location = useLocation()
  const [menuSalasAberto, setMenuSalasAberto] = useState(false)
  const dropdownRef = useRef(null)

  const rotaSalaAtiva =
    location.pathname === '/sala1' || location.pathname === '/sala2'

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuSalasAberto(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  function toggleMenuSalas() {
    setMenuSalasAberto((prev) => !prev)
  }

  function fecharMenu() {
    setMenuSalasAberto(false)
  }

  return (
    <div style={styles.navbar}>
      <div style={styles.navbarBrand}>
        <h2 style={styles.logo}>Gestão de Armazém</h2>
        <p style={styles.logoSub}>Controlo simples de materiais por sala</p>
      </div>

      <div style={styles.navbarCenter}>
        <div style={styles.navButtons}>
          <Link
            to="/"
            style={{
              ...styles.navButton,
              ...(location.pathname === '/' ? styles.navButtonActive : {}),
            }}
          >
            Dashboard
          </Link>

          <Link
            to="/movimentos"
            style={{
              ...styles.navButton,
              ...(location.pathname === '/movimentos' ? styles.navButtonActive : {}),
            }}
          >
            Movimentos
          </Link>

          <Link
            to="/materiais"
            style={{
              ...styles.navButton,
              ...(location.pathname.startsWith('/materiais') ? styles.navButtonActive : {}),
            }}
          >
            Materiais
          </Link>

          <Link
            to="/adicionar"
            style={{
              ...styles.navButton,
              ...(location.pathname === '/adicionar' ? styles.navButtonActive : {}),
            }}
          >
            Adicionar stock
          </Link>

          <div ref={dropdownRef} style={styles.dropdown}>
            <button
              type="button"
              onClick={toggleMenuSalas}
              style={{
                ...styles.navButton,
                ...(rotaSalaAtiva ? styles.navButtonActive : {}),
                ...styles.dropdownButton,
              }}
            >
              Salas <span style={styles.dropdownArrow}>▾</span>
            </button>

            {menuSalasAberto && (
              <div style={styles.dropdownMenu}>
                <Link
                  to="/sala1"
                  onClick={fecharMenu}
                  style={{
                    ...styles.dropdownItem,
                    ...(location.pathname === '/sala1'
                      ? styles.dropdownItemActive
                      : {}),
                  }}
                >
                  Sala DSTI
                </Link>

                <Link
                  to="/sala2"
                  onClick={fecharMenu}
                  style={{
                    ...styles.dropdownItem,
                    ...(location.pathname === '/sala2'
                      ? styles.dropdownItemActive
                      : {}),
                  }}
                >
                  Armazem
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.navbarRight}>
        <SeletorUtilizador />
      </div>
    </div>
  )
}

export default Navbar