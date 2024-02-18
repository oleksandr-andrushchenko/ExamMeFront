import apiClient from "./apiClient";
import Me from "../schema/Me";

export default async (): Promise<Me> => (await apiClient.get('/me')).data;