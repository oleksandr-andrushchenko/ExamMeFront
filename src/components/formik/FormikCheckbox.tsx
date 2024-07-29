import { useField } from 'formik'
import Error from '../Error'
import { Checkbox, Typography } from '@material-tailwind/react'
import { ComponentProps } from 'react'

interface Props extends ComponentProps<any> {
  name: string
  label?: string
  children?: any
}

export default function FormikCheckbox({ name, label, children }: Props) {
  const [ input, meta ] = useField(name)
  const { touched, error } = meta

  return (
    <div className="flex flex-col gap-1">
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