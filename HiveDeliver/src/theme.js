import { createTheme } from '@mui/material/styles'

export function createAppTheme(mode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#0f766e',
        light: '#14b8a6',
        dark: '#115e59',
      },
      secondary: {
        main: '#f97316',
      },
      ...(mode === 'light'
        ? {
            background: { default: '#f3f7f8', paper: '#ffffff' },
            text: { primary: '#0f172a', secondary: '#475569' },
          }
        : {
            background: { default: '#0d1b22', paper: '#132330' },
            text: { primary: '#00ffcc', secondary: '#00ff99' },
          }),
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: ['Outfit', 'Segoe UI', 'Arial', 'sans-serif'].join(','),
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
    },
  })
}
