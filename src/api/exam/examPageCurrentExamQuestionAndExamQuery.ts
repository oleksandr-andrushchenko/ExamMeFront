import { gql } from '@apollo/client'

export default function examPageCurrentExamQuestionAndExamQuery(examId: string): any {
  return {
    query: gql`
        query ExamPageCurrentExamQuestionAndExam(
            $examId: ID!
        ) {
            currentExamQuestion(
                examId: $examId
            ) {
                question
                type
                choices
                choice
                answer
            }
            exam(
                examId: $examId
            ) {
                id
                categoryId
                questionNumber
                ownerId
                questionCount
                answeredQuestionCount
                category {
                    name
                }
            }
        }
    `,
    variables: {
      examId,
    },
    fetchPolicy: 'network-only',
  }
}