import QuestionTransfer from './QuestionTransfer'

export default interface Question extends QuestionTransfer {
  id: string
  createdAt: number
  updatedAt?: number
}