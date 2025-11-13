export const theme = {
  colors: {
    primary: '#2563EB',
    secondary: '#F59E0B',
    error: '#EF4444',
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#111827',
    mutedText: '#6b7280',
    border: '#e5e7eb',
    success: '#10b981'
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px'
  },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.06)',
    md: '0 4px 10px rgba(0,0,0,0.08)',
    lg: '0 10px 25px rgba(0,0,0,0.12)'
  },
  gradient: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(249,250,251,1))',
  typography: {
    fontFamily:
      "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif",
    h1: '28px',
    h2: '22px',
    h3: '18px',
    body: '16px',
    small: '13px'
  }
};

export const mergeStyles = (base, extra) => ({ ...base, ...extra });
