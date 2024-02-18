import apiClient from "./apiClient";
import Question from "../schema/Question";

export default async (categoryId: string): Promise<Question[]> => (await apiClient.get(`/categories/${categoryId}/questions`)).data;