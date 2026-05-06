import { fetchProducts } from './api.js';
import { getCart, getProductsCount, saveToStorage } from './storage.js';
import { updateCartUI } from './updateCartUI.js';
import { initRegistration } from './auth.js';
import { handleCartClick } from './cartActions.js';
import { addToCart } from './productActions.js';

const container = document.querySelector('#catalog');
let productsCount = getProductsCount();
let cart = getCart();
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
    let productsMap = {};
    const shopSection = document.querySelector('#shop-section');
    const regSection = document.querySelector('#registration-section');

    const renderPage = async () => {
      const user = localStorage.getItem('user');

      if (user) {
        shopSection.style.display = 'block';
        regSection.style.display = 'none';

        const products = await fetchProducts();
        productsMap = products.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});

        renderProducts(products);
        updateCartUI(cart, productsMap);
      } else {
        shopSection.style.display = 'none';
        regSection.style.display = 'flex';
        initRegistration(renderPage);
      }
    };

    await renderPage();

    document.querySelector('#logout-btn').addEventListener('click', () => {
      localStorage.removeItem('user');
      location.reload();
    });

    container.addEventListener('click', (event) => {
      if (event.target.classList.contains('buy-btn')) {
        const id = event.target.dataset.id;
        cart = addToCart(cart, id);
        productsCount++;
        cartEl.innerText = productsCount;
        saveToStorage(cart, productsCount);
        updateCartUI(cart, productsMap);
      }
    });

    document.querySelector('#cart-items-list').addEventListener("click", (event) => {
      const result = handleCartClick(event, cart, productsCount);
      cart = result.cart;
      productsCount = result.productsCount;
      saveToStorage(cart, productsCount);
      updateCartUI(cart, productsMap);
      cartEl.innerText = productsCount;
    });

    document.querySelector('#checkout-btn').addEventListener('click', () => {
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      const user = JSON.parse(localStorage.getItem('user'));
      const userEmail = user ? user.email : 'Customer';
      alert(`Thank you for your purchase, ${userEmail}! Total items: ${productsCount}`);
      cart = [];
      productsCount = 0;
      saveToStorage(cart, productsCount);
      cartEl.innerText = productsCount;
      updateCartUI(cart, productsMap);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

  } catch (error) {
    container.innerHTML = `<p style="color:red">Error loading products.</p>`;
    console.error('Error:', error);
  }
};

document.addEventListener('DOMContentLoaded', init);