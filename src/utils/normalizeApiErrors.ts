export default (err: any): { [key: string]: string } => {
  const data = err.response.data
  console.log(data)

  if (data?.errors.length > 0) {
    return data.errors
  }

  if (data?.message) {
    const staticValidationPart = 'Validation errors '
    if (data.message.startsWith(staticValidationPart)) {
      const validationErrors = JSON.parse(data.message.substring(staticValidationPart.length))

      const errors = {}

      for (const validationError of validationErrors) {
        // @ts-ignore
        errors[validationError['property']] = Object.values(validationError['constraints'])
          .map((error) => Array.isArray(error) ? (error[0].toUpperCase() + error.slice(1)) : error)
          .map((error) => {
            const echo = Array.isArray(error) ? error[0] : error
            return echo[0].toUpperCase() + echo.slice(1)
          })
          .filter((error) => error !== undefined)
          .join('\r\n')
      }

      return errors
    }
  }

  return { unknown: data?.message ?? data.name }
}