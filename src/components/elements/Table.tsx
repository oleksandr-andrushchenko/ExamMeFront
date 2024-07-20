import { useSearchParams } from 'react-router-dom'
import { ButtonGroup, Input, Option, Select, Tab, Tabs, TabsHeader } from '@material-tailwind/react'
import { memo, useEffect, useState } from 'react'
import Paginated from '../../schema/pagination/Paginated'
import IconButton from './IconButton'
import urlSearchParamsToPlainObject from '../../utils/urlSearchParamsToPlainObject'
import { apiQuery } from '../../api/apolloClient'
import Error from '../Error'
import Spinner from '../Spinner'
import {
  ArrowLeftIcon as PrevIcon,
  ArrowRightIcon as NextIcon,
  MagnifyingGlassIcon as SearchIcon,
} from '@heroicons/react/24/solid'
import Button from './Button'

const Table = (
  {
    key2,
    defaultSearchParams = { size: '20' },
    queryOptions,
    queryData,
    buttons = [],
    tabs = [],
    filters = [],
    columns = [],
    mapper,
  },
) => {
  const [ isLoading, setLoading ] = useState<boolean>(true)
  const [ searchParams, setSearchParams ] = useSearchParams(defaultSearchParams)
  const [ items, setItems ] = useState<Paginated>()
  const [ error, setError ] = useState<string>('')

  const applySearchParams = (partialQueryParams = {}) => {
    setItems(undefined)

    searchParams.delete('prevCursor')
    searchParams.delete('nextCursor')

    for (const key in partialQueryParams) {
      if (partialQueryParams[key] === undefined || partialQueryParams[key] === '') {
        searchParams.delete(key)
      } else {
        searchParams.set(key, partialQueryParams[key])
      }
    }

    searchParams.sort()

    setSearchParams(searchParams)
  }
  const clearSearchParams = () => {
    setItems(undefined)

    setSearchParams(defaultSearchParams)
  }

  const showClear = (): boolean => {
    const def = new URLSearchParams(defaultSearchParams)
    def.sort()
    searchParams.sort()

    return def.toString() !== searchParams.toString()
  }

  useEffect(() => {
    apiQuery(
      queryOptions(urlSearchParamsToPlainObject(searchParams)),
      data => setItems(queryData(data)),
      setError,
      setLoading,
    )
  }, [ searchParams, key2 ])

  return <div className={ key2 }>
    { error && <Error text={ error }/> }

    <div className="flex gap-1 items-center mt-4">
      { Object.entries(buttons).filter(([ key, button ]) => !!button)
        .map(([ key, button ]) => <span key={ key }>{ button }</span>) }
    </div>

    <div className="flex gap-1 items-center mt-4">
      { (tabs.length > 0) && (
        <Tabs value="all" className="min-w-[170px]">
          <TabsHeader>
            { tabs.map(value => (
              <Tab
                key={ value }
                value={ value }
                className="text-xs small text-small"
                onClick={ () => applySearchParams({ price: value === 'all' ? undefined : value }) }
              >
                { value }
              </Tab>
            )) }
          </TabsHeader>
        </Tabs>
      ) }

      { Object.entries(filters).map(([ key, filter ]) => (
        <span key={ key }>{ typeof filter === 'function' ? filter(searchParams, applySearchParams) : filter }</span>
      )) }

      <Input
        label="Search"
        value={ searchParams.get('search') || '' }
        onChange={ (e) => applySearchParams({ search: e.target.value }) }
        icon={ <SearchIcon className="h-4 w-4"/> }
      />

      <Select
        label="Size"
        onChange={ (size: string) => applySearchParams({ size }) }
        value={ searchParams.get('size') || '' }
        className="capitalize"
      >
        { [ 1, 5, 10, 20, 30, 40, 50 ].map((size: number) => (
          <Option
            key={ size }
            value={ `${ size }` }
            disabled={ `${ size }` === searchParams.get('size') }>
            { size }
          </Option>
        )) }
      </Select>

      { items && ((items.meta.prevCursor || items.meta.nextCursor) &&
        <ButtonGroup variant="outlined">
          <IconButton icon={ PrevIcon } onClick={ () => applySearchParams({ prevCursor: items?.meta.prevCursor }) }
                      disabled={ !items.meta.prevCursor }/>
          <IconButton icon={ NextIcon } onClick={ () => applySearchParams({ nextCursor: items?.meta.nextCursor }) }
                      disabled={ !items.meta.nextCursor }/>
        </ButtonGroup>) }

      { showClear() && <div><Button label="Clear" variant="outlined" onClick={ clearSearchParams }/></div> }
    </div>

    <table className="w-full table-auto text-left text-sm mt-4">
      <thead>
      <tr>{ columns.map((head) => <th key={ head }>{ head }</th>) }</tr>
      </thead>
      <tbody>
      { isLoading && <tr>
        <td colSpan={ columns.length } className="p-5 text-center">
          <Spinner type="text" width="w-full"/>
          <Spinner type="text" width="w-full"/>
          <Spinner type="text" width="w-full"/>
        </td>
      </tr> }
      { !isLoading && items && items.data.length === 0 && <tr>
        <td colSpan={ columns.length } className="p-5 text-center">No data</td>
      </tr> }
      { !isLoading && items && items.data && items.data.map((item, index) => {
        try {
          const values = mapper(item, index)
          const key = values.shift()

          return (
            <tr key={ `${ key }-${ index }` }>
              { values.map((value, index2) => <td key={ `${ index }-${ index2 }` }>{ value }</td>) }
            </tr>
          )
        } catch (error) {
          return <tr key={ Math.random() }></tr>
        }
      }) }
      </tbody>
    </table>
  </div>
}

export default memo(Table)