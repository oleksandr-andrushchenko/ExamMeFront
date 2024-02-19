import client from "./client";
import Category from "../schema/Category";

export default async ({ name }): Promise<Category> => (await client.post('/categories', { name })).data;