export const addToCart = (cart, id) => {
    const existingProduct = cart.find((item) => item.id === id);
    if (!existingProduct) {
        return [...cart, { id, count: 1 }];
    }

    return cart.map((item) => (
        item.id === id ? { ...item, count: item.count + 1 } : item
    ));
};