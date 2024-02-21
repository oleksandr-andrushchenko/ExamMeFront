import client from "./client";
import Question from "../schema/Question";
import QuestionTransfer from "../schema/QuestionTransfer.ts";

export default async (transfer: QuestionTransfer): Promise<Question> => (await client.post('/questions', transfer)).data;