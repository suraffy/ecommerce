// simple e-shopping - Design HTML, CSS | Part 1 of 3
// Implementing filter and search, JS DOM - simple e-shopping | Part 2 of 3
// Adding products to cart, JS DOM - simple e-shopping | Part 3 of 3
////// Features //////
// Filter
// Search
// Add products to cart, show number of products in cart
// Display products in cart, and calculate the total

const filterList = document.querySelector('.filter-list');
const pageTitle = document.querySelector('.page-title');

const searchEl = document.getElementById('searchEl');
const searchBtn = document.getElementById('searchBtn');

const productsList = document.querySelector('.products-list');
const productItems = document.querySelectorAll('.product-item');

const cart = document.querySelector('.cart');
const cartNumber = document.querySelector('.cartNumber');
let cartNumValue = 0;

const cartDetails = document.querySelector('.cart-details');
const productsInCart = document.querySelector('.products-in-cart');
const cartEmpty = document.querySelector('.cart-empty');
const calcTotalBtn = document.querySelector('#calculate-total');
const totalPrice = document.querySelector('.total-price');
const cartForm = document.forms.cartDetailsForm;

const filterValues = new Set();

filterList.addEventListener('click', filterProducts);
searchEl.addEventListener('input', searchProducts);
searchBtn.addEventListener('click', searchProducts);
productsList.addEventListener('click', addToCart);
cartForm.addEventListener('submit', calcTotal);

cart.addEventListener('click', () => {
  cartDetails.classList.toggle('show-cart-details');
});

function filterProducts() {
  const filterEl = event.target;
  if (filterEl.tagName !== 'LI') return;

  filterEl.classList.toggle('filterBgColor');

  const filterType = filterEl.getAttribute('data-filter-type');

  if (filterValues.has(filterType)) {
    filterValues.delete(filterType);
  } else {
    filterValues.add(filterType);
  }

  if (filterValues.has('all') || filterValues.size === 0) {
    for (product of productItems) product.style.display = 'block';
    pageTitle.textContent = 'All Products';
    return;
  }

  for (product of productItems) {
    if (filterValues.has(product.getAttribute('data-product-type'))) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  }

  pageTitle.textContent = '';
  for (f of filterValues) {
    if (f === 'all') continue;

    f = f.replace(f[0], f[0].toUpperCase());
    pageTitle.textContent += f + ', ';
  }
}

function searchProducts() {
  const searchPatt = new RegExp(searchEl.value, 'i');

  for (product of productItems) {
    const productName = product.getAttribute('data-product-name');

    if (
      searchPatt.test(productName) &&
      (!filterValues.size ||
        filterValues.has(product.getAttribute('data-product-type')))
    ) {
      product.style.display = 'block';
    } else product.style.display = 'none';
  }
}

function addToCart(event) {
  if (event.target.classList.contains('add-to-cart')) {
    const btn = event.target;
    const product = btn.parentNode.parentNode;
    const prdName = product.getAttribute('data-product-name');
    const prdPrice = product.getAttribute('data-product-price');

    if (!btn.classList.contains('added')) {
      btn.textContent = 'Remove from cart';
      btn.classList.add('added');
      cartNumValue++;

      const li = document.createElement('li');
      li.textContent = `${prdName}, $${prdPrice}`;
      li.setAttribute('data-product-name', prdName);
      li.setAttribute('data-product-price', prdPrice);
      productsInCart.append(li);

      li.insertAdjacentHTML(
        'beforeend',
        `<input type="Number" class="product-quantity" min="1" max="999" step="1" required placeholder="Quantity">`
      );
    } else {
      btn.textContent = 'Add to cart';
      btn.classList.remove('added');
      cartNumValue--;

      const lis = productsInCart.children;
      for (li of lis) {
        if (li.getAttribute('data-product-name') === prdName) {
          li.remove();
          break;
        }
      }
    }

    cartNumber.textContent = cartNumValue;

    if (productsInCart.childElementCount === 0) {
      cartEmpty.style.display = 'block';
      calcTotalBtn.style.display = 'none';
      totalPrice.style.display = 'none';
      totalPrice.textContent = '';
    } else {
      cartEmpty.style.display = 'none';
      calcTotalBtn.style.display = 'block';
      totalPrice.style.display = 'block';
    }
  }
}

function calcTotal(event) {
  event.preventDefault();

  let total = 0;
  for (product of productsInCart.children) {
    total +=
      product.getAttribute('data-product-price') * product.lastChild.value;
  }

  total = Math.round(total * 100) / 100;
  totalPrice.textContent = `Total = $${total}`;
  totalPrice.style.animation = 'animateBg 1s';

  setTimeout(() => {
    totalPrice.style.animation = '';
  }, 1000);
}
