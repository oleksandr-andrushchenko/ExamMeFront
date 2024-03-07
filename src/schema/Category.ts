import CategoryTransfer from "./CategoryTransfer"

export default interface Category extends CategoryTransfer {
  id: string,
  questionCount: number,
  created: number,
  updated?: number,
}