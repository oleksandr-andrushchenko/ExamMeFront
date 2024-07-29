import { Card, CardBody, CardFooter, Dialog, Typography } from '@material-tailwind/react'
import { ComponentProps, memo, ReactNode, useState } from 'react'
import { apiMutate } from '../../api/apolloClient'
import Error from '../Error'
import IconButton from '../elements/IconButton'
import Button from '../elements/Button'
import H3 from '../typography/H3'
import { Icon } from 'react-bootstrap-icons'

interface Props extends ComponentProps<any> {
  mutateOptionsFn: Function
  iconFn: Function | ReactNode | string | Icon
  labelFn: Function | ReactNode | string
  title: any
  body: any
  onSubmit?: Function
  iconButton?: boolean
}

const ConfirmDialog = ({ mutateOptionsFn, iconFn, labelFn, title, body, onSubmit, iconButton }: Props) => {
  const [ isOpened, setOpened ] = useState<boolean>(false)
  const [ isSubmitting, setSubmitting ] = useState<boolean>(false)
  const handleOpen = () => setOpened(!isOpened)
  const [ error, setError ] = useState<string>('')

  const onClick = () => {
    apiMutate(
      mutateOptionsFn(),
      data => {
        setOpened(false)
        onSubmit && onSubmit(data)
      },
      setError,
      setSubmitting,
    )
  }

  const icon = typeof iconFn === 'function' ? iconFn(isSubmitting) : iconFn
  const label = typeof labelFn === 'function' ? labelFn(isSubmitting) : labelFn

  return <>
    { iconButton
      ? <IconButton icon={ icon } tooltip={ label } onClick={ handleOpen } disabled={ isSubmitting }/>
      : <Button icon={ icon } label={ label } onClick={ handleOpen } disabled={ isSubmitting }/> }
    <Dialog open={ isOpened } handler={ handleOpen }>
      <Card>
        <CardBody className="flex flex-col gap-4">
          <H3>{ title }</H3>

          <Typography className="mb-3" variant="paragraph">{ body }</Typography>

          { error && <Error text={ error } simple/> }
        </CardBody>

        <CardFooter className="pt-0">
          <Button label="Cancel" onClick={ handleOpen }/>{ ' ' }
          <Button icon={ icon } label={ label } size="md" onClick={ onClick } disabled={ isSubmitting }/>
        </CardFooter>
      </Card>
    </Dialog>
  </>
}

export default memo(ConfirmDialog)