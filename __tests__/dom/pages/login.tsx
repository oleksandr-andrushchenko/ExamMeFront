import { config, renderRoute, within } from '../../index'
import Route from '../../../src/enum/Route'

describe('Login page', () => {
  config()

  test('Initial state', () => {
    const { getByRole } = renderRoute(Route.Login)

    const navbar = getByRole('navigation', { name: '' })
    expect(navbar).toBeInTheDocument()
    expect(navbar).toBeVisible()

    const title = getByRole('heading', { name: /login/i })
    expect(title).toBeInTheDocument()
    expect(title).toBeVisible()

    const breadcrumbs = getByRole('navigation', { name: 'breadcrumb' })
    expect(breadcrumbs).toBeInTheDocument()
    expect(breadcrumbs).toBeVisible()

    const form = document.querySelector('form') as HTMLFormElement
    expect(form).not.toBeNull()

    const emailInput = within(form).getByPlaceholderText(/email/i)
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toBeVisible()
    expect(emailInput).not.toBeDisabled()

    const passwordInput = within(form).getByPlaceholderText(/password/i)
    expect(passwordInput).toBeInTheDocument()
    expect(passwordInput).toBeVisible()
    expect(passwordInput).not.toBeDisabled()

    const submitButton = within(form).getByRole('button', { name: /login/i })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toBeVisible()
    expect(submitButton).toBeDisabled()

    const registerLink = within(form).getByRole('link', { name: /register/i })
    expect(registerLink).toBeInTheDocument()
    expect(registerLink).toBeVisible()
  })
})