// Menu mobile (drawer lateral).
const DESKTOP = window.matchMedia('(min-width: 1100px)')


const BACKGROUND = '.announcement-bar, .header__top, main, footer'

export function initMenu() {
  const menu = document.querySelector('[data-menu]')
  const overlay = document.querySelector('[data-menu-overlay]')
  const opener = document.querySelector('[data-menu-open]')
  if (!menu || !overlay || !opener) return

  const closeButton = menu.querySelector('[data-menu-close]')

  function setOpen(open, { restoreFocus = true } = {}) {
    menu.classList.toggle('is-open', open)
    overlay.classList.toggle('is-open', open)
    opener.setAttribute('aria-expanded', String(open))
    document.querySelectorAll(BACKGROUND).forEach((element) => { element.inert = open })

    if (open) closeButton.focus()
    else if (restoreFocus) opener.focus()
  }

  const isOpen = () => menu.classList.contains('is-open')

  opener.addEventListener('click', () => setOpen(true))
  closeButton.addEventListener('click', () => setOpen(false))
  overlay.addEventListener('click', () => setOpen(false))

  // fechar menu
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false, { restoreFocus: false })
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) setOpen(false)
  })

  // janela como desktop, volta tudo
  DESKTOP.addEventListener('change', (event) => {
    if (event.matches && isOpen()) setOpen(false, { restoreFocus: false })
  })
}