import { ThemeProvider as TailwindThemeProvider } from '@material-tailwind/react'
import { ReactNode } from 'react'

const theme = {
  input: {
    styles: {
      variants: {
        outlined: {
          sizes: {
            md: {
              input: {
                borderRadius: 'rounded',
              },
            },
            lg: {
              input: {
                borderRadius: 'rounded',
              },
            },
          },
        },
      },
    },
  },
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
  tabsBody: {
    defaultProps: {
      animate: {
        initial: { y: 0 },
        mount: { y: 0 },
        unmount: { y: 250 },
      },
    },
  },
}

export default ({ children }: { children: any }): ReactNode => <TailwindThemeProvider value={ theme }>
  { children }
</TailwindThemeProvider>