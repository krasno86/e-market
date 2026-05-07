import { fetchProducts } from './api.js';
import {getCart, getProductsCount, getUser, saveToStorage} from './storage.js';
import { updateCartUI } from './updateCartUI.js';
import { initRegistration } from './auth.js';
import { handleCartClick } from './cartActions.js';
import { addToCart } from './productActions.js';
import { toggleSections, updateCartCounter, renderProducts, animateBuyButton, setupSearch } from './uiManager.js';
import { processCheckout } from './checkout.js';

let productsCount = getProductsCount();
let cart = getCart();
let productsMap = {};
let products = [];
const container = document.querySelector('#catalog');

const init = async () => {
  const saveAndRefresh = () => {
    saveToStorage(cart, productsCount);
    updateCartUI(cart, productsMap);
    updateCartCounter(productsCount);
  };

  try {
    const renderPage = async () => {
      const isLogged = getUser();
      toggleSections(!!isLogged);

      if (isLogged) {
        products = await fetchProducts();
        productsMap = products.reduce((acc, item) => (acc[item.id] = item, acc), {});
        renderProducts(products, container);
        setupSearch(products, container);
        saveAndRefresh();
        document.querySelector('#shop-section').classList.add('loaded');
      } else {
        updateCartCounter(productsCount);
        initRegistration(renderPage);
      }
    };

    await renderPage();

    document.addEventListener('click', async (e) => {
      const target = e.target;
      if (target.classList.contains('buy-btn')) {
        const id = target.dataset.id;
        cart = addToCart(cart, id);
        productsCount++;
        saveAndRefresh();
        animateBuyButton(target);
        return;
      }

      if (target.closest('#cart-items-list')) {
        const result = handleCartClick(e, cart, productsCount);
        cart = result.cart;
        productsCount = result.productsCount;
        saveAndRefresh();
        return;
      }

      if (target.id === 'logout-btn') {
        localStorage.removeItem('user');
        location.reload();
        return;
      }

      if (target.id === 'checkout-btn') {
        const result = processCheckout(cart, productsCount, productsMap);
        cart = result.cart;
        productsCount = result.productsCount;
        saveAndRefresh();
      }
    });

  } catch (error) {
    container.innerHTML = `<p style="color:red; text-align:center;">Error loading products. Check console for details.</p>`;
    console.error('Initialization error:', error);
  }
};

document.addEventListener('DOMContentLoaded', init);