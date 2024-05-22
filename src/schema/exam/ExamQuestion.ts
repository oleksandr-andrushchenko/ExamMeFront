import Exam from './Exam'
import Question from '../question/Question'

export default interface ExamQuestion {
  exam?: Exam
  question?: Question
  number?: number
  choice?: number
  answer?: string
}