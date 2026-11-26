const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function initNewsletter() {
  const form = document.querySelector('[data-newsletter]')
  if (!form) return

  const feedback = form.querySelector('[data-newsletter-feedback]')
  const nameInput = form.querySelector('[name="name"]')
  const emailInput = form.querySelector('[name="email"]')

  function show(message, isError = false) {
    feedback.textContent = message
    feedback.classList.toggle('is-error', isError)
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    // Valida na ordem em que o usuário preenche 
    const invalid = !nameInput.value.trim()
      ? [nameInput, 'Informe seu nome.']
      : !EMAIL_PATTERN.test(emailInput.value.trim())
        ? [emailInput, 'Informe um e-mail válido.']
        : null

    nameInput.removeAttribute('aria-invalid')
    emailInput.removeAttribute('aria-invalid')

    if (invalid) {
      const [field, message] = invalid
      field.setAttribute('aria-invalid', 'true')
      field.focus()
      show(message, true)
      return
    }

    //  formulario so pra confirmar o cadastro sem o backend
    form.reset()
    show('Cadastro realizado! Obrigado.')
  })
}