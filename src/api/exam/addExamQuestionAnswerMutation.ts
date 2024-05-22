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
                exam {
                    id
                    questionNumber
                    questionCount
                    answeredQuestionCount
                    categoryId
                    category {
                        name
                    }
                }
                question {
                    id
                    title
                    type
                    choices {
                        title
                    }
                }
                number
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
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
  }
}