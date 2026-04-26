import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../Lib/supabase'
import { styles } from '../styles/styles'

function Navbar() {
  const location = useLocation()

  const [menuSalasAberto, setMenuSalasAberto] = useState(false)
  const [menuUserAberto, setMenuUserAberto] = useState(false)
  const [menuMobileAberto, setMenuMobileAberto] = useState(false)
  const [username, setUsername] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900)

  const dropdownSalasRef = useRef(null)
  const dropdownUserRef = useRef(null)

  const rotaSalaAtiva =
    location.pathname === '/sala1' || location.pathname === '/sala2'

  useEffect(() => {
    carregarPerfil()

    function handleClickOutside(event) {
      if (
        dropdownSalasRef.current &&
        !dropdownSalasRef.current.contains(event.target)
      ) {
        setMenuSalasAberto(false)
      }

      if (
        dropdownUserRef.current &&
        !dropdownUserRef.current.contains(event.target)
      ) {
        setMenuUserAberto(false)
      }
    }

    function handleResize() {
      const mobile = window.innerWidth <= 900
      setIsMobile(mobile)

      if (!mobile) {
        setMenuMobileAberto(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('resize', handleResize)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  async function carregarPerfil() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('perfis')
      .select('username')
      .eq('id', user.id)
      .single()

    if (!error && data) {
      setUsername(data.username)
    }
  }

  function toggleMenuSalas() {
    setMenuSalasAberto((prev) => !prev)
    setMenuUserAberto(false)
  }

  function toggleMenuUser() {
    setMenuUserAberto((prev) => !prev)
    setMenuSalasAberto(false)
  }

  function toggleMenuMobile() {
    setMenuMobileAberto((prev) => !prev)
    setMenuSalasAberto(false)
    setMenuUserAberto(false)
  }

  function fecharTudo() {
    setMenuSalasAberto(false)
    setMenuUserAberto(false)
    setMenuMobileAberto(false)
  }

  async function sair() {
    await supabase.auth.signOut()
  }

  const navLinks = (
    <>
      <Link
        to="/"
        onClick={fecharTudo}
        style={{
          ...styles.navButton,
          ...(location.pathname === '/' ? styles.navButtonActive : {}),
          ...(isMobile ? styles.navButtonMobile : {}),
        }}
      >
        Dashboard
      </Link>

      <Link
        to="/movimentos"
        onClick={fecharTudo}
        style={{
          ...styles.navButton,
          ...(location.pathname === '/movimentos' ? styles.navButtonActive : {}),
          ...(isMobile ? styles.navButtonMobile : {}),
        }}
      >
        Movimentos
      </Link>

      <Link
        to="/materiais"
        onClick={fecharTudo}
        style={{
          ...styles.navButton,
          ...(location.pathname.startsWith('/materiais')
            ? styles.navButtonActive
            : {}),
          ...(isMobile ? styles.navButtonMobile : {}),
        }}
      >
        Materiais
      </Link>

      <Link
        to="/adicionar"
        onClick={fecharTudo}
        style={{
          ...styles.navButton,
          ...(location.pathname === '/adicionar' ? styles.navButtonActive : {}),
          ...(isMobile ? styles.navButtonMobile : {}),
        }}
      >
        Adicionar stock
      </Link>

      <div ref={dropdownSalasRef} style={styles.dropdown}>
        <button
          type="button"
          onClick={toggleMenuSalas}
          style={{
            ...styles.navButton,
            ...(rotaSalaAtiva ? styles.navButtonActive : {}),
            ...styles.dropdownButton,
            ...(isMobile ? styles.navButtonMobile : {}),
          }}
        >
          Salas <span style={styles.dropdownArrow}>▾</span>
        </button>

        {menuSalasAberto && (
          <div
            style={{
              ...styles.dropdownMenu,
              ...(isMobile ? styles.dropdownMenuMobile : {}),
            }}
          >
            <Link
              to="/sala1"
              onClick={fecharTudo}
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
              onClick={fecharTudo}
              style={{
                ...styles.dropdownItem,
                ...(location.pathname === '/sala2'
                  ? styles.dropdownItemActive
                  : {}),
              }}
            >
              Armazém
            </Link>
          </div>
        )}
      </div>
    </>
  )

  return (
    <header
      style={{
        ...styles.navbar,
        ...(isMobile ? styles.navbarMobile : {}),
      }}
    >
      <div style={styles.navbarBrand}>
        <div style={styles.brandRow}>
          <div>
            <h2 style={{ ...styles.logo, ...(isMobile ? styles.logoMobile : {}) }}>
              Gestão de Armazém
            </h2>
            <p
              style={{
                ...styles.logoSub,
                ...(isMobile ? styles.logoSubMobile : {}),
              }}
            >
              Controlo interno de materiais e stock
            </p>
          </div>
        </div>
      </div>

      {isMobile ? (
        <>
          <div style={styles.navbarMobileTop}>
            <button
              type="button"
              onClick={toggleMenuMobile}
              style={styles.mobileMenuButton}
            >
              {menuMobileAberto ? '✕ Fechar' : '☰ Menu'}
            </button>
          </div>

          {menuMobileAberto && (
            <div style={styles.mobileMenuPanel}>
              <div style={styles.mobileNavButtons}>{navLinks}</div>

              <div style={styles.mobileUserBox}>
                <div ref={dropdownUserRef} style={styles.dropdown}>
                  <button
                    type="button"
                    onClick={toggleMenuUser}
                    style={{
                      ...styles.userBadge,
                      ...styles.dropdownButton,
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    {username || 'Utilizador'}{' '}
                    <span style={styles.dropdownArrow}>▾</span>
                  </button>

                  {menuUserAberto && (
                    <div
                      style={{
                        ...styles.dropdownMenu,
                        ...styles.dropdownMenuMobile,
                        marginTop: '8px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={sair}
                        style={styles.dropdownDangerButton}
                      >
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div style={styles.navbarCenter}>
            <div style={styles.navButtons}>{navLinks}</div>
          </div>

          <div style={styles.navbarRight}>
            <div ref={dropdownUserRef} style={styles.dropdown}>
              <button
                type="button"
                onClick={toggleMenuUser}
                style={{
                  ...styles.userBadge,
                  ...styles.dropdownButton,
                  cursor: 'pointer',
                }}
              >
                {username || 'Utilizador'}{' '}
                <span style={styles.dropdownArrow}>▾</span>
              </button>

              {menuUserAberto && (
                <div
                  style={{
                    ...styles.dropdownMenu,
                    right: 0,
                    left: 'auto',
                    minWidth: '170px',
                  }}
                >
                  <button
                    type="button"
                    onClick={sair}
                    style={styles.dropdownDangerButton}
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  )
}

export default Navbar