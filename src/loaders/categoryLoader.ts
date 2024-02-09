import loaderClient from "./loaderClient";
import { AxiosResponse } from "axios";

export default async function categoryLoader({ params }) {
  const response: AxiosResponse[] = await Promise.all([
    loaderClient.get(`/categories/${params.categoryId}`),
    loaderClient.get(`/categories/${params.categoryId}/questions`)
  ]);

  return {
    category: response[0].data,
    questions: response[1].data,
  };
}