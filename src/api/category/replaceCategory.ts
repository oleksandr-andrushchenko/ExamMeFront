import client from '../client'
import CategoryTransfer from '../../schema/CategoryTransfer.ts'
import { AxiosResponse } from 'axios'

export default async (id: string, transfer: CategoryTransfer): Promise<AxiosResponse> => await client.put(`/categories/${ id }`, transfer)