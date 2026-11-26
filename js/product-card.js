const INSTALLMENTS = 12

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 0,
})

// Recebe um produto e devolve o HTML do card.
export function createProductCard(product) {
  const installment = priceFormatter.format(product.price / INSTALLMENTS)

  return `
    <article class="product-card">
      <div class="product-card__media">
        <span class="product-card__badge">${product.discount}%</span>
        <button class="product-card__favorite" type="button" aria-label="Favoritar ${product.name}">
          <img src="images/heart.svg" alt="" width="14" height="14">
        </button>
        <img class="product-card__image" src="${product.image}" alt="${product.name}" width="170" height="170" loading="lazy">
        <button class="product-card__buy" type="button" data-add-to-cart="${product.id}">Comprar</button>
      </div>

      <div class="product-card__tags">
        <p class="product-card__coupon">CUPOM COM 15%OFF</p>
        <p class="product-card__campaign">DIA DO CONSUMIDOR</p>
        <p class="product-card__shipping">FRETE GRÁTIS</p>
      </div>

      <h3 class="product-card__name">${product.name}</h3>

      <div class="product-card__pricing">
        <p class="product-card__prices">
          <s class="product-card__old-price">${priceFormatter.format(product.oldPrice)}</s>
          <strong class="product-card__price">${priceFormatter.format(product.price)}</strong>
        </p>
        <p class="product-card__installments">${INSTALLMENTS}x ${installment} sem juros</p>
      </div>
    </article>
  `
}
