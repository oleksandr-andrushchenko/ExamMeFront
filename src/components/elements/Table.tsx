import { useSearchParams } from 'react-router-dom'
import { ButtonGroup, Input, Option, Select, Tab, Tabs, TabsHeader, Typography } from '@material-tailwind/react'
import { ComponentProps, memo, useEffect, useState } from 'react'
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
import Buttons from './Buttons'

interface Props extends ComponentProps<any> {
  className?: string
  key2: string | number | undefined
  buttons?: Record<string, any>
  tabs: Record<string, any>
  filters?: Record<string, any>
  defaultSearchParams?: Record<string, any>
  queryOptions: Function
  queryData: Function
  mapper: Function
  columns: string[]
}

const Table = (
  {
    className = '',
    key2,
    defaultSearchParams = { size: '20' },
    queryOptions,
    queryData,
    buttons = {},
    tabs = {},
    filters = {},
    columns = [],
    mapper,
  }: Props,
) => {
  const [ isLoading, setLoading ] = useState<boolean>(true)
  const [ searchParams, setSearchParams ] = useSearchParams()
  const [ items, setItems ] = useState<Paginated<any>>()
  const [ error, setError ] = useState<string>('')

  const applySearchParams = (partialQueryParams: Record<string, any>) => {
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

    setSearchParams()
  }

  const showClear = (): boolean => searchParams.toString() !== ''

  useEffect(() => {
    const filter = { ...defaultSearchParams, ...urlSearchParamsToPlainObject(searchParams) }

    if ('size' in filter) {
      filter.size = +filter.size
    }

    apiQuery(
      queryOptions(filter),
      async (data) => setItems(await queryData(data, { setError, setLoading })),
      setError,
      setLoading,
    )
  }, [ searchParams, key2 ])

  return <div className={ className }>
    { error && <Error text={ error }/> }

    { (Object.values(buttons).filter((button: any) => !!button).length > 0) && <Buttons buttons={ buttons }/> }

    { (Object.keys(tabs).length > 0) && (
      <div className="flex gap-5 items-center mt-4">
        { Object.entries(tabs).map(([ filter, values ]) => (
          <div key={ filter } className="flex gap-2 items-center">
            <Typography variant="small">{ filter }:</Typography>
            <Tabs value={ searchParams.get(filter) || 'all' }>
              <TabsHeader>
                { [ 'all', ...values ].map(value => (
                  <Tab
                    key={ value }
                    value={ value }
                    className="text-xs small text-small"
                    onClick={ () => applySearchParams({ [filter]: value === 'all' ? undefined : value }) }
                  >
                    { value }
                  </Tab>
                )) }
              </TabsHeader>
            </Tabs>
          </div>
        )) }
      </div>
    ) }

    <div className="flex gap-1 items-center mt-4">
      { filters && Object.entries(filters).map(([ filter, values ]) => {
        return (
          <Select
            key={ `${ filter }-${ Object.keys(values).join('') }` }
            label={ filter }
            onChange={ value => applySearchParams({ [filter]: value === '' ? undefined : value }) }
            value={ searchParams.get(filter) || '' }
            className="min-w-[200px] capitalize"
            containerProps={ { className: 'min-w-[200px]' } }
          >
            { Object.entries({ '': 'all', ...values }).map(([ value, label ]) => {
              return (
                <Option
                  key={ `${ filter }-${ value }` }
                  value={ value }
                  disabled={ value === searchParams.get(filter) }
                  className="capitalize"
                >
                  { label }
                </Option>
              )
            }) }
          </Select>
        )
      }) }

      <Input
        label="Search"
        value={ searchParams.get('search') || '' }
        onChange={ (e) => applySearchParams({ search: e.target.value === '' ? undefined : e.target.value }) }
        icon={ <SearchIcon className="h-4 w-4"/> }
      />

      <Select
        label="Size"
        onChange={ (size?: string) => applySearchParams({ size: size === defaultSearchParams['size'] ? undefined : size }) }
        value={ searchParams.get('size') || defaultSearchParams['size'] }
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
          <Spinner type="text" width="w-full"/>
          <Spinner type="text" width="w-full"/>
          <Spinner type="text" width="w-full"/>
          <Spinner type="text" width="w-full"/>
        </td>
      </tr> }
      { !isLoading && items && items.data.length === 0 && <tr>
        <td colSpan={ columns.length } className="p-5 text-center">No data</td>
      </tr> }
      { !isLoading && items && items.data && items.data.map((item, index) => {
        const values: [] = mapper(item, index)
        const key = values.shift()
        const controls = values.pop() as object

        return (
          <tr key={ `${ key }-${ index }` }>
            { values.map((value, index2) => <td key={ `${ index }-${ index2 }` }>{ value }</td>) }
            <td className="flex justify-end gap-1">
              { Object.entries(controls).filter(([ _, control ]) => !!control)
                .map(([ key, control ]) => <span key={ key }>{ control }</span>) }
            </td>
          </tr>
        )
      }) }
      </tbody>
    </table>
  </div>
}

export default memo(Table)