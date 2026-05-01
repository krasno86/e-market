import { calculateCartTotals } from './calculations.js';

export const updateCartUI = (cart, productsMap) => {const totals = calculateCartTotals(cart, productsMap);

  document.querySelector('#cart-count').innerText = cart.reduce((sum, item) => sum + item.count, 0,);
  document.querySelector('#total-weight').textContent = totals.totalWeight.toFixed(2);
  document.querySelector('#sub-total').textContent = totals.subtotal.toFixed(2);
  document.querySelector('#tax-amount').textContent = totals.tax.toFixed(2);
  document.querySelector('#shipping-cost').textContent = totals.shipping;
  document.querySelector('#grand-total').textContent = totals.grandTotal.toFixed(2);

  const cartHTML = cart.map(cartItem => {
    const product = productsMap[cartItem.id];
    if (!product) return '';

    return `
  <div class="cart-item" data-id="${product.id}">
    <div class="cart-item-info">
      <span class="cart-item-name">${product.name}</span>
      <span class="cart-item-price">${product.price} € / шт.</span>
    </div>
    
    <div class="cart-item-controls">
      <button class="btn-minus" data-id="${product.id}">-</button>
      <span class="cart-item-count">${cartItem.count}</span>
      <button class="btn-plus" data-id="${product.id}">+</button>
    </div>

    <div class="cart-item-subtotal">
      ${(product.price * cartItem.count).toFixed(2)} €
    </div>

    <button class="btn-remove" data-id="${product.id}" title="Remove item">×</button>
  </div>
`;
  }).join('');

  document.querySelector('#cart-items-list').innerHTML = cartHTML;
};
