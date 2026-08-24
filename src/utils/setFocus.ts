interface SetFocusOptions {
  onBeforeFocus?: () => void
  onBlur?: () => void
}

// Mirrors govuk-frontend's common/setFocus helper: tabindex="-1" is only
// applied for the duration of the focus (and removed again on blur) rather
// than left permanently in the DOM, so elements aren't left looking
// unexpectedly focusable to devtools/AT tooling once focus has moved on.
export const setFocus = (element: HTMLElement, options: SetFocusOptions = {}) => {
  const isFocusable = element.hasAttribute('tabindex')

  if (!isFocusable) {
    element.setAttribute('tabindex', '-1')
  }

  const onBlur = () => {
    options.onBlur?.()
    if (!isFocusable) {
      element.removeAttribute('tabindex')
    }
  }

  element.addEventListener(
    'focus',
    () => {
      element.addEventListener('blur', onBlur, { once: true })
    },
    { once: true }
  )

  options.onBeforeFocus?.()
  element.focus()
}
