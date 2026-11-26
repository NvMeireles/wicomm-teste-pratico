const FREE_SHIPPING_FROM = 199.9          // mesmo valor da barra de anúncio

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function createItem(item) {
  return `
    <li class="cart-item">
      <img class="cart-item__image" src="${item.image}" alt="" width="72" height="72">

      <div class="cart-item__info">
        <h3 class="cart-item__name">${item.name}</h3>
        <p class="cart-item__price">${currency.format(item.price * item.quantity)}</p>

        <div class="cart-item__quantity" role="group" aria-label="Quantidade de ${item.name}">
          <button type="button" aria-label="Diminuir quantidade" data-cart-decrease="${item.id}">−</button>
          <output aria-live="polite">${item.quantity}</output>
          <button type="button" aria-label="Aumentar quantidade" data-cart-increase="${item.id}">+</button>
        </div>
      </div>

      <button class="cart-item__remove" type="button" aria-label="Remover ${item.name} do carrinho" data-cart-remove="${item.id}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5"/></svg>
      </button>
    </li>
  `
}

export function initMiniCart(cart, products) {
  const dialog = document.querySelector('[data-mini-cart]')
  if (!dialog) return

  const list = dialog.querySelector('[data-cart-items]')
  const empty = dialog.querySelector('[data-cart-empty]')
  const content = dialog.querySelector('[data-cart-content]')
  const subtotal = dialog.querySelector('[data-cart-subtotal]')
  const shipping = dialog.querySelector('[data-cart-shipping]')
  const progress = dialog.querySelector('[data-cart-progress]')
  const checkoutNote = dialog.querySelector('[data-checkout-note]')
  const badges = document.querySelectorAll('[data-cart-count]')
  const openers = document.querySelectorAll('[data-open-cart]')

  function render({ items, count, subtotal: total }) {

    badges.forEach((badge) => {
      badge.textContent = count > 99 ? '99+' : count
      badge.hidden = count === 0
    })

    openers.forEach((button) => {
      button.setAttribute('aria-label', `Abrir carrinho, ${count} ${count === 1 ? 'item' : 'itens'}`)
    })

    empty.hidden = count > 0
    content.hidden = count === 0
    list.innerHTML = items.map(createItem).join('')
    subtotal.textContent = currency.format(total)


    const missing = FREE_SHIPPING_FROM - total
    shipping.textContent = missing > 0
      ? `Faltam ${currency.format(missing)} para você ganhar frete grátis!`
      : 'Parabéns! Você ganhou frete grátis.'
    progress.style.setProperty('--progress', `${Math.min(100, (total / FREE_SHIPPING_FROM) * 100)}%`)
  }

  cart.subscribe(render)


  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-to-cart]')
    if (!button) return

    const product = products.find((item) => item.id === Number(button.dataset.addToCart))
    if (!product) return

    cart.add(product)
    checkoutNote.hidden = true
    if (!dialog.open) dialog.showModal()
  })

  openers.forEach((button) => button.addEventListener('click', () => dialog.showModal()))


  list.addEventListener('click', (event) => {
    const button = event.target.closest('button')
    if (!button) return

    const { cartIncrease, cartDecrease, cartRemove } = button.dataset
    const action = cartIncrease ? 'increase' : cartDecrease ? 'decrease' : 'remove'
    const id = Number(cartIncrease ?? cartDecrease ?? cartRemove)
    const item = cart.getState().items.find((entry) => entry.id === id)
    if (!item) return

    if (action === 'increase') cart.setQuantity(id, item.quantity + 1)
    if (action === 'decrease') cart.setQuantity(id, item.quantity - 1)
    if (action === 'remove') cart.remove(id)


    const target = list.querySelector(`[data-cart-${action}="${id}"]`)
      ?? list.querySelector('button')
      ?? dialog.querySelector('[data-close-cart]')
    target.focus()
  })

  dialog.querySelectorAll('[data-close-cart]').forEach((button) => {
    button.addEventListener('click', () => dialog.close())
  })


  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close()
  })

  dialog.querySelector('[data-checkout]').addEventListener('click', () => {
    checkoutNote.hidden = false
  })
}
