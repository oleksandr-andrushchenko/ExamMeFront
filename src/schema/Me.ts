import Permission from "../enum/Permission";

export default interface Me {
  id: string,
  email: string,
  permissions: Permission[],
  created: number,
  updated?: number,
}