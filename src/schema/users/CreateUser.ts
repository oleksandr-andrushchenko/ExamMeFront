import Permission from '../../enum/Permission'

export default interface CreateUser {
  name?: string
  email: string
  password?: string
  permission?: Permission[]
}