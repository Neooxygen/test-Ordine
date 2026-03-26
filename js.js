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




document.addEventListener('click', function (e) {

    
    if (e.target.closest('.cart-panel')) return;
    

    const card = e.target.closest('.card');
    if (!card) return;

    const countEl = card.querySelector('.count');
    const minusBtn = card.querySelector('.minus');

    let count = parseInt(countEl.innerText);

    const name = card.querySelector('h3').innerText;
    const price = parseFloat(card.querySelector('.price').innerText.replace('€', ''));
    const img = card.querySelector('img').src;

    // ➕ 加
    if (e.target.classList.contains('plus')) {
        count++;

        flyToCart(card.querySelector('img'));

        let item = cart.find(i => i.name === name);
        if (item) item.count++;
        else cart.push({ name, price, count: 1, img });

        updateCart();
        syncMenuCount();
    }

    // ➖ 减
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
        syncMenuCount();
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

    // 自动关闭空购物车
    if (cart.length === 0) {
        cartPanel.style.display = 'none';
        isOpen = false;
    }
}


// ======================
// 🛒 展开 / 收起购物车
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

    const confirmBox = document.getElementById('confirmBox');

    const inside =
        cartPanel.contains(e.target) ||
        cartBar.contains(e.target) ||
        confirmBox.contains(e.target); // ⭐ 关键修复

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
// 飞入动画
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
//  清空购物车
// ======================
const clearBtn = document.querySelector('.clear-cart');
const confirmBox = document.getElementById('confirmBox');
const okBtn = document.getElementById('okBtn');
const cancelBtn = document.getElementById('cancelBtn');

//  打开弹窗
clearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    confirmBox.style.display = 'flex';
});

//  取消
cancelBtn.addEventListener('click', () => {
    confirmBox.style.display = 'none';
});

// 确定
okBtn.addEventListener('click', () => {

    cart = [];

    updateCart();
    syncMenuCount();

    showToast('已清空购物车');

    confirmBox.style.display = 'none';
});


// ======================
// 🔔 提示
// ======================
function showToast(text) {
    const toast = document.getElementById('toast');
    toast.innerText = text;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 1500);
}

// 购物车内提交订单
document.addEventListener('click', function (e) {

    if (!e.target.classList.contains('submit-order')) return;

    e.stopPropagation();

    if (cart.length === 0) {
        showToast('购物车是空的');
        return;
    }

    showToast('订单已提交');

    // 提交后清空（可选）
    cart = [];
    updateCart();
    syncMenuCount();
});

// ======================
// 🛒 购物车内 + - 修复
// ======================
document.addEventListener('click', function (e) {

    // ➕
    if (e.target.classList.contains('cart-plus')) {

        const itemEl = e.target.closest('.cart-item');
        const name = itemEl.querySelector('.cart-info div').innerText;

        let item = cart.find(i => i.name === name);
        if (item) item.count++;

        updateCart();
        syncMenuCount();
    }

    // ➖
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