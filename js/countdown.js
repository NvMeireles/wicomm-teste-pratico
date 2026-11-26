// Data final da promoção (decisão: data fixa, registrada no README)
const TARGET_DATE = new Date('2026-12-31T23:59:59-03:00')

// Garante dois dígitos: 5 vira "05"
const pad = (value) => String(value).padStart(2, '0')

export function initCountdown() {
  const root = document.querySelector('[data-countdown]')
  if (!root) return

  const days = root.querySelector('[data-days]')
  const hours = root.querySelector('[data-hours]')
  const minutes = root.querySelector('[data-minutes]')
  const seconds = root.querySelector('[data-seconds]')

  function update() {
    // diferença em milissegundos; Math.max evita números negativos
    const diff = Math.max(0, TARGET_DATE - new Date())
    const total = Math.floor(diff / 1000)

    days.textContent = pad(Math.floor(total / 86400))
    hours.textContent = pad(Math.floor((total % 86400) / 3600))
    minutes.textContent = pad(Math.floor((total % 3600) / 60))
    seconds.textContent = pad(total % 60)
  }

  update()                       // mostra já, sem esperar 1 segundo
  setInterval(update, 1000)      // repete a cada segundo
}
