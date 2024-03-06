import { useContext } from 'react'
import { AuthContext, AuthProviderContextValue } from '../context/AuthProvider'

export default (): AuthProviderContextValue => useContext<AuthProviderContextValue>(AuthContext as any)