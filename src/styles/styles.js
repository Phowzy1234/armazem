export const styles = {
  app: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at top left, rgba(59,130,246,0.20), transparent 24%),
      radial-gradient(circle at top right, rgba(16,185,129,0.10), transparent 20%),
      linear-gradient(180deg, #f8fbff 0%, #eef4ff 45%, #f7f9fc 100%)
    `,
    color: '#0f172a',
    fontFamily: 'Inter, Arial, sans-serif',
  },

  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    display: 'grid',
    gridTemplateColumns: '1.1fr auto auto',
    alignItems: 'center',
    gap: '22px',
    padding: '16px 24px',
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(248,250,252,0.86) 100%)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    borderBottom: '1px solid rgba(148,163,184,0.10)',
    boxShadow: '0 14px 34px rgba(15,23,42,0.05)',
  },

  navbarMobile: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '14px 16px 12px 16px',
  },

  mobileHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },

  navbarBrand: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  navbarCenter: {
    display: 'flex',
    justifyContent: 'center',
  },

  navbarRight: {
    display: 'flex',
    justifyContent: 'flex-end',
  },

  logo: {
    margin: 0,
    fontSize: '31px',
    fontWeight: '900',
    letterSpacing: '-1.1px',
    color: '#0f172a',
    lineHeight: 1.02,
  },

  logoSub: {
    margin: '6px 0 0 0',
    color: '#64748b',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.1px',
  },

  logoMobile: {
    fontSize: '22px',
    lineHeight: 1.05,
  },

  logoSubMobile: {
    fontSize: '12px',
    lineHeight: 1.35,
  },

  navButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },

  navButton: {
    padding: '11px 16px',
    borderRadius: '16px',
    border: '1px solid rgba(59,130,246,0.08)',
    background: 'rgba(255,255,255,0.86)',
    cursor: 'pointer',
    fontWeight: '800',
    textDecoration: 'none',
    color: '#1d4ed8',
    boxShadow: '0 6px 14px rgba(37,99,235,0.05)',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
    fontSize: '15px',
  },

  navButtonActive: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: '#ffffff',
    border: '1px solid #2563eb',
    boxShadow: '0 14px 28px rgba(37,99,235,0.24)',
  },

  navButtonMobile: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '13px 14px',
    borderRadius: '14px',
  },

  dropdown: {
    position: 'relative',
    display: 'inline-block',
  },

  dropdownButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  dropdownArrow: {
    fontSize: '12px',
    lineHeight: 1,
  },

  dropdownMenu: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    left: 0,
    minWidth: '190px',
    backgroundColor: 'rgba(255,255,255,0.98)',
    border: '1px solid rgba(226,232,240,0.95)',
    borderRadius: '18px',
    boxShadow: '0 18px 40px rgba(15,23,42,0.12)',
    padding: '10px',
    zIndex: 60,
  },

  dropdownMenuMobile: {
    position: 'static',
    minWidth: '100%',
    boxShadow: '0 12px 24px rgba(15,23,42,0.08)',
  },

  dropdownItem: {
    display: 'block',
    padding: '12px 14px',
    borderRadius: '12px',
    textDecoration: 'none',
    color: '#1e293b',
    fontWeight: '700',
    marginBottom: '6px',
  },

  dropdownItemActive: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
  },

  userBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '11px 16px',
    borderRadius: '16px',
    background: 'linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)',
    color: '#1d4ed8',
    fontWeight: '900',
    border: '1px solid #bfdbfe',
    boxShadow: '0 8px 20px rgba(59,130,246,0.10)',
    fontSize: '15px',
  },

  mobileUserButton: {
    width: '100%',
    justifyContent: 'space-between',
  },

  dropdownDangerButton: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#ffffff',
    fontWeight: '800',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(239,68,68,0.18)',
  },

  mobileMenuButton: {
    border: '1px solid rgba(59,130,246,0.14)',
    background: '#ffffff',
    color: '#1d4ed8',
    padding: '10px 14px',
    borderRadius: '14px',
    fontWeight: '800',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 8px 18px rgba(37,99,235,0.08)',
    flexShrink: 0,
  },

  mobileMenuPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingTop: '4px',
  },

  mobileNavButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  mobileBottomBar: {
    marginTop: '2px',
  },

  container: {
    maxWidth: '1320px',
    margin: '0 auto',
    padding: '32px 22px 54px 22px',
  },

  pageContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  sectionHeader: {
    marginBottom: '6px',
  },

  title: {
    margin: 0,
    fontSize: '46px',
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: '-1px',
  },

  subtitle: {
    marginTop: '10px',
    color: '#64748b',
    fontSize: '16px',
    lineHeight: 1.65,
    maxWidth: '760px',
  },

  heroPanel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
    padding: '38px',
    borderRadius: '32px',
    background: `
      radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 28%),
      linear-gradient(135deg, #0f172a 0%, #1e40af 45%, #2563eb 100%)
    `,
    color: '#ffffff',
    boxShadow: '0 28px 70px rgba(29,78,216,0.22)',
    border: '1px solid rgba(255,255,255,0.08)',
  },

  heroPanelMobile: {
    padding: '24px 20px',
    borderRadius: '24px',
  },

  heroEyebrow: {
    margin: '0 0 10px 0',
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '2px',
    opacity: 0.84,
  },

  heroTitle: {
    margin: 0,
    fontSize: '54px',
    fontWeight: '900',
    letterSpacing: '-1.5px',
    lineHeight: 1.03,
  },

  heroTitleMobile: {
    fontSize: '34px',
    lineHeight: 1.08,
  },

  heroSubtitle: {
    marginTop: '14px',
    maxWidth: '760px',
    fontSize: '17px',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.88)',
  },

  heroSubtitleMobile: {
    fontSize: '15px',
    lineHeight: 1.55,
  },

  heroActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },

  primaryButtonLink: {
    display: 'inline-block',
    backgroundColor: '#ffffff',
    color: '#1d4ed8',
    textDecoration: 'none',
    padding: '13px 20px',
    borderRadius: '16px',
    fontWeight: '800',
    boxShadow: '0 14px 28px rgba(0,0,0,0.16)',
  },

  secondaryButtonLink: {
    display: 'inline-block',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    textDecoration: 'none',
    padding: '10px 14px',
    borderRadius: '12px',
    fontWeight: '800',
    border: '1px solid #bfdbfe',
    boxShadow: '0 8px 18px rgba(59,130,246,0.08)',
  },

  dashboardHighlightGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '18px',
  },

  dashboardHighlightGridMobile: {
    gridTemplateColumns: '1fr',
  },

  highlightCard: {
    borderRadius: '26px',
    padding: '24px',
    color: '#ffffff',
    boxShadow: '0 18px 40px rgba(15,23,42,0.10)',
    position: 'relative',
    overflow: 'hidden',
  },

  highlightWarning: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
  },

  highlightDanger: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  },

  highlightInfo: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  },

  highlightSuccess: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },

  highlightLabel: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    fontWeight: '800',
    opacity: 0.95,
  },

  highlightValue: {
    margin: 0,
    fontSize: '42px',
    fontWeight: '900',
    letterSpacing: '-1px',
  },

  highlightValueSmall: {
    margin: 0,
    fontSize: '26px',
    fontWeight: '900',
    lineHeight: 1.25,
    letterSpacing: '-0.5px',
  },

  highlightText: {
    marginTop: '10px',
    fontSize: '14px',
    opacity: 0.94,
    lineHeight: 1.5,
  },

  dashboardMainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '20px',
  },

  dashboardMainGridMobile: {
    gridTemplateColumns: '1fr',
  },

  dashboardColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  twoStatsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px',
  },

  twoStatsGridMobile: {
    gridTemplateColumns: '1fr',
  },

  miniStatCard: {
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%)',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 18px 40px rgba(15,23,42,0.07)',
    border: '1px solid rgba(226,232,240,0.9)',
  },

  miniStatLabel: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '800',
  },

  miniStatValue: {
    margin: 0,
    fontSize: '42px',
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: '-1px',
  },

  miniStatText: {
    marginTop: '10px',
    color: '#64748b',
    fontSize: '14px',
    lineHeight: 1.5,
  },

  alertError: {
    backgroundColor: '#fff1f2',
    color: '#be123c',
    border: '1px solid #fecdd3',
    padding: '14px 16px',
    borderRadius: '16px',
    marginBottom: '6px',
    boxShadow: '0 12px 24px rgba(244,63,94,0.08)',
  },

  alertSuccess: {
    backgroundColor: '#ecfdf5',
    color: '#15803d',
    border: '1px solid #bbf7d0',
    padding: '14px 16px',
    borderRadius: '16px',
    marginBottom: '6px',
    boxShadow: '0 12px 24px rgba(34,197,94,0.08)',
  },

  formCard: {
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.97) 100%)',
    borderRadius: '28px',
    padding: '30px',
    boxShadow: '0 22px 50px rgba(15,23,42,0.08)',
    border: '1px solid rgba(226,232,240,0.92)',
  },

  formGroup: {
    marginBottom: '18px',
  },

  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '800',
    color: '#1e293b',
    fontSize: '14px',
    letterSpacing: '0.2px',
  },

  input: {
    width: '100%',
    padding: '14px 15px',
    borderRadius: '16px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#f8fbff',
    color: '#0f172a',
    boxShadow: 'inset 0 1px 2px rgba(15,23,42,0.03)',
  },

  twoColumns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },

  primaryButton: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '13px 22px',
    borderRadius: '16px',
    cursor: 'pointer',
    fontWeight: '800',
    fontSize: '15px',
    marginTop: '8px',
    boxShadow: '0 14px 28px rgba(37,99,235,0.24)',
  },

  secondaryButton: {
    backgroundColor: '#ffffff',
    color: '#1d4ed8',
    border: '1px solid #bfdbfe',
    padding: '13px 22px',
    borderRadius: '16px',
    cursor: 'pointer',
    fontWeight: '800',
    fontSize: '15px',
    marginTop: '8px',
    boxShadow: '0 10px 20px rgba(59,130,246,0.08)',
  },

  dangerButton: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '13px 22px',
    borderRadius: '16px',
    cursor: 'pointer',
    fontWeight: '800',
    fontSize: '15px',
    marginTop: '12px',
    boxShadow: '0 14px 28px rgba(239,68,68,0.22)',
  },

  infoBox: {
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.97) 100%)',
    borderRadius: '28px',
    padding: '26px',
    boxShadow: '0 20px 45px rgba(15,23,42,0.07)',
    border: '1px solid rgba(226,232,240,0.92)',
  },

  infoTitle: {
    marginTop: 0,
    marginBottom: '16px',
    fontSize: '28px',
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: '-0.7px',
  },

  infoText: {
    color: '#64748b',
    lineHeight: 1.7,
    fontSize: '15px',
  },

  materialList: {
    paddingLeft: '20px',
    margin: 0,
  },

  materialItem: {
    marginBottom: '12px',
    lineHeight: 1.7,
    color: '#334155',
    fontSize: '15px',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '18px',
  },

  card: {
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%)',
    borderRadius: '26px',
    padding: '24px',
    boxShadow: '0 18px 38px rgba(15,23,42,0.07)',
    border: '1px solid rgba(226,232,240,0.9)',
  },

  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '18px',
  },

  cardTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: '-0.6px',
  },

  badge: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    padding: '7px 11px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '800',
    whiteSpace: 'nowrap',
  },

  stockValue: {
    fontSize: '38px',
    fontWeight: '900',
    margin: '0 0 10px 0',
    color: '#0f172a',
    letterSpacing: '-1px',
  },

  stockUnit: {
    fontSize: '16px',
    color: '#64748b',
    fontWeight: '600',
  },

  cardDescription: {
    color: '#475569',
    margin: 0,
    lineHeight: 1.6,
    fontSize: '15px',
  },

  cardDescriptionMuted: {
    color: '#94a3b8',
    margin: 0,
    lineHeight: 1.6,
    fontSize: '15px',
  },

  emptyBox: {
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.95) 100%)',
    borderRadius: '28px',
    padding: '40px',
    textAlign: 'center',
    border: '1px dashed #cbd5e1',
  },

  emptyText: {
    margin: 0,
    color: '#64748b',
    fontSize: '15px',
  },

  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    marginTop: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    overflow: 'hidden',
  },

  th: {
    textAlign: 'left',
    padding: '15px',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '13px',
    color: '#475569',
    backgroundColor: '#f8fafc',
    fontWeight: '800',
  },

  td: {
    padding: '15px',
    borderBottom: '1px solid #eef2f7',
    fontSize: '14px',
    color: '#334155',
  },

  movimentoBadge: {
    display: 'inline-block',
    padding: '7px 11px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '800',
  },

  movimentoEntrada: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },

  movimentoSaida: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },

  quickActionBox: {
    marginTop: '18px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(226,232,240,0.9)',
  },

  quickActionLabel: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: '800',
    color: '#64748b',
  },

  quickActionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  quickQuantityInput: {
    width: '90px',
    padding: '10px 12px',
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fbff',
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
    outline: 'none',
  },

  plusButton: {
    width: '44px',
    height: '44px',
    borderRadius: '14px',
    border: 'none',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '900',
    cursor: 'pointer',
    boxShadow: '0 12px 22px rgba(16,185,129,0.22)',
  },

  minusButton: {
    width: '44px',
    height: '44px',
    borderRadius: '14px',
    border: 'none',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '900',
    cursor: 'pointer',
    boxShadow: '0 12px 22px rgba(239,68,68,0.22)',
  },

  addNewMaterialBox: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%)',
    borderRadius: '24px',
    padding: '22px 24px',
    boxShadow: '0 18px 38px rgba(15,23,42,0.07)',
    border: '1px solid rgba(226,232,240,0.9)',
  },

  addNewMaterialText: {
    margin: 0,
    color: '#475569',
    fontSize: '15px',
    fontWeight: '600',
  },

  authPage: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    background: `
      radial-gradient(circle at top left, rgba(59,130,246,0.20), transparent 24%),
      radial-gradient(circle at top right, rgba(16,185,129,0.12), transparent 20%),
      linear-gradient(180deg, #f8fbff 0%, #eef4ff 45%, #f7f9fc 100%)
    `,
  },

  authCard: {
    width: '100%',
    maxWidth: '460px',
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.97) 100%)',
    borderRadius: '28px',
    padding: '32px',
    boxShadow: '0 22px 50px rgba(15,23,42,0.08)',
    border: '1px solid rgba(226,232,240,0.92)',
  },

  authTitle: {
    margin: 0,
    fontSize: '38px',
    fontWeight: '900',
    color: '#0f172a',
  },

  authSubtitle: {
    marginTop: '10px',
    marginBottom: '24px',
    color: '#64748b',
    fontSize: '15px',
    lineHeight: 1.6,
  },

  authFooterText: {
    marginTop: '18px',
    color: '#475569',
    fontSize: '14px',
  },

  authLink: {
    color: '#1d4ed8',
    fontWeight: '800',
    textDecoration: 'none',
  },
}