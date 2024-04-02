import Question from '../question/Question'

export default interface ExamQuestion {
  question: Question
  answer?: number | string
  nextQuestion?: string
  prevQuestion?: string
}