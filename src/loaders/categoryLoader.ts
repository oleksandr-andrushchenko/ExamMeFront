import apiClient from "../api/apiClient";
import { AxiosResponse } from "axios";

export default async function categoryLoader({ params }) {
  const response: AxiosResponse[] = await Promise.all([
    apiClient.get(`/categories/${params.categoryId}`),
    apiClient.get(`/categories/${params.categoryId}/questions`)
  ]);

  return {
    category: response[0].data,
    questions: response[1].data,
  };
}