import PermissionHierarchy from './PermissionHierarchy'
import { default as PermissionEnum } from '../../enum/Permission'

export default interface Permission {
  items?: PermissionEnum[]
  hierarchy?: PermissionHierarchy
}