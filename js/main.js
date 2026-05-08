import { fetchProducts } from './api.js';
import { getCart, getProductsCount, getUser, removeUserFromStorage, saveToStorage } from './storage.js';
import { updateCartUI } from './updateCartUI.js';
import { initRegistration } from './auth.js';
import { handleCartClick } from './cartActions.js';
import { addToCart } from './productActions.js';
import { toggleSections, updateCartCounter, renderProducts, animateBuyButton, setupSearch } from './uiManager.js';
import { processCheckout } from './checkout.js';
import { createStore } from './store.js';

const container = document.querySelector('#catalog');

const getCartCount = (cart) => cart.reduce((sum, item) => sum + item.count, 0);

const initialState = {
  cart: getCart(),
  productsCount: getProductsCount(),
  productsMap: {},
  products: [],
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS': {
      return {
        ...state,
        products: action.payload.products,
        productsMap: action.payload.productsMap,
      };
    }
    case 'SET_CART': {
      const nextCart = action.payload;
      return {
        ...state,
        cart: nextCart,
        productsCount: getCartCount(nextCart),
      };
    }
    case 'CLEAR_CART': {
      return {
        ...state,
        cart: [],
        productsCount: 0,
      };
    }
    default:
      return state;
  }
};

const store = createStore(appReducer, initialState);

const init = async () => {
  const syncUI = (state) => {
    saveToStorage(state.cart);
    updateCartUI(state.cart, state.productsMap);
    updateCartCounter(state.productsCount);
  };

  store.subscribe(syncUI);

  try {
    const renderPage = async () => {
      const isLogged = getUser();
      toggleSections(!!isLogged);

      if (isLogged) {
        const products = await fetchProducts();
        const productsMap = products.reduce((acc, item) => (acc[item.id] = item, acc), {});
        store.dispatch({ type: 'SET_PRODUCTS', payload: { products, productsMap } });

        renderProducts(products, container);
        setupSearch(products, container);
        syncUI(store.getState());
        document.querySelector('#shop-section').classList.add('loaded');
      } else {
        updateCartCounter(store.getState().productsCount);
        initRegistration(renderPage);
      }
    };

    await renderPage();

    document.addEventListener('click', async (e) => {
      const target = e.target;
      if (target.classList.contains('buy-btn')) {
        const id = target.dataset.id;
        const { cart } = store.getState();
        const nextCart = addToCart(cart, id);
        store.dispatch({ type: 'SET_CART', payload: nextCart });
        animateBuyButton(target);
        return;
      }

      if (target.closest('#cart-items-list')) {
        const { cart, productsCount } = store.getState();
        const result = handleCartClick(e, cart, productsCount);
        store.dispatch({ type: 'SET_CART', payload: result.cart });
        return;
      }

      if (target.id === 'logout-btn') {
        removeUserFromStorage();
        location.reload();
        return;
      }

      if (target.id === 'checkout-btn') {
        const { cart, productsCount } = store.getState();
        const result = processCheckout(cart, productsCount);
        if (result.cart.length === 0) {
          store.dispatch({ type: 'CLEAR_CART' });
          return;
        }
        store.dispatch({ type: 'SET_CART', payload: result.cart });
      }
    });

  } catch (error) {
    container.innerHTML = `<p style="color:red; text-align:center;">Error loading products. Check console for details.</p>`;
    console.error('Initialization error:', error);
  }
};

document.addEventListener('DOMContentLoaded', init);