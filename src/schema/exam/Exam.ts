import ExamTransfer from './ExamTransfer'

export default interface Exam extends ExamTransfer {
  id: string
  questionNumber: number
  questionsCount: number
  answeredCount: number
  completedAt?: number
  ownerId: string
  createdAt: number
  updatedAt?: number
}