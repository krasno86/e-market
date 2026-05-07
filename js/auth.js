import { saveUserToStorage } from './storage.js';

export const initRegistration = (onSuccess) => {
    const form = document.querySelector('#auth-form');
    if (!form) return;

    const clearErrors = () => { document.querySelectorAll('.error-msg').forEach(el => el.textContent = ''); };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();
        const formData = new FormData(form);
        const email = formData.get('email').trim();
        const pass = formData.get('pass');
        const confirmPass = formData.get('confirmPassword');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email-error').textContent = 'Please enter a valid email address';
            return;
        }

        const passRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
        if (!passRegex.test(pass)) {
            document.getElementById('pass-error').textContent = 'Password must be at least 6 characters and include both letters and numbers';
            return;
        }

        if (pass !== confirmPass) {
            document.getElementById('confirm-error').textContent = 'Passwords don\'t match!';
            return;
        }

        const userData = { email, password: pass };
        saveUserToStorage(userData);

        // Сообщаем main.js, что всё готово
        if (onSuccess) await onSuccess();
    });
};