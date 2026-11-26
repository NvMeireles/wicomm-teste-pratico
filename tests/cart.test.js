import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createCart } from '../js/cart.js'

// Storage falso em memória, com a mesma interface do localStorage
function memoryStorage(initial = {}) {
  const data = { ...initial }
  return {
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => { data[key] = String(value) },
  }
}

const athena = { id: 1, name: 'Athena', image: 'a.webp', price: 255 }
const fortune = { id: 2, name: 'Fortune', image: 'f.webp', price: 99.9 }

test('começa vazio', () => {
  const { count, subtotal, items } = createCart(memoryStorage()).getState()
  assert.deepEqual([count, subtotal, items.length], [0, 0, 0])
})

test('adicionar o mesmo produto soma a quantidade em vez de duplicar a linha', () => {
  const cart = createCart(memoryStorage())
  cart.add(athena)
  cart.add(athena)

  const { items, count } = cart.getState()
  assert.equal(items.length, 1)
  assert.equal(items[0].quantity, 2)
  assert.equal(count, 2)
})

test('subtotal soma em centavos, sem erro de ponto flutuante', () => {
  const cart = createCart(memoryStorage())
  cart.add({ id: 3, name: 'A', image: '', price: 0.1 })
  cart.add({ id: 4, name: 'B', image: '', price: 0.2 })

  assert.equal(cart.getState().subtotal, 0.3)
})

test('setQuantity altera a quantidade e zero remove o item', () => {
  const cart = createCart(memoryStorage())
  cart.add(athena)
  cart.setQuantity(1, 5)
  assert.equal(cart.getState().items[0].quantity, 5)

  cart.setQuantity(1, 0)
  assert.equal(cart.getState().items.length, 0)
})

test('limita a quantidade máxima por item em 99', () => {
  const cart = createCart(memoryStorage())
  cart.add(athena, 500)
  assert.equal(cart.getState().items[0].quantity, 99)
})

test('remove só o item pedido', () => {
  const cart = createCart(memoryStorage())
  cart.add(athena)
  cart.add(fortune)
  cart.remove(1)

  assert.deepEqual(cart.getState().items.map((item) => item.id), [2])
})

test('persiste no storage e recarrega em um novo carrinho', () => {
  const storage = memoryStorage()
  createCart(storage).add(athena, 2)

  const reloaded = createCart(storage)
  assert.equal(reloaded.getState().count, 2)
  assert.equal(reloaded.getState().subtotal, 510)
})

test('ignora dados corrompidos ou inválidos no storage', () => {
  assert.equal(createCart(memoryStorage({ 'amakha:cart': '{quebrado' })).getState().count, 0)
  assert.equal(createCart(memoryStorage({ 'amakha:cart': '[{"id":"x"}]' })).getState().count, 0)
})

test('funciona mesmo sem storage disponível', () => {
  const cart = createCart(null)
  cart.add(athena)
  assert.equal(cart.getState().count, 1)
})

test('subscribe recebe o estado atual, as mudanças e permite cancelar', () => {
  const cart = createCart(memoryStorage())
  const received = []
  const unsubscribe = cart.subscribe((state) => received.push(state.count))

  cart.add(athena)
  unsubscribe()
  cart.add(athena)

  assert.deepEqual(received, [0, 1])
})

test('getState devolve cópias: alterar o resultado não altera o carrinho', () => {
  const cart = createCart(memoryStorage())
  cart.add(athena)
  cart.getState().items[0].quantity = 50

  assert.equal(cart.getState().items[0].quantity, 1)
})