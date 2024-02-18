import client from "./client";
import Question from "../schema/Question";

export default async (categoryId: string): Promise<Question[]> => (await client.get(`/categories/${categoryId}/questions`)).data;