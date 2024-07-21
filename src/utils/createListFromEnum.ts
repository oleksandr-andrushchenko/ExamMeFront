export default function createListFromEnum(items: object) {
  return Object.values(items).reduce((acc, item) => {
    acc[item] = item

    return acc
  }, {})
}