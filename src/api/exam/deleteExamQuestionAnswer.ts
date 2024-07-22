import { gql } from '@apollo/client'

export default function deleteExamQuestionAnswer(examId: string, question: number): any {
  return {
    mutation: gql`
        mutation DeleteExamQuestionAnswer($examId: ID!, $question: Int!) {
            deleteExamQuestionAnswer(examId: $examId, question: $question) {
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
    },
  }
}