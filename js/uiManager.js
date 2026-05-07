export const toggleSections = (isUserLoggedIn) => {
    const shopSection = document.querySelector('#shop-section');
    const regSection = document.querySelector('#registration-section');

    if (isUserLoggedIn) {
        shopSection.style.display = 'block';
        regSection.style.display = 'none';
    } else {
        shopSection.style.display = 'none';
        regSection.style.display = 'flex';
    }
};

export const updateCartCounter = (count) => {
    const cartEl = document.querySelector('#cart-count');
    if (cartEl) cartEl.innerText = count;
};

export const renderProducts = (products, container) => {
    container.innerHTML = products.map((pr) => `
    <article class="product-card">
      ${pr.image ? `<img src="${pr.image}" alt="${pr.name}" onerror="this.style.display='none'">` : ''}
      <div class="category">${pr.category}</div>
      <h3>${pr.name}</h3>
      <div class="price">${pr.price} €</div>
      <button class="buy-btn" data-id="${pr.id}">Add to Cart</button>
    </article>
    `).join('');
};

export const animateBuyButton = (btn) => {
    const originalText = btn.innerText;

    btn.classList.add('added');
    btn.innerText = '✅ Added!';
    btn.disabled = true;

    setTimeout(() => {
        btn.classList.remove('added');
        btn.innerText = originalText;
        btn.disabled = false;
    }, 2000);
};