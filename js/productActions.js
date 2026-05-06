export const addToCart = (cart, id) => {
    if (cart.length === 0) {
        cart.push({ id: id, count: 1 });
    } else {
        let existingProduct = cart.find((item) => item.id === id);
        if (existingProduct) {
            existingProduct.count++;
        } else {
            cart.push({ id: id, count: 1 });
        }
    }
    return cart;
};