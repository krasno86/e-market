import { fetchProducts } from './api.js';
import {getCart, getProductsCount, getUser, saveToStorage, saveUserToStorage} from './storage.js';
import { updateCartUI } from './updateCartUI.js';

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
      const user = localStorage.getItem('user')
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
        regSection.style.display = 'block';
        const form = document.querySelector('#auth-form');
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(form);
          const email = formData.get('email');
          const pass = formData.get('pass');
          const confirmPass = formData.get('confirmPassword');
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (!emailRegex.test(email)) {
            document.getElementById('email-error').textContent = 'Please enter a valid email address';
            return;
          }

          if (pass !== confirmPass) {
            document.getElementById('pass-error').textContent = 'Password don\'t match!';
            return;
          }

          const userData = { email: email, password: pass };
          saveUserToStorage(userData);
          await renderPage();
        })
      }
    }

    await renderPage();

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
    container.innerHTML = `<p style="color:red">Error loading products. Please try again later.</p>`;
    console.error('Initialization error:', error);
  }
};

document.addEventListener('DOMContentLoaded', init);
