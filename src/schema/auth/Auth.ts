export default interface Auth {
  email: string
  permissions: string[]
  token: string
  expires: number
}