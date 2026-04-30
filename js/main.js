import { fetchProducts } from './api.js';
import { getCart, getProductsCount, saveToStorage } from './storage.js';

const container = document.querySelector('#catalog');
let productsCount = getProductsCount();
let cart = getCart()
let cartEl = document.querySelector('#cart-count');
cartEl.innerText = productsCount;

const renderProducts = (products) => {
  container.innerHTML = products
    .map((pr) => {
      const imageHtml= pr.image ? `<img src="${pr.image}" alt="${pr.name}" onerror="this.style.display='none'">` : '';

      return `
        <article class="product-card">
            ${imageHtml}
            <div class="category">${pr.category}</div>
            <h3>${pr.name}</h3>
            <div class="price">${pr.price} €</div>
            <button class="buy-btn" data-id="${pr.id}">Add to Cart</button>
        </article>
      `;
    })
    .join('');
};

const updateCart = (products, cartProducts) => {
  let subtotal = 0;
  let totalWeight = 0;
  const productsMap = products.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

  cartProducts.forEach((cartItem) => {
    const product = productsMap[cartItem.id];
    if (product) {
      subtotal += product.price * cartItem.count;
      totalWeight += product.weight * cartItem.count;
    }
  });

  const tax = subtotal * 0.19;
  let shipping = 0;
  if (totalWeight > 0 && totalWeight < 1) shipping = 5;
  else if (totalWeight >= 1) shipping = 15;
  const grandTotal = subtotal + tax + shipping;
  document.querySelector('#total-weight').textContent = totalWeight.toFixed(2);
  document.querySelector('#shipping-cost').textContent = shipping;
  document.querySelector('#sub-total').textContent = subtotal.toFixed(2);
  document.querySelector('#tax-amount').textContent = tax.toFixed(2);
  document.querySelector('#grand-total').innerText = grandTotal.toFixed(2);

}

const init = async () => {
  try {
    const products = await fetchProducts();
    renderProducts(products);
    updateCart(products, cart);

    container.addEventListener('click', (event) => {
      if (event.target.classList.contains('buy-btn')) {
        const id = event.target.dataset.id;
        productsCount ++;
        if (cart.length === 0) cart.push({ id: id, count: 1 });
        else if (cart.length > 0) {
          let existingProduct = cart.find((item) => item.id === id);
          if (existingProduct) existingProduct.count++;
          else cart.push({ id: id, count: 1 });
        }
        cartEl.innerText = productsCount;
      }

      saveToStorage(cart, productsCount);
      updateCart(products, cart);

    });

  } catch (error) {
    container.innerHTML = `<p style="color:red">Error loading products. Please try again later.</p>`;
    console.error('Initialization error:', error);
  }
};

document.addEventListener('DOMContentLoaded', init);
