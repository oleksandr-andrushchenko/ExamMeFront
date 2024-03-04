export default (err): { [key: string]: string } => {
  const data = err.response.data;
  console.log(data);

  if (data?.errors.length > 0) {
    return data.errors;
  }

  if (data?.message) {
    const staticValidationPart = 'Validation errors ';
    if (data.message.startsWith(staticValidationPart)) {
      const validationErrors = JSON.parse(data.message.substring(staticValidationPart.length));

      // Validation error [{\"value\":\"qwe\",\"property\":\"title\",\"children\":[],\"constraints\":{\"isLength\":\"title must be longer than or equal to 50 characters\"}}]
      const errors = {};

      for (const validationError of validationErrors) {
        errors[validationError['property']] = Object.values(validationError['constraints'])
          .map((error) => error[0].toUpperCase() + error.slice(1))
          .join("\r\n");
      }

      return errors;
    }
  }

  return { unknown: data?.message ?? data.name };
}