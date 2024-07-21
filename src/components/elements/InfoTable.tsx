import { memo } from 'react'
import Spinner from '../Spinner'

interface Props {
  columns: string[]
  source: object | undefined
  mapper: Function
}

const InfoTable = ({ columns, source, mapper }: Props) => {
  const data = source ? mapper(source) : undefined

  return (
    <table className="w-full table-auto text-left text-sm">
      <tbody>
      { columns.map((column, index) => (
        <tr key={ column }>
          <th className="w-2/12">{ column }</th>
          <td>{ data ? data[index] : <Spinner type="text"/> }</td>
        </tr>
      )) }
      </tbody>
    </table>
  )
}

export default memo(InfoTable)