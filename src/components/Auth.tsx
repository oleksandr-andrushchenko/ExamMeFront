import { Card, CardBody, Dialog, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react'
import { ArrowRightEndOnRectangleIcon, UserPlusIcon } from '@heroicons/react/24/solid'
import { memo, ReactNode, useState } from 'react'
import Register from './Register'
import Login from './Login'
import { useNavigate } from 'react-router-dom'
import Button from './elements/Button'
import Text from './typography/Text'
import IconButton from './elements/IconButton'

interface Props {
  button?: {
    icon?: any
    label?: any
    size?: any
    color?: string
    iconOnly?: boolean
  }
  dialog?: {
    label?: string | ReactNode
  }
  register?: boolean
  onSubmit?: () => void
}

const Auth = ({ button, dialog, register, onSubmit }: Props) => {
  const [ open, setOpen ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const navigate = useNavigate()

  const [ activeTab, setActiveTab ] = useState<string>(register ? 'register' : 'login')
  const buttons = [ <Button label="Cancel" type="reset" onClick={ handleOpen }/> ]
  const _onSubmit = onSubmit || (() => navigate(0))
  const tabs = [
    {
      key: 'login',
      header: <Text icon={ ArrowRightEndOnRectangleIcon } label="Login"/>,
      content: <Login onSubmit={ _onSubmit } buttons={ buttons } onRegisterClick={ () => setActiveTab('register') }/>,
    },
    {
      key: 'register',
      header: <Text icon={ UserPlusIcon } label="Register"/>,
      content: <Register onSubmit={ _onSubmit } buttons={ buttons }/>,
    },
  ]

  const icon = button?.icon || (register ? UserPlusIcon : ArrowRightEndOnRectangleIcon)
  const label = button?.label || (register ? 'Register' : 'Login')
  const size = button?.size || (register ? 'sm' : 'md')
  const color = button?.color
  const iconOnly = button?.iconOnly

  const buildButton = (props = {}) => {
    if (iconOnly) {
      return <IconButton icon={ icon } tooltip={ label } size={ size } color={ color } onClick={ handleOpen } { ...props }/>
    }

    return <Button icon={ icon } label={ label } size={ size } color={ color } onClick={ handleOpen } { ...props }/>
  }

  return <>
    { buildButton() }
    <Dialog open={ open } handler={ handleOpen } className="text-left">
      <Card>
        <CardBody className="flex flex-col gap-4">
          { dialog?.label || '' }
          <Tabs value={ activeTab }>
            <TabsHeader
              className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
              indicatorProps={ { className: 'bg-transparent border-b-2 border-gray-900 shadow-none rounded-none' } }
            >
              { tabs.map(({ key, header }) => <Tab key={ key } value={ key }>{ header }</Tab>) }
            </TabsHeader>
            <TabsBody>
              { tabs.map(({ key, content }) => <TabPanel key={ key } value={ key }>{ content }</TabPanel>) }
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </Dialog>
  </>
}

export default memo(Auth)