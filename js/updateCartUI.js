import { calculateCartTotals } from './calculations.js';

export const updateCartUI = (cart, productsMap) => {
  const totals = calculateCartTotals(cart, productsMap);
  document.querySelector('#cart-count').innerText = cart.reduce((sum, item) => sum + item.count, 0,);
  document.querySelector('#total-weight').textContent = totals.totalWeight.toFixed(2);
  document.querySelector('#sub-total').textContent = totals.subtotal.toFixed(2);
  document.querySelector('#tax-amount').textContent = totals.tax.toFixed(2);
  document.querySelector('#shipping-cost').textContent = totals.shipping;
  document.querySelector('#grand-total').textContent = totals.grandTotal.toFixed(2);
};
