import Permission from '../../enum/Permission'

export default interface User {
  id?: string
  name?: string
  email?: string
  permissions?: Permission[]
  ownerId?: string
  createdAt?: number
  updatedAt?: number
}