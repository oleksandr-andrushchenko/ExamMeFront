import { Card, CardBody, Dialog, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react'
import { ArrowRightEndOnRectangleIcon, UserPlusIcon } from '@heroicons/react/24/solid'
import { memo, useEffect, useState } from 'react'
import Register from './Register'
import Login from './Login'
import { useNavigate } from 'react-router-dom'
import Button from './elements/Button'
import Text from './typography/Text'

interface Props {
  register?: boolean
  dialogOnly?: boolean
  onClose?: () => void
}

const Auth = ({ register, dialogOnly, onClose }: Props) => {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ listenClose, setListenClose ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const navigate = useNavigate()

  const [ activeTab, setActiveTab ] = useState<string>(register ? 'register' : 'login')
  const cancelButton = <Button label="Cancel" type="reset" onClick={ handleOpen }/>
  const tabs = [
    {
      key: 'login',
      header: <Text icon={ ArrowRightEndOnRectangleIcon } label="Login"/>,
      content: <Login onSubmit={ () => navigate(0) } buttons={ cancelButton } onRegisterClick={ () => setActiveTab('register') }/>,
    },
    {
      key: 'register',
      header: <Text icon={ UserPlusIcon } label="Register"/>,
      content: <Register onSubmit={ () => navigate(0) } buttons={ cancelButton }/>,
    },
  ]

  useEffect(() => {
    dialogOnly && setTimeout(() => {
      setOpen(true)
      setListenClose(true)
    }, 1)
  }, [])

  useEffect(() => {
    !open && listenClose && onClose && setTimeout(onClose, 500)
  }, [ open ])

  return <>
    { !dialogOnly && (register
      ? <Button icon={ UserPlusIcon } label="Register" onClick={ handleOpen }/>
      : <Button icon={ ArrowRightEndOnRectangleIcon } label="Login" size="md" onClick={ handleOpen }/>) }
    <Dialog open={ open } handler={ handleOpen } className="text-left">
      <Card>
        <CardBody className="flex flex-col gap-4">
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