import Question from "../schema/Question";
import Category from "../schema/Category";
import getCategory from "./getCategory";
import getCategoryQuestions from "./getCategoryQuestions";

interface getCategoryAndQuestionsParams {
  params: { categoryId: string }
}

export interface CategoryAndQuestions {
  category: Category,
  questions: Question[],
}

export default async ({ params }: getCategoryAndQuestionsParams) => await Promise.all<Category | Question[]>([
  getCategory(params.categoryId),
  getCategoryQuestions(params.categoryId),
])