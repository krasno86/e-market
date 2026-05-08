const STORAGE_KEY_CART = 'cart';
const STORAGE_KEY_USER = 'user';

export const saveUserToStorage = (user) => {
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
}

export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEY_USER);
  return user ? JSON.parse(user) : null;
}

export const saveToStorage = (cart) => {
  localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
};

export const getCart = () => {
  const cart = localStorage.getItem(STORAGE_KEY_CART);
  return cart ? JSON.parse(cart) : [];
};

export const getProductsCount = () => {
  return getCart().reduce((sum, item) => sum + item.count, 0);
};

export const removeUserFromStorage = () => {
  localStorage.removeItem(STORAGE_KEY_USER);
};