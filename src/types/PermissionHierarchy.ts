import Permission from '../enum/Permission'

type PermissionHierarchy = {
  [value in Permission]: Permission[];
};

export default PermissionHierarchy