import { initCountdown } from './countdown.js'
import { products } from './products.js'
import { createProductCard } from './product-card.js'
import { initCarousel } from './carousel.js'
import { initNewsletter } from './newsletter.js'
import { initFooter } from './footer.js'
import { createCart } from './cart.js'
import { initMiniCart } from './mini-cart.js'
import { initMenu } from './menu.js'

initCountdown()
initNewsletter()
initFooter()
initMiniCart(createCart(), products)
initMenu()

// Cada carrossel de produtos recebe os cards e depois ganha o comportamento
document.querySelectorAll('[data-product-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('[data-carousel-track]')
  track.innerHTML = products.map(createProductCard).join('')
  initCarousel(carousel)
})

document.querySelectorAll('[data-social-carousel]').forEach(initCarousel)