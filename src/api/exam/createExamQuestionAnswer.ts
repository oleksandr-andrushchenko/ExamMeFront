import { gql } from '@apollo/client'
import CreateExamQuestionAnswer from '../../schema/exam/CreateExamQuestionAnswer'

export default function createExamQuestionAnswer(
  examId: string,
  question: number,
  createExamQuestionAnswer: CreateExamQuestionAnswer,
): any {
  return {
    mutation: gql`
        mutation CreateAnswerExamQuestion(
            $createExamQuestionAnswer: CreateExamQuestionAnswer!,
            $examId: ID!,
            $question: Int!
        ) {
            createExamQuestionAnswer(examId: $examId, question: $question, createExamQuestionAnswer: $createExamQuestionAnswer) {
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
                }
                choices
                number
                choice
                answer
            }
        }
    `,
    variables: {
      examId,
      question,
      createExamQuestionAnswer,
    },
  }
}