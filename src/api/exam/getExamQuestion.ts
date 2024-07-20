import { gql } from '@apollo/client'

export default function getExamQuestion(examId: string, question: number): any {
  return {
    query: gql`
        query GetExamQuestion($examId: ID!, $question: Int!) {
            examQuestion(examId: $examId, question: $question) {
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