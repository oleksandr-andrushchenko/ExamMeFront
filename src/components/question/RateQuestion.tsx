import { ComponentProps, memo } from 'react'
import { apiMutate, apiQuery } from '../../api/apolloClient'
import Question from '../../schema/question/Question'
import sleep from '../../utils/sleep'
import Rating from '../Rating'
import rateQuestion from '../../api/question/rateQuestion'
import getQuestion from '../../api/question/getQuestion'

interface Props extends ComponentProps<any> {
  question: Question,
  showAverageMark?: boolean
  showMarkCount?: boolean
  onChange?: Function
  readonly?: boolean
}

const _RateQuestion = (
  {
    question,
    onChange,
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
              await sleep(100)
              apiQuery(
                getQuestion(data.rateQuestion.id!),
                (data: { question: Question }) => {
                  setRating(data.question.rating)
                  onChange && onChange(data.question)
                },
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