import { getUser } from './storage.js';

export const processCheckout = (cart, productsCount) => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return { cart, productsCount };
    }

    const user = getUser();
    const userEmail = user ? user.email : 'Customer';
    alert(`Thank you for your purchase, ${userEmail}! Total items: ${productsCount}`);
    const newCart = [];
    const newCount = 0;
    return { cart: newCart, productsCount: newCount };
};