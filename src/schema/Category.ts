import CategoryTransfer from "./CategoryTransfer";

export default interface Category extends CategoryTransfer {
  id: string,
  created: number,
  updated?: number,
}