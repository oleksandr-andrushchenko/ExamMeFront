import { ThemeProvider as TailwindThemeProvider } from '@material-tailwind/react'
import { ReactNode } from 'react'

const theme = {
  button: {
    defaultProps: {
      ripple: false,
    },
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
  dialog: {
    styles: {
      base: {
        backdrop: {
          position: 'fixed overscroll-y-auto overflow-auto',
        },
      },
    },
  },
  breadcrumbs: {
    styles: {
      base: {
        root: {
          initial: {
            width: 'max-w-max',
          },
        },
      },
    },
  },
  chip: {
    styles: {
      base: {
        chip: {
          fontWeight: '',
          textTransform: '',
        },
      },
      sizes: {
        sm: {
          chip: {
            borderRadius: 'rounded',
          },
        },
        md: {
          chip: {
            borderRadius: 'rounded',
          },
        },
        lg: {
          chip: {
            borderRadius: 'rounded',
          },
        },
      },
    },
  },
  list: {
    defaultProps: {
      ripple: false,
    },
    styles: {
      base: {
        item: {
          initial: {
            bg: '',
          },
        },
      },
    },
  },
}

export default ({ children }: { children: any }): ReactNode => <TailwindThemeProvider value={ theme }>
  { children }
</TailwindThemeProvider>