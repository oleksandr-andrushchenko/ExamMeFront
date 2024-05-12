export default function urlSearchParamsToPlainObject(params: URLSearchParams) {
  const result = {}

  for (const [ key, value ] of params.entries()) {
    result[key] = value
  }

  return result
}