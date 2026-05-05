const STORAGE_KEY_CART = 'cart';
const STORAGE_KEY_COUNT = 'productsCount';
const STORAGE_KEY_USER = 'user';

export const saveUserToStorage = (user) => {
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
}

export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEY_USER);
  return user ? JSON.parse(user) : null;
}

export const saveToStorage = (cart, productsCount) => {
  localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
  localStorage.setItem(STORAGE_KEY_COUNT, JSON.stringify(productsCount));
};

export const getCart = () => {
  const cart = localStorage.getItem(STORAGE_KEY_CART);
  return cart ? JSON.parse([cart]) : [];
};

export const getProductsCount = () => {
  const count = localStorage.getItem(STORAGE_KEY_COUNT);
  return count ? JSON.parse(count) : 0;
};