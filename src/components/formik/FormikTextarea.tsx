import { useField } from 'formik'
import Error from '../Error'
import { Textarea } from '@material-tailwind/react'

export default function FormikTextarea({ name, label, children }) {
  const [ input, meta ] = useField(name)
  const { touched, error } = meta

  return (
    <>
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
    </>
  )
};