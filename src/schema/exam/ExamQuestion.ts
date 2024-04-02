export default interface ExamQuestion {
  question: string
  answer?: number | string
  nextQuestion?: string
  prevQuestion?: string
}