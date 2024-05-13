export default interface InputState {
  value: any
  focused: boolean
  error: string
  displayError: boolean
}

export const defaultInputState: InputState = {
  value: '',
  focused: false,
  error: '',
  displayError: false,
}