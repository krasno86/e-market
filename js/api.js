export const fetchProducts = async () => {
  const response = await fetch('./data/data.json');
  if (!response.ok) throw new Error('Download error!');
  let products = await response.json();
  return products;
};