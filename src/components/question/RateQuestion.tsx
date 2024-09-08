import { ComponentProps, memo } from 'react'
import { apiMutate, apiQuery } from '../../api/apolloClient'
import Question from '../../schema/question/Question'
import sleep from '../../utils/sleep'
import Rating from '../Rating'
import rateQuestion from '../../api/question/rateQuestion'
import getQuestionRating from '../../api/question/getQuestionRating'

interface Props extends ComponentProps<any> {
  question: Question,
  showAverageMark?: boolean
  showMarkCount?: boolean
  readonly?: boolean
}

const _RateQuestion = (
  {
    question,
    showAverageMark = false,
    showMarkCount = false,
    readonly = false,
  }: Props,
) => {
  return (
    <Rating
      rating={ question.rating }
      showAverageMark={ showAverageMark }
      showMarkCount={ showMarkCount }
      onChange={
        (mark, setRating, { setError, setLoading }) => {
          setLoading(true)
          apiMutate(
            rateQuestion(question.id!, mark),
            async (data: { rateQuestion: Question }) => {
              await sleep(1000)
              apiQuery(
                getQuestionRating(data.rateQuestion.id!),
                (data: { question: Question }) => setRating(data.question.rating),
                setError,
              ).finally(() => setLoading(false))
            },
            setError,
          )
        }
      }
      readonly={ readonly }
    />
  )
}

export const RateQuestion = memo(_RateQuestion)