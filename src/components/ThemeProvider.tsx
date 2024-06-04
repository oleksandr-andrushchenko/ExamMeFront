import { ThemeProvider as TailwindThemeProvider } from '@material-tailwind/react'
import { ReactNode } from 'react'

const theme = {
  checkbox: {
    defaultProps: {
      ripple: false,
    },
    styles: {
      base: {
        container: {
          borderRadius: 'rounded',
        },
        input: {
          borderRadius: 'rounded',
          before: {
            borderRadius: 'before:rounded',
          },
        },
      },
    },
  },
  radio: {
    defaultProps: {
      ripple: false,
    },
  },
  input: {
    styles: {
      variants: {
        outlined: {
          base: {
            label: {
              before: {
                borderRadius: 'before:rounded-tl',
              },
              after: {
                borderRadius: 'after:rounded-tr',
              },
            },
          },
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

  textarea: {
    defaultProps: {
      rows: 1,
      resize: true,
    },
    styles: {
      base: {
        textarea: {
          minHeight: '',
        },
      },
      variants: {
        outlined: {
          base: {
            label: {
              before: {
                borderRadius: 'before:rounded-tl',
              },
              after: {
                borderRadius: 'after:rounded-tr',
              },
            },
          },
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
      size: 'sm',
      ripple: false,
    },
    styles: {
      base: {
        initial: {
          fontWeight: 'font-normal',
          textTransform: '',
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
  iconButton: {
    defaultProps: {
      size: 'sm',
      ripple: false,
    },
    styles: {
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
  buttonGroup: {
    defaultProps: {
      size: 'sm',
      ripple: false,
    },
  },
  dialog: {
    defaultProps: {
      size: 'xs',
      className: 'bg-transparent shadow-none text-center',
    },
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
          display: 'inline-block',
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
  tabsHeader: {
    styles: {
      base: {
        borderRadius: 'rounded',
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
  tab: {
    styles: {
      base: {
        indicator: {
          borderRadius: 'rounded',
        },
      },
    },
  },
  select: {
    styles: {
      base: {
        container: {
          width: '',
          minWidth: 'min-w-[100px]',
        },
        menu: {
          borderRadius: 'rounded',
        },
        option: {
          initial: {
            borderRadius: 'rounded',
          },
        },
      },
      variants: {
        outlined: {
          base: {
            label: {
              before: {
                borderRadius: 'before:rounded-tl',
              },
              after: {
                borderRadius: 'after:rounded-tr',
              },
            },
          },
          sizes: {
            md: {
              select: {
                borderRadius: 'rounded',
              },
            },
            lg: {
              select: {
                borderRadius: 'rounded',
              },
            },
          },
        },
      },
    },
  },
}

export default function ThemeProvider({ children }: { children: any }): ReactNode {
  return (
    <TailwindThemeProvider value={ theme }>
      { children }
    </TailwindThemeProvider>
  )
}