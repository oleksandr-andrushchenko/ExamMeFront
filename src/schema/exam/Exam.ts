import ExamTransfer from './ExamTransfer'

export default interface Exam extends ExamTransfer {
  id: string
  created: number
  updated?: number
}