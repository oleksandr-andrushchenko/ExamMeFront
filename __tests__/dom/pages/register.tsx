import { config, renderRoute, within } from '../../index'
import Route from '../../../src/enum/Route'

describe('Register page', () => {
  config()

  test('Initial state', () => {
    const { getByRole } = renderRoute(Route.Register)

    const navbar = getByRole('navigation', { name: '' })
    expect(navbar).toBeInTheDocument()
    expect(navbar).toBeVisible()

    const title = getByRole('heading', { name: /register/i })
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

    const passwordInput = within(form).getByPlaceholderText(/^password/i)
    expect(passwordInput).toBeInTheDocument()
    expect(passwordInput).toBeVisible()
    expect(passwordInput).not.toBeDisabled()

    const confirmPasswordInput = within(form).getByPlaceholderText(/confirm password/i)
    expect(confirmPasswordInput).toBeInTheDocument()
    expect(confirmPasswordInput).toBeVisible()
    expect(confirmPasswordInput).not.toBeDisabled()

    const submitButton = within(form).getByRole('button', { name: /register/i })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toBeVisible()
    expect(submitButton).toBeDisabled()
  })
})