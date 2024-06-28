import { useField } from 'formik'
import Error from '../Error'
import { Checkbox, Typography } from '@material-tailwind/react'

export default function FormikCheckbox({ name, label, children }) {
  const [ input, meta ] = useField(name)
  const { touched, error } = meta

  return (
    <>
      <Checkbox
        { ...input }
        name={ name }
        label={ label || (
          <Typography
            variant="small"
            color="gray"
            className="flex items-center font-normal"
          >
            { children }
          </Typography>
        ) }
      />

      { touched && error && <Error text={ error }/> }
    </>
  )
};