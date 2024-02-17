export default interface Me {
  id: string,
  email: string,
  permissions: string[],
  created: number,
  updated?: number,
}