import { useField } from 'formik'
import Error from '../Error'
import React from 'react'
import { Option, Select } from '@material-tailwind/react'

export default function FormikSelect({ name, label, options }) {
  const [ input, meta, helper ] = useField({ name })

  return (
    <>
      <Select
        name={ name }
        label={ label || name }
        onChange={ value => helper.setValue(value) }
        onBlur={ input.onBlur }
        containerProps={ {
          onBlur: (e) => !e.nativeEvent.relatedTarget && helper.setTouched(false),
        } }
        defaultValue={ meta.value }
        success={ meta.touched && !meta.error }
        error={ meta.touched && !!meta.error }
        className="capitalize">
        { options.map(option => (
          <Option
            key={ option.key || option.value }
            value={ option.value }
            className="capitalize">
            { option.label }
          </Option>
        )) }
      </Select>

      { meta.touched && meta.error && <Error text={ meta.error }/> }
    </>
  )
};