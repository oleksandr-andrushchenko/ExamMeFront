import { gql } from '@apollo/client'
import ExamQuestionAnswerTransfer from '../../schema/exam/ExamQuestionAnswerTransfer'

export default function addExamQuestionAnswerMutation(
  examId: string,
  question: number,
  examQuestionAnswer: ExamQuestionAnswerTransfer,
): any {
  return {
    mutation: gql`
        mutation AddExamQuestionAnswer(
            $examQuestionAnswer: CreateExamQuestionAnswerSchema!,
            $examId: ID!,
            $question: Int!
        ) {
            addExamQuestionAnswer(
                examQuestionAnswer: $examQuestionAnswer,
                examId: $examId,
                question: $question
            ) {
                number
                question
                difficulty
                type
                choices
                choice
                answer
            }
        }
    `,
    variables: {
      examId,
      question,
      examQuestionAnswer,
    },
  }
}