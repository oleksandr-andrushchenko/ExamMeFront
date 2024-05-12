import Permission from '../../enum/Permission'

export default interface Me {
  id: string
  name?: string
  email: string
  permissions: Permission[]
  createdAt: number
  updatedAt?: number
}