// Datos de ejemplo para accesorios
const products = [
  {id:1,name:'Collar lágrima dorado',price:15.000,category:'collares',image:'ace1.jpg'},
  {id:2,name:'anillos platiados ',price:30.000,category:'bolsos',image:'ace2.jpg'},
  {id:3,name:'manilla minimal plata',price:15.000,category:'aros',image:'ace3.jpg'},
  {id:4,name:'manilla dorada',price:24.000,category:'bufandas',image:'ace4.jfif'},
  {id:5,name:'bufanda',price:35.000,category:'collares',image:'ace5.jpg'},
  {id:6,name:'gafas ',price:30.000,category:'bolsos',image:'ace6.webp'},
  {id:7,name:'Bolso  clásico negro ',price:60.000,category:'bolsos',image:'ace7.webp'},
  {id:8,name:'Bolso  clásico',price:55.000,category:'bolsos',image:'ace8.webp'},
];

// Estado del carrito
let cart = JSON.parse(localStorage.getItem('cart_accesorios')||'[]');

// Elementos DOM
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');
const clearCart = document.getElementById('clearCart');
const checkout = document.getElementById('checkout');
const yearSpan = document.getElementById('year');

// Inicializar
yearSpan.textContent = new Date().getFullYear();
updateCartUI();
renderProducts(products);

// Renderizar productos
function renderProducts(list){
  productsGrid.innerHTML = '';
  if(list.length===0){
    productsGrid.innerHTML = '<p>No se encontraron productos.</p>';
    return;
  }
  list.forEach(p => {
    const el = document.createElement('article');
    el.className = 'product';
    el.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="product-body">
        <h4>${p.name}</h4>
        <div class="price">$${p.price.toFixed(2)}</div>
        <div class="actions">
          <button class="btn secondary" data-id="${p.id}">Ver</button>
          <button class="btn primary" data-id="${p.id}">Agregar</button>
        </div>
      </div>
    `;
    // Botones
    const buttons = el.querySelectorAll('button');
    buttons.forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const id = Number(btn.getAttribute('data-id'));
        if(btn.classList.contains('primary')) addToCart(id);
        else showProductModal(id);
      });
    });
    productsGrid.appendChild(el);
  });
}

function showProductModal(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  alert(p.name + " — $" + p.price.toFixed(2));
}

// Búsqueda y filtros
searchInput.addEventListener('input', applyFilters);
categorySelect.addEventListener('change', applyFilters);

function applyFilters(){
  const q = searchInput.value.trim().toLowerCase();
  const cat = categorySelect.value;
  let filtered = products.filter(p => {
    const matchesQ = p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchesCat = (cat==='all') || p.category===cat;
    return matchesQ && matchesCat;
  });
  renderProducts(filtered);
}

// Carrito
function addToCart(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  const item = cart.find(c=>c.id===id);
  if(item) item.qty += 1;
  else cart.push({id:p.id,name:p.name,price:p.price,image:p.image,qty:1});
  persistCart();
  updateCartUI();
}

function persistCart(){
  localStorage.setItem('cart_accesorios', JSON.stringify(cart));
}

function updateCartUI(){
  const totalQty = cart.reduce((s,i)=>s+i.qty,0);
  cartCount.textContent = totalQty;
  // actualizar contenido del modal
  cartList.innerHTML = '';
  cart.forEach(item=>{
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div style="flex:1">
        <div>${item.name}</div>
        <div class="muted">${item.qty} × $${item.price.toFixed(2)}</div>
      </div>
      <div style="text-align:right">
        <div>$${(item.qty*item.price).toFixed(2)}</div>
        <div style="margin-top:6px"><button class="btn secondary small" data-id="${item.id}">−</button> <button class="btn secondary small" data-id="${item.id}" data-add="1">+</button></div>
      </div>
    `;
    // botones +/−
    li.querySelectorAll('button').forEach(b=>{
      b.addEventListener('click', ()=>{
        const id = Number(b.getAttribute('data-id'));
        if(b.hasAttribute('data-add')) changeQty(id, +1);
        else changeQty(id, -1);
      });
    });
    cartList.appendChild(li);
  });
  const total = cart.reduce((s,i)=>s + i.qty*i.price,0);
  cartTotal.textContent = total.toFixed(2);
}

function changeQty(id, delta){
  const item = cart.find(c=>c.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty<=0) cart = cart.filter(c=>c.id!==id);
  persistCart();
  updateCartUI();
}

cartBtn.addEventListener('click', ()=>{ openCart(); });
closeCart.addEventListener('click', ()=>{ closeCartModal(); });
clearCart.addEventListener('click', ()=>{ cart = []; persistCart(); updateCartUI(); });
checkout.addEventListener('click', ()=>{ alert('Simulación de pago. Total: $' + cartTotal.textContent); });

function openCart(){
  cartModal.setAttribute('aria-hidden','false');
}
function closeCartModal(){
  cartModal.setAttribute('aria-hidden','true');
}

// Cerrar modal con ESC o click fuera
cartModal.addEventListener('click', (e)=>{ if(e.target===cartModal) closeCartModal(); });
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeCartModal(); });
