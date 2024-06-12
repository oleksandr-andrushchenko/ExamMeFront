import { useField } from 'formik'
import Error from '../Error'
import React from 'react'
import { Input } from '@material-tailwind/react'

export default function FormikInput({ name, type, size, label }) {
  const [ input, meta ] = useField({ name })

  return (
    <>
      <Input
        name={ name }
        type={ type }
        size={ size || 'lg' }
        label={ label }
        onChange={ input.onChange }
        onBlur={ input.onBlur }
        value={ meta.value }
        success={ meta.touched && !meta.error }
        error={ meta.touched && !!meta.error }/>

      { meta.touched && meta.error && <Error text={ meta.error }/> }
    </>
  )
};