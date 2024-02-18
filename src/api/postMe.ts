import client from "./client";
import Me from "../schema/Me";

export default async ({ email, password }): Promise<Me> => (await client.post('/me', { email, password })).data;