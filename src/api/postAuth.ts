import client from "./client";
import Auth from "../schema/Auth";

export default async ({ email, password }): Promise<Auth> => (await client.post('/auth', { email, password })).data;