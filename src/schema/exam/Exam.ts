import ExamTransfer from './ExamTransfer'

export default interface Exam extends ExamTransfer {
  id: string
  questionNumber: number
  questionsCount: number
  answeredCount: number
  completed?: number
  owner: string
  created: number
  updated?: number
}