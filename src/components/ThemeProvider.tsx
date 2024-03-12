import { ThemeProvider as TailwindThemeProvider } from '@material-tailwind/react'
import { ReactNode } from 'react'

const theme = {
  button: {
    styles: {
      base: {
        initial: {
          fontWeight: 'font-normal',
          textTransform: 'capitalize',
        },
      },
      sizes: {
        sm: {
          borderRadius: 'rounded',
        },
        md: {
          borderRadius: 'rounded',
        },
        lg: {
          borderRadius: 'rounded',
        },
      },
    },
  },
}

export default ({ children }: { children: any }): ReactNode => <TailwindThemeProvider value={ theme }>
  { children }
</TailwindThemeProvider>