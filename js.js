// ======================
// 📂 分类切换
// ======================
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.neirong');

tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        contents[index].classList.add('active');
    });
});


// ======================
// 🛒 购物车数据
// ======================
let cart = [];


// ======================
// ➕➖ 加减逻辑
// ======================
document.addEventListener('click', function (e) {

    const card = e.target.closest('.card');
    if (!card) return;

    const countEl = card.querySelector('.count');
    const minusBtn = card.querySelector('.minus');

    let count = parseInt(countEl.innerText);

    const name = card.querySelector('h3').innerText;
    const price = parseFloat(card.querySelector('.price').innerText.replace('€', ''));

    // 👉 加
    if (e.target.classList.contains('plus')) {
        count++;

        let item = cart.find(i => i.name === name);
        if (item) item.count++;
        else cart.push({ name, price, count: 1 });

        updateCart();
    }

    // 👉 减
    if (e.target.classList.contains('minus') && count > 0) {
        count--;

        let item = cart.find(i => i.name === name);
        if (item) {
            item.count--;
            if (item.count <= 0) {
                cart = cart.filter(i => i.name !== name);
            }
        }

        updateCart();
    }

    countEl.innerText = count;
    minusBtn.style.visibility = count === 0 ? 'hidden' : 'visible';
});


// ======================
// 🧾 更新购物车 UI
// ======================
function updateCart() {

    const cartItemsEl = document.querySelector('.cart-items');
    const cartCountEl = document.querySelector('.cart-count');
    const totalPriceEls = document.querySelectorAll('.total-price');

    cartItemsEl.innerHTML = '';

    let total = 0;
    let totalCount = 0;

    cart.forEach(item => {
        total += item.price * item.count;
        totalCount += item.count;

        cartItemsEl.innerHTML += `
            <div class="cart-item">
                <span>${item.name} x${item.count}</span>
                <span>€${(item.price * item.count).toFixed(2)}</span>
            </div>
        `;
    });

    // 👉 更新底部栏
    cartCountEl.innerText = totalCount;
    totalPriceEls.forEach(el => {
        el.innerText = total.toFixed(2);
    });

    // 👉 自动关闭空购物车
    if (cart.length === 0) {
        cartPanel.style.display = 'none';
        isOpen = false;
    }
}


// ======================
// 🛒 购物车展开 / 收起
// ======================
const cartPanel = document.querySelector('.cart-panel');
const cartBar = document.querySelector('.cart-bar');

let isOpen = false;

cartBar.addEventListener('click', () => {
    isOpen = !isOpen;
    cartPanel.style.display = isOpen ? 'flex' : 'none';
});

document.addEventListener('click', function (e) {

    if (!isOpen) return;

    const isClickInsideCart =
        cartPanel.contains(e.target) ||
        cartBar.contains(e.target);

    if (!isClickInsideCart) {
        cartPanel.style.display = 'none';
        isOpen = false;
    }
});