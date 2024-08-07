import { useField } from 'formik'
import Error from '../Error'
import { Textarea } from '@material-tailwind/react'
import { ComponentProps } from 'react'

interface Props extends ComponentProps<'textarea'> {
  name: string
  label?: string
  children?: any
}

export default function FormikTextarea({ name, label, children }: Props) {
  const [ input, meta ] = useField(name)
  const { touched, error } = meta

  return (
    <div className="flex flex-col gap-1">
      <Textarea
        { ...input }
        rows={ 1 }
        resize
        name={ name }
        label={ label || (children || []).join('') || name }
        success={ touched && !error }
        error={ touched && !!error }
      />

      { touched && error && <Error text={ error }/> }
    </div>
  )
};