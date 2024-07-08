import { useField } from 'formik'
import Error from '../Error'
import { Option, Select } from '@material-tailwind/react'

export default function FormikSelect({ name, label, options }) {
  const [ input, meta, helper ] = useField(name)
  const { touched, value, error } = meta
  const { setTouched, setValue } = helper

  return (
    <div className="flex flex-col gap-2">
      <Select
        { ...input }
        name={ name }
        label={ label || name }
        onChange={ value => setValue(value) }
        containerProps={ {
          onBlur: (e) => !e.nativeEvent.relatedTarget && setTouched(false),
        } }
        defaultValue={ value }
        success={ touched && !error }
        error={ touched && !!error }
        className="capitalize"
      >
        { options.map(option => (
          <Option
            key={ option.key || option.value }
            value={ option.value }
            className="capitalize">
            { option.label }
          </Option>
        )) }
      </Select>

      { touched && error && <Error text={ error }/> }
    </div>
  )
};