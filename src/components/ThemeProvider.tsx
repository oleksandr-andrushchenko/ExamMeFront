import { ThemeProvider as TailwindThemeProvider } from '@material-tailwind/react'
import { ReactNode } from 'react'

const theme = {}

export default ({ children }: { children: any }): ReactNode => <TailwindThemeProvider value={ theme }>
  { children }
</TailwindThemeProvider>