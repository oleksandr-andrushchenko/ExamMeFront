import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event'
import App from '../src/components/App'

// configure({ reactStrictMode: true })

export const config = (): void => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
}

export function renderRoute(route = '/') {
  window.history.pushState({}, 'Test page', route)

  const user = userEvent.setup();
  const rendered = render(<App/>);

  return {
    user,
    ...rendered,
  }
}

export * from '@testing-library/react'