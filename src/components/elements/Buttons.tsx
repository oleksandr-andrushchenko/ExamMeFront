import { ComponentProps, memo } from 'react'

interface Props extends ComponentProps<any> {
  className?: string
  buttons: Record<string, any>
}

const Buttons = ({ className = '', buttons }: Props) => {
  return (
    <div className={ `flex gap-1 items-center ${ className }` }>
      { Object.entries(buttons).filter(([ _, button ]) => !!button)
        .map(([ key, button ]) => <span key={ key }>{ button }</span>) }
    </div>
  )
}

export default memo(Buttons)