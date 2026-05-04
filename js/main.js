import { fetchProducts } from './api.js';
import { getCart, getProductsCount, saveToStorage } from './storage.js';
import { updateCartUI } from './updateCartUI.js';

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

const init = async () => {
  try {
    const products = await fetchProducts();
    const productsMap = products.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
    renderProducts(products);
    updateCartUI(cart, productsMap);

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
      updateCartUI(cart, productsMap);
    });

    document.querySelector('#cart-items-list').addEventListener("click", (event) => {
      const id = event.target.dataset.id;
      let cartItem = cart.find((item) => item.id === id);

      if (event.target.classList.contains('btn-minus')) {
        if (cartItem.count === 1) {
          cart = cart.filter((el) => el.id !== id);
        } else if (cartItem.count > 1) {
          cart = cart.map((el) => el.id === id ? { ...el, count: el.count - 1} : el);
        }
        productsCount --;
      } else if (event.target.classList.contains('btn-plus')) {

        cart = cart.map((el) => el.id === id ? { ...el, count: el.count + 1} : el);
        productsCount ++;
      } else if (event.target.classList.contains('btn-remove')) {
        cart = cart.filter((el) => el.id !== id);
        productsCount = productsCount - cartItem.count
      }

      saveToStorage(cart, productsCount);
      updateCartUI(cart, productsMap);
    })

  } catch (error) {
    container.innerHTML = `<p style="color:red">Error loading products. Please try again later.</p>`;
    console.error('Initialization error:', error);
  }
};

document.addEventListener('DOMContentLoaded', init);
