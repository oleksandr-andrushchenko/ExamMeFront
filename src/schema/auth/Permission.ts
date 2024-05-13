import PermissionHierarchy from './PermissionHierarchy'

export default interface Permission {
  items?: Permission[]
  hierarchy?: PermissionHierarchy
}