export const styles = {
  app: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%),
      radial-gradient(circle at top right, rgba(16,185,129,0.12), transparent 22%),
      linear-gradient(180deg, #f8fbff 0%, #eef4ff 45%, #f6f8fc 100%)
    `,
    color: '#0f172a',
    fontFamily: 'Inter, Arial, sans-serif',
  },

  navbar: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    borderBottom: '1px solid rgba(148,163,184,0.18)',
    padding: '18px 34px',
    display: 'grid',
    gridTemplateColumns: '1fr auto auto',
    alignItems: 'center',
    gap: '20px',
    position: 'sticky',
    top: 0,
    zIndex: 20,
    boxShadow: '0 10px 30px rgba(15,23,42,0.05)',
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
    fontSize: '34px',
    fontWeight: '900',
    letterSpacing: '-1px',
    color: '#0f172a',
  },

  logoSub: {
    margin: '6px 0 0 0',
    color: '#64748b',
    fontSize: '15px',
    fontWeight: '500',
  },

  navButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  navButton: {
    padding: '10px 16px',
    borderRadius: '14px',
    border: '1px solid rgba(59,130,246,0.14)',
    backgroundColor: 'rgba(255,255,255,0.78)',
    cursor: 'pointer',
    fontWeight: '700',
    textDecoration: 'none',
    color: '#1d4ed8',
    boxShadow: '0 6px 18px rgba(37,99,235,0.08)',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },

  navButtonActive: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: '#ffffff',
    border: '1px solid #2563eb',
    boxShadow: '0 14px 28px rgba(37,99,235,0.28)',
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
    minWidth: '180px',
    backgroundColor: 'rgba(255,255,255,0.98)',
    border: '1px solid rgba(226,232,240,0.95)',
    borderRadius: '18px',
    boxShadow: '0 18px 40px rgba(15,23,42,0.12)',
    padding: '10px',
    zIndex: 30,
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

  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '34px 22px 50px 22px',
  },

  pageContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  sectionHeader: {
    marginBottom: '4px',
  },

  title: {
    margin: 0,
    fontSize: '44px',
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: '-1px',
  },

  subtitle: {
    marginTop: '10px',
    color: '#64748b',
    fontSize: '16px',
    lineHeight: 1.6,
    maxWidth: '760px',
  },

  heroPanel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
    padding: '34px',
    borderRadius: '30px',
    background: `
      radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 28%),
      linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #2563eb 100%)
    `,
    color: '#ffffff',
    boxShadow: '0 30px 70px rgba(29,78,216,0.22)',
    border: '1px solid rgba(255,255,255,0.08)',
  },

  heroEyebrow: {
    margin: '0 0 10px 0',
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '2px',
    opacity: 0.8,
  },

  heroTitle: {
    margin: 0,
    fontSize: '52px',
    fontWeight: '900',
    letterSpacing: '-1.5px',
    lineHeight: 1.05,
  },

  heroSubtitle: {
    marginTop: '14px',
    maxWidth: '760px',
    fontSize: '17px',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.86)',
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
    boxShadow: '0 14px 28px rgba(0,0,0,0.18)',
  },

  secondaryButtonLink: {
    display: 'inline-block',
    backgroundColor: 'rgba(255,255,255,0.12)',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '13px 20px',
    borderRadius: '16px',
    fontWeight: '800',
    border: '1px solid rgba(255,255,255,0.18)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
  },

  dashboardHighlightGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '18px',
  },

  highlightCard: {
    borderRadius: '24px',
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
    opacity: 0.92,
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
    opacity: 0.92,
    lineHeight: 1.5,
  },

  dashboardMainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '20px',
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

  miniStatCard: {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.96) 100%)',
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
    background: 'linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(248,250,252,0.97) 100%)',
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

  infoBox: {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.96) 100%)',
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
    background: 'linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(248,250,252,0.95) 100%)',
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
    background: 'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(248,250,252,0.94) 100%)',
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
}