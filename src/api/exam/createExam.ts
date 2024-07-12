import { gql } from '@apollo/client'
import CreateExam from '../../schema/exam/CreateExam'

export default function createExam(createExam: CreateExam): any {
  return {
    mutation: gql`
        mutation CreateExam($createExam: CreateExam!) {
            createExam(createExam: $createExam) {
                id
                ownerId
            }
        }
    `,
    variables: {
      createExam,
    },
  }
}