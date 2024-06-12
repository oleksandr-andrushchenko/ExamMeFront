import { useField } from 'formik'
import Error from '../Error'
import React from 'react'
import { Checkbox, Typography } from '@material-tailwind/react'

export default function FormikCheckbox({ name, children }) {
  const [ input, meta ] = useField({ name })

  return (
    <>
      <Checkbox
        name={ name }
        label={
          <Typography
            variant="small"
            color="gray"
            className="flex items-center font-normal">{ children }</Typography>
        }
        onChange={ input.onChange }
        onBlur={ input.onBlur }/>

      { meta.touched && meta.error && <Error text={ meta.error }/> }
    </>
  )
};