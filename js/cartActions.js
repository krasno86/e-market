export const handleCartClick = (event, cart, productsCount) => {
    const id = event.target.dataset.id;
    let cartItem = cart.find((item) => item.id === id);
    if (!cartItem) return { cart, productsCount };

    if (event.target.classList.contains('btn-minus')) {
        if (cartItem.count === 1) {
            cart = cart.filter((el) => el.id !== id);
        } else if (cartItem.count > 1) {
            cart = cart.map((el) => (el.id === id ? { ...el, count: el.count - 1 } : el));
        }
        productsCount--;
    } else if (event.target.classList.contains('btn-plus')) {
        cart = cart.map((el) => (el.id === id ? { ...el, count: el.count + 1 } : el));
        productsCount++;
    } else if (event.target.classList.contains('btn-remove')) {
        cart = cart.filter((el) => el.id !== id);
        productsCount = productsCount - cartItem.count;
    }

    return { cart, productsCount };
};