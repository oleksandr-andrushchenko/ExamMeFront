import { Button, Card, CardBody, Dialog, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react'
import { ArrowRightEndOnRectangleIcon, UserPlusIcon } from '@heroicons/react/24/solid'
import { ReactNode, useState } from 'react'
import Register from './Register'
import Login from './Login'
import { useNavigate } from 'react-router-dom'

interface Props {
  register?: boolean
}

export default ({ register }: Props): ReactNode => {
  const [ open, setOpen ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const navigate = useNavigate()

  const [ activeTab, setActiveTab ] = useState<string>(register ? 'register' : 'login')
  const onLogin = () => {
    navigate(0)
  }
  const onRegister = () => {
    navigate(0)
  }
  const onCancel = () => {
    handleOpen()
  }
  const cancelButton = <Button type="reset" onClick={ onCancel }>Cancel</Button>
  const tabs = [
    {
      key: 'login',
      header: <div className="flex items-center gap-2"><ArrowRightEndOnRectangleIcon className="w-4 h-4"/> Login</div>,
      content: <Login onSubmit={ onLogin } buttons={ cancelButton } onRegisterClick={ () => setActiveTab('register') }/>,
    },
    {
      key: 'register',
      header: <div className="flex items-center gap-2"><UserPlusIcon className="w-4 h-4"/> Register</div>,
      content: <Register onSubmit={ onRegister } buttons={ cancelButton }/>,
    },
  ]

  return <>
    { register
      ? <Button onClick={ handleOpen }>
        <UserPlusIcon className="inline-block h-4 w-4"/> Register
      </Button>
      : <Button size="md" onClick={ handleOpen }>
        <ArrowRightEndOnRectangleIcon className="inline-block h-4 w-4"/> Login
      </Button> }
    <Dialog open={ open } handler={ handleOpen } className="text-left">
      <Card>
        <CardBody className="flex flex-col gap-4">
          <Tabs value={ activeTab }>
            <TabsHeader
              className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
              indicatorProps={ { className: 'bg-transparent border-b-2 border-gray-900 shadow-none rounded-none' } }>
              { tabs.map(({ key, header }): ReactNode => <Tab key={ key } value={ key }>{ header }</Tab>) }
            </TabsHeader>
            <TabsBody>
              { tabs.map(({ key, content }): ReactNode => <TabPanel key={ key } value={ key }>{ content }</TabPanel>) }
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </Dialog>
  </>
}