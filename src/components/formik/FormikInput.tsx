import { useField } from 'formik'
import Error from '../Error'
import { Input } from '@material-tailwind/react'

export default function FormikInput({ name, type = 'text', size = 'lg', label, children }) {
  const [ input, meta ] = useField(name)
  const { touched, error } = meta

  return (
    <>
      <Input
        { ...input }
        type={ type }
        size={ size }
        label={ label || (children || []).join('') || name }
        success={ touched && !error }
        error={ touched && !!error }
      />

      { touched && error && <Error text={ error }/> }
    </>
  )
};