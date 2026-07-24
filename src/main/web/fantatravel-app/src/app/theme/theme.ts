import { createTheme } from '@mui/material/styles';

// 🌍 Fantatravel Theme - Travel-inspired colors
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#FF6B35',        // 🌅 Sunset Orange - vibrant travel energy
            light: '#FF8C61',       // Lighter sunset
            dark: '#CC5528',        // Deeper sunset
            contrastText: '#FFFFFF'
        },
        secondary: {
            main: '#00A8E8',        // 🌊 Ocean Blue - adventure & exploration
            light: '#33BAED',       // Sky blue
            dark: '#0077A8',        // Deep ocean
            contrastText: '#FFFFFF'
        },
        success: {
            main: '#4CAF50',        // ✅ Bonus green
            light: '#81C784',
            dark: '#388E3C',
        },
        error: {
            main: '#F44336',        // ❌ Malus red
            light: '#E57373',
            dark: '#D32F2F',
        },
        warning: {
            main: '#FFC107',        // ⚠️ Golden trophy
            light: '#FFD54F',
            dark: '#FFA000',
        },
        info: {
            main: '#2196F3',        // ℹ️ Info blue
            light: '#64B5F6',
            dark: '#1976D2',
        },
        background: {
            default: '#0A1929',     // 🌃 Deep night sky
            paper: '#132F4C',       // 🗺️ Map paper dark
        },
        text: {
            primary: '#FFFFFF',     // White text
            secondary: '#B2BAC2',   // Muted gray
            disabled: '#6B7280',
        },
        divider: '#1E3A5F',         // Subtle divider
        action: {
            active: '#FF6B35',      // Active state = primary
            hover: 'rgba(255, 107, 53, 0.08)',
            selected: 'rgba(255, 107, 53, 0.16)',
            disabled: '#6B7280',
            disabledBackground: '#1E3A5F',
        }
    },
    typography: {
        fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        h1: {
            fontWeight: 800,
            fontSize: '2.5rem',
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2rem',
            letterSpacing: '-0.01em',
        },
        h3: {
            fontWeight: 700,
            fontSize: '1.75rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1rem',
        },
        subtitle1: {
            fontWeight: 500,
            fontSize: '1rem',
        },
        subtitle2: {
            fontWeight: 500,
            fontSize: '0.875rem',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.02em',
        },
        caption: {
            fontSize: '0.75rem',
            color: '#B2BAC2',
        },
        overline: {
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
        }
    },
    shape: {
        borderRadius: 12, // Rounded corners for modern look
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(255, 107, 53, 0.25)',
                    }
                },
                contained: {
                    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #FF8C61 0%, #FFA07A 100%)',
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 48px rgba(255, 107, 53, 0.3)',
                        border: '1px solid rgba(255, 107, 53, 0.5)',
                    }
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                },
                filled: {
                    backgroundImage: 'linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 107, 53, 0.3) 100%)',
                    border: '1px solid rgba(255, 107, 53, 0.4)',
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(19, 47, 76, 0.5)',
                    borderRadius: 10,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#FF6B35',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#FF6B35',
                        borderWidth: 2,
                    }
                },
                notchedOutline: {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    boxShadow: '0 8px 24px rgba(255, 107, 53, 0.4)',
                    '&:hover': {
                        boxShadow: '0 12px 32px rgba(255, 107, 53, 0.6)',
                    }
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                },
                elevation1: {
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                },
                elevation2: {
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                },
            }
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    userSelect: 'none',
                    cursor: 'default',
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 107, 53, 0.1)',
                        transform: 'scale(1.1)',
                    }
                }
            }
        }
    },
});

export default theme;