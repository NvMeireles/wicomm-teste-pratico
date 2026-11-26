// Estado do carrinho:
const STORAGE_KEY = 'amakha:cart'
const MAX_QUANTITY = 99

const clamp = (quantity) => Math.min(MAX_QUANTITY, Math.max(1, quantity))

const isValidItem = (item) =>
  item !== null &&
  typeof item === 'object' &&
  Number.isFinite(item.id) &&
  typeof item.name === 'string' &&
  Number.isFinite(item.price) &&
  Number.isInteger(item.quantity) &&
  item.quantity > 0


function defaultStorage() {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

export function createCart(storage = defaultStorage()) {
  const listeners = new Set()
  let items = load()

  function load() {
    try {
      const parsed = JSON.parse(storage?.getItem(STORAGE_KEY) ?? '[]')
      return Array.isArray(parsed) ? parsed.filter(isValidItem) : []
    } catch {
      return []                           // vazio
    }
  }

  function getState() {
    const count = items.reduce((total, item) => total + item.quantity, 0)
    // soma em centavos. sem o erro lá de ponto
    const cents = items.reduce((total, item) => total + Math.round(item.price * 100) * item.quantity, 0)

    return { items: items.map((item) => ({ ...item })), count, subtotal: cents / 100 }
  }


  function commit(nextItems) {
    items = nextItems

    try {
      storage?.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {

    }

    const state = getState()
    listeners.forEach((listener) => listener(state))
  }

  function setQuantity(id, quantity) {
    if (quantity <= 0) return remove(id)

    commit(items.map((item) => (item.id === id ? { ...item, quantity: clamp(quantity) } : item)))
  }

  function add(product, quantity = 1) {
    const existing = items.find((item) => item.id === product.id)
    if (existing) return setQuantity(product.id, existing.quantity + quantity)

    const { id, name, image, price } = product
    commit([...items, { id, name, image, price, quantity: clamp(quantity) }])
  }

  function remove(id) {
    commit(items.filter((item) => item.id !== id))
  }

  function clear() {
    commit([])
  }

  function subscribe(listener) {
    listeners.add(listener)
    listener(getState())
    return () => listeners.delete(listener)
  }

  return { add, remove, setQuantity, clear, subscribe, getState }
}
