import { gql } from '@apollo/client'

export default function examPageExamQuestionQuery(examId: string, question: number): any {
  return {
    query: gql`
        query ExamPageExamQuestion($examId: ID!, $question: Int!) {
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
    },
  }
}