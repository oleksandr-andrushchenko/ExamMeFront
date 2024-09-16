import { ComponentProps, memo } from 'react'
import Spinner from '../Spinner'

interface Props extends ComponentProps<any> {
  className?: string
  title?: string
  columns: string[]
  source: object | undefined
  mapper: Function
  key2?: number
}

const InfoTable = ({ className = '', title, columns, source, mapper, key2 = 1 }: Props) => {
  const data = source ? mapper(source) : {}

  return (
    <table className={ `w-full table-auto text-left text-sm ${ className }` }>
      { title && <legend>{ title }</legend> }
      <tbody>
      { columns.map((column, index) => (
        <tr key={ `${ column }-${ data[index] ?? '' }-${ key2 }` }>
          <th className="w-2/12">{ column }</th>
          <td>{ data ? data[index] : <Spinner type="text"/> }</td>
        </tr>
      )) }
      </tbody>
    </table>
  )
}

export default memo(InfoTable)