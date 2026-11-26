export function initCarousel(root) {
  const track = root.querySelector('[data-carousel-track]')
  const prev = root.querySelector('[data-carousel-prev]')
  const next = root.querySelector('[data-carousel-next]')
  const dotsBox = root.querySelector('[data-carousel-dots]')

  const pageCount = () => Math.max(1, Math.ceil((track.scrollWidth - 1) / track.clientWidth))

  function goToPage(page) {
    track.scrollTo({ left: page * track.clientWidth, behavior: 'smooth' })
  }

  function update() {
    const page = Math.round(track.scrollLeft / track.clientWidth)

     dotsBox?.querySelectorAll('.carousel__dot').forEach((dot, index) => {
      dot.classList.toggle('is-active', index === page)
      dot.toggleAttribute('aria-current', index === page)
    })

    prev.disabled = track.scrollLeft <= 0
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1
  }

  function renderDots() {
    if (!dotsBox) return update()
    dotsBox.innerHTML = Array.from({ length: pageCount() }, (_, index) =>
      `<button class="carousel__dot" type="button" aria-label="Ir para a página ${index + 1}" data-page="${index}"></button>`
    ).join('')
    update()
  }

  prev.addEventListener('click', () => track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' }))
  next.addEventListener('click', () => track.scrollBy({ left: track.clientWidth, behavior: 'smooth' }))

  // Um único listener no container serve para todas as bolinhas (event delegation)
  dotsBox?.addEventListener('click', (event) => {
    const dot = event.target.closest('[data-page]')
    if (dot) goToPage(Number(dot.dataset.page))
  })

  track.addEventListener('scroll', () => requestAnimationFrame(update))
  window.addEventListener('resize', renderDots)

  renderDots()
}
