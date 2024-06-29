import { gql } from '@apollo/client'
import ExamQuestionAnswerTransfer from '../../schema/exam/ExamQuestionAnswerTransfer'

export default function answerExamQuestionMutation(
  examId: string,
  question: number,
  examQuestionAnswer: ExamQuestionAnswerTransfer,
): any {
  return {
    mutation: gql`
        mutation AnswerExamQuestion(
            $examQuestionAnswer: CreateExamQuestionAnswerSchema!,
            $examId: ID!,
            $question: Int!
        ) {
            answerExamQuestion(examId: $examId, question: $question, examQuestionAnswer: $examQuestionAnswer) {
                exam {
                    id
                    questionNumber
                    questionCount
                    answeredQuestionCount
                    categoryId
                    category {
                        name
                    }
                    ownerId
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
  }
}