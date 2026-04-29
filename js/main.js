import { fetchProducts } from './api.js';

const container = document.querySelector('#catalog');

const renderProducts = (products) => {
  container.innerHTML = products
    .map((pr) => {
      const imageHtml= pr.image ? `<img src="${pr.image}" alt="${pr.name}" onerror="this.style.display='none'">` : '';

      return `
        <article class="product-card">
            ${imageHtml}
            <div class="category">${pr.category}</div>
            <h3>${pr.name}</h3>
            <div class="price">${pr.price} €</div>
            <button class="buy-btn" data-id="${pr.id}">Add to Cart</button>
        </article>
      `;
    })
    .join('');
};

const init = async () => {
  try {
    const products = await fetchProducts();
    renderProducts(products);

  } catch (error) {
    container.innerHTML = `<p style="color:red">Error loading products. Please try again later.</p>`;
    console.error('Initialization error:', error);
  }
};

document.addEventListener('DOMContentLoaded', init);
