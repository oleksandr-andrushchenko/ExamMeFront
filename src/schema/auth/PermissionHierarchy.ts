import Permission from '../../enum/Permission'

export default interface PermissionHierarchy {
  [Permission.REGULAR]?: string[]
  [Permission.ROOT]?: string[]
}