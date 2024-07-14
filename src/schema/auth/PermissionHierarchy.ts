import Permission from '../../enum/Permission'

export default interface PermissionHierarchy {
  [Permission.Regular]?: string[]
  [Permission.Root]?: string[]
}