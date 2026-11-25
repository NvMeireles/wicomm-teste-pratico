import { initCountdown } from './countdown.js'
import { products } from './products.js'
import { createProductCard } from './product-card.js'
import { initCarousel } from './carousel.js'

initCountdown()

// Cada carrossel de produtos recebe os cards e depois ganha o comportamento
document.querySelectorAll('[data-product-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('[data-carousel-track]')
  track.innerHTML = products.map(createProductCard).join('')
  initCarousel(carousel)
})

document.querySelectorAll('[data-social-carousel]').forEach(initCarousel)