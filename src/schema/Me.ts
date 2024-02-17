import Permission from "./Permission";

export default interface Me {
  id: string,
  email: string,
  permissions: Permission[],
  created: number,
  updated?: number,
}