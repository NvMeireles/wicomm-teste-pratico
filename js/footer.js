
export function initFooter() {
  const button = document.querySelector('[data-footer-more]')
  if (!button) return

  const text = document.getElementById(button.getAttribute('aria-controls'))

  button.addEventListener('click', () => {
    const expanded = text.classList.toggle('is-expanded')
    button.setAttribute('aria-expanded', String(expanded))
    button.textContent = expanded ? 'Ver menos' : 'Ver mais'
  })
}
