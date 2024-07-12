import { useField } from 'formik'
import Error from '../Error'
import { Checkbox, Typography } from '@material-tailwind/react'

export default function FormikCheckbox({ name, label, children }) {
  const [ input, meta ] = useField(name)
  const { touched, error } = meta

  return (
    <div className="flex flex-col gap-2">
      <Checkbox
        { ...input }
        name={ name }
        defaultChecked={ input.value }
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
    </div>
  )
};