export const calculateCartTotals = (cart, productsMap) => {
  let subtotal = 0;
  let totalWeight = 0;

  cart.forEach((item) => {
    const product = productsMap[item.id];
    if (product) {
      subtotal += product.price * item.count;
      totalWeight += product.weight * item.count;
    }
  });

  const tax = subtotal * 0.19;
  let shipping = totalWeight > 0 ? (totalWeight < 1 ? 5 : 15) : 0;

  return {
    subtotal,
    totalWeight,
    tax,
    shipping,
    grandTotal: subtotal + tax + shipping
  };
};