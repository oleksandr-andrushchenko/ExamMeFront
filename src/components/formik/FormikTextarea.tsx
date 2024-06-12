import { useField } from 'formik'
import Error from '../Error'
import React from 'react'
import { Textarea } from '@material-tailwind/react'

export default function FormikTextarea({ name, label, children }) {
  const [ input, meta ] = useField({ name })

  return (
    <>
      <Textarea
        rows={ 1 }
        resize
        name={ name }
        label={ label || (children || []).join('') || name }
        onChange={ input.onChange }
        onBlur={ input.onBlur }
        value={ meta.value }
        success={ meta.touched && !meta.error }
        error={ meta.touched && !!meta.error }/>

      { meta.touched && meta.error && <Error text={ meta.error }/> }
    </>
  )
};