import { fetchProducts } from './api.js';
import {getCart, getProductsCount, getUser, saveToStorage} from './storage.js';
import { updateCartUI } from './updateCartUI.js';
import { initRegistration } from './auth.js';
import { handleCartClick } from './cartActions.js';
import { addToCart } from './productActions.js';
import { toggleSections, updateCartCounter, renderProducts } from './uiManager.js';
import { processCheckout } from './checkout.js';

let productsCount = getProductsCount();
let cart = getCart();
let productsMap = {};
const container = document.querySelector('#catalog');

const init = async () => {
  const saveAndRefresh = () => {
    saveToStorage(cart, productsCount);
    updateCartUI(cart, productsMap);
    updateCartCounter(productsCount);
  };

  try {
    const renderPage = async () => {
      const user = getUser();
      toggleSections(!!user);

      if (user) {
        const products = await fetchProducts();
        productsMap = products.reduce((acc, item) => (acc[item.id] = item, acc), {});

        renderProducts(products, container);
        saveAndRefresh();
      } else {
        updateCartCounter(productsCount);
        initRegistration(renderPage);
      }
    };

    await renderPage();

    document.querySelector('#logout-btn').addEventListener('click', () => {
      localStorage.removeItem('user');
      location.reload();
    });

    document.querySelector('#catalog').addEventListener('click', (e) => {
      if (e.target.classList.contains('buy-btn')) {
        cart = addToCart(cart, e.target.dataset.id);
        productsCount++;
        saveAndRefresh();
      }
    });

    document.querySelector('#cart-items-list').addEventListener("click", (e) => {
      const result = handleCartClick(e, cart, productsCount);
      cart = result.cart;
      productsCount = result.productsCount;
      saveAndRefresh();
    });

    document.querySelector('#checkout-btn').addEventListener('click', () => {
      const result = processCheckout(cart, productsCount, productsMap);
      cart = result.cart;
      productsCount = result.productsCount;
      saveAndRefresh();
    });

  } catch (error) {
    container.innerHTML = `<p style="color:red; text-align:center;">Error loading products. Check console for details.</p>`;
    console.error('Initialization error:', error);
  }
};

document.addEventListener('DOMContentLoaded', init);