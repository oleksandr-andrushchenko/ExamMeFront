import { Button, Card, CardBody, Dialog, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react'
import { ArrowRightEndOnRectangleIcon, UserPlusIcon } from '@heroicons/react/24/solid'
import { createElement, ReactNode, useState } from 'react'
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
  const cancelButton = <Button type="reset" onClick={ handleOpen }>Cancel</Button>
  const tabs = [
    {
      label: 'Login',
      value: 'login',
      icon: ArrowRightEndOnRectangleIcon,
      content: <Login
        onSubmit={ () => navigate(0) }
        buttons={ cancelButton }
        onRegisterClick={ () => setActiveTab('register') }/>,
    },
    {
      label: 'Register',
      value: 'register',
      icon: UserPlusIcon,
      content: <Register
        onSubmit={ () => navigate(0) }
        buttons={ cancelButton }/>,
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
              { tabs.map(({ label, value, icon }): ReactNode => (
                <Tab key={ value } value={ value }>
                  <div className="flex items-center gap-2">
                    { createElement(icon, { className: 'w-4 h-4' }) }
                    { label }
                  </div>
                </Tab>
              )) }
            </TabsHeader>
            <TabsBody>
              { tabs.map(({ value, content }): ReactNode => (
                <TabPanel key={ value } value={ value }>
                  { content }
                </TabPanel>
              )) }
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </Dialog>
  </>
}