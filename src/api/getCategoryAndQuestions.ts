import apiClient from "../api/apiClient";
import { AxiosResponse } from "axios";
import Question from "../schema/Question";
import Category from "../schema/Category";

interface getCategoryAndQuestionsParams {
  params: { categoryId: string }
}

interface getCategoryAndQuestionsResult {
  category: Category,
  questions: Question[],
}

const getCategoryAndQuestions = async ({ params }: getCategoryAndQuestionsParams): Promise<getCategoryAndQuestionsResult> => {
  const response: AxiosResponse[] = await Promise.all([
    apiClient.get(`/categories/${params.categoryId}`),
    apiClient.get(`/categories/${params.categoryId}/questions`),
  ]);

  return {
    category: response[0].data,
    questions: response[1].data,
  };
};

export default getCategoryAndQuestions;