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
// 🛒 数据
// ======================
let cart = [];

// ======================
// 🍽 菜品 + -
// ======================
document.addEventListener('click', function (e) {

    const card = e.target.closest('.card');
    if (!card) return;

    const countEl = card.querySelector('.count');
    const minusBtn = card.querySelector('.minus');

    let count = parseInt(countEl.innerText);

    const name = card.querySelector('h3').innerText;
    const price = parseFloat(card.querySelector('.price').innerText.replace('€', ''));
    const img = card.querySelector('img').src;

    // ➕
    if (e.target.classList.contains('plus')) {
        count++;

        flyToCart(card.querySelector('img'));

        let item = cart.find(i => i.name === name);
        if (item) item.count++;
        else cart.push({ name, price, count: 1, img });
    }

    // ➖
    if (e.target.classList.contains('minus') && count > 0) {
        count--;

        let item = cart.find(i => i.name === name);
        if (item) {
            item.count--;
            if (item.count <= 0) {
                cart = cart.filter(i => i.name !== name);
            }
        }
    }

    countEl.innerText = count;
    minusBtn.style.visibility = count === 0 ? 'hidden' : 'visible';

    updateCart();
    syncMenuCount();
});

// ======================
// 🧾 更新购物车
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
            <img src="${item.img}" class="cart-img">

            <div class="cart-info">
                <div>${item.name}</div>

                <div class="cart-control">
                    <button class="cart-minus">-</button>
                    <span>${item.count}</span>
                    <button class="cart-plus">+</button>
                </div>
            </div>

            <div class="cart-price">
                €${(item.price * item.count).toFixed(2)}
            </div>
        </div>
        `;
    });

    cartCountEl.innerText = totalCount;

    totalPriceEls.forEach(el => {
        el.innerText = total.toFixed(2);
    });
}

// ======================
// 🛒 打开关闭购物车
// ======================
const cartPanel = document.querySelector('.cart-panel');
const cartBar = document.querySelector('.cart-bar');

let isOpen = false;

cartBar.addEventListener('click', () => {
    isOpen = !isOpen;
    cartPanel.style.display = isOpen ? 'flex' : 'none';
});

// 点击外部关闭
document.addEventListener('click', function (e) {

    if (!isOpen) return;

    const confirmBox = document.getElementById('confirmBox');

    const inside =
        cartPanel.contains(e.target) ||
        cartBar.contains(e.target) ||
        confirmBox.contains(e.target);

    if (!inside) {
        cartPanel.style.display = 'none';
        isOpen = false;
    }
});

// ======================
// 🔄 同步菜单数量
// ======================
function syncMenuCount() {

    document.querySelectorAll('.card').forEach(card => {

        const name = card.querySelector('h3').innerText;
        const countEl = card.querySelector('.count');
        const minusBtn = card.querySelector('.minus');

        let item = cart.find(i => i.name === name);

        let count = item ? item.count : 0;

        countEl.innerText = count;
        minusBtn.style.visibility = count === 0 ? 'hidden' : 'visible';
    });
}

// ======================
// ✈️ 飞入动画
// ======================
function flyToCart(imgEl) {

    const flyImg = document.getElementById('flyImg');
    const cartBar = document.querySelector('.cart-bar');

    const start = imgEl.getBoundingClientRect();
    const end = cartBar.getBoundingClientRect();

    flyImg.src = imgEl.src;
    flyImg.style.left = start.left + 'px';
    flyImg.style.top = start.top + 'px';
    flyImg.style.display = 'block';

    flyImg.getBoundingClientRect();

    flyImg.style.left = end.left + 20 + 'px';
    flyImg.style.top = end.top + 10 + 'px';
    flyImg.style.width = '20px';
    flyImg.style.height = '20px';
    flyImg.style.opacity = '0.5';

    setTimeout(() => {
        flyImg.style.display = 'none';
        flyImg.style.opacity = '1';
        flyImg.style.width = '80px';
        flyImg.style.height = '80px';
    }, 700);
}

// ======================
// 🧹 清空购物车
// ======================
const clearBtn = document.querySelector('.clear-cart');
const confirmBox = document.getElementById('confirmBox');
const okBtn = document.getElementById('okBtn');
const cancelBtn = document.getElementById('cancelBtn');

clearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    confirmBox.style.display = 'flex';
});

cancelBtn.addEventListener('click', () => {
    confirmBox.style.display = 'none';
});

okBtn.addEventListener('click', () => {

    cart = [];
    updateCart();
    syncMenuCount();

    showToast('已清空购物车');
    confirmBox.style.display = 'none';
});

// ======================
// 🔔 Toast
// ======================
function showToast(text, type = 'default') {

    const toast = document.getElementById('toast');

    toast.innerText = text;

    // ⭐ 关键：不要乱改 className 和 id
    toast.classList.remove('toast-success', 'toast-warning', 'show');

    if (type === 'success') {
        toast.classList.add('toast-success');
    } else if (type === 'warning') {
        toast.classList.add('toast-warning');
    }

    // 显示
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // 隐藏
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// ======================
// ✅ 提交订单（🔥保证能用）
// ======================
document.querySelector('.submit-order').addEventListener('click', function (e) {
    console.log('点了提交订单');   // ⭐ 加这一行

    e.stopPropagation();

    if (cart.length === 0) {
        showToast('⚠️ 请先选择菜品', 'warning');
        return;
    }

    showToast('✅ 下单成功', 'success');

    cart = [];
    updateCart();
    syncMenuCount();
});

// ======================
// 🛒 购物车内 + -
// ======================
document.addEventListener('click', function (e) {

    if (e.target.classList.contains('cart-plus')) {

        const itemEl = e.target.closest('.cart-item');
        const name = itemEl.querySelector('.cart-info div').innerText;

        let item = cart.find(i => i.name === name);
        if (item) item.count++;

        updateCart();
        syncMenuCount();
    }

    if (e.target.classList.contains('cart-minus')) {

        const itemEl = e.target.closest('.cart-item');
        const name = itemEl.querySelector('.cart-info div').innerText;

        let item = cart.find(i => i.name === name);

        if (item) {
            item.count--;
            if (item.count <= 0) {
                cart = cart.filter(i => i.name !== name);
            }
        }

        updateCart();
        syncMenuCount();
    }
});