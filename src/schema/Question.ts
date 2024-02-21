import QuestionTransfer from "./QuestionTransfer";

export default interface Question extends QuestionTransfer {
  id: string,
  created: number,
  updated?: number,
}