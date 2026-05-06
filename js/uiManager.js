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