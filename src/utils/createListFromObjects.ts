export default function createListFromObjects(items: object[], keyProp: string = 'id', labelProp: string = 'name') {
  return items.reduce((acc, item) => {
    acc[item[keyProp]] = item[labelProp]

    return acc
  }, {})
}