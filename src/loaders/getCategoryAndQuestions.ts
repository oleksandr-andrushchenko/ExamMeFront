import Question from "../schema/Question";
import Category from "../schema/Category";
import getCategory from "../api/getCategory";
import getCategoryQuestions from "../api/getCategoryQuestions";

interface getCategoryAndQuestionsParams {
  params: { categoryId: string }
}

export type CategoryAndQuestions = [ Category, Question[] ];

export default async ({ params }: getCategoryAndQuestionsParams) => await Promise.all<Category | Question[]>([
  getCategory(params.categoryId),
  getCategoryQuestions(params.categoryId),
])