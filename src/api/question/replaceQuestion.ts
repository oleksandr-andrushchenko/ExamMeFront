import client from '../client'
import QuestionTransfer from '../../schema/QuestionTransfer'
import { AxiosResponse } from 'axios'

export default async (id: string, transfer: QuestionTransfer): Promise<AxiosResponse> => await client.put(`/questions/${ id }`, transfer)