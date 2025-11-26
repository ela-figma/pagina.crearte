/* ===========================
   UTILIDADES BÁSICAS
=========================== */

// Inserta el año actual en el footer
document.getElementById('year').textContent = new Date().getFullYear();

/* ===========================
   MENÚ MÓVIL
   - Abre/cierra el menú en pantallas pequeñas
=========================== */
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
menuBtn.addEventListener('click', () => {
  const open = mobileNav.style.display === 'flex';
  mobileNav.style.display = open ? 'none' : 'flex';
});

/* ===========================
   CATÁLOGO
   - Lista de productos que se muestran en /catalogo
   - EDITA/AGREGA productos en el arreglo PRODUCTS
=========================== */
const PRODUCTS = [
  // 👉 EJEMPLOS (CÁMBIALOS POR LOS TUYOS)
  {
    id: 'tarj-01',
    name: 'Tarjetas de Presentación',
    category: 'tarjetas',                // tarjetas | volantes | catalogos | packaging | otros
    price: 'S/ 65 x 100',
    tags: ['Couché 300g', 'Laminado mate', 'Full color'],
    img: 'assets/catalog/tarjetas.jpg'   // 👉 Reemplaza con tu foto
  },
  {
    id: 'vol-01',
    name: 'Volantes A5',
    category: 'volantes',
    price: 'S/ 290 x 1000',
    tags: ['Couché 130g', '4/4 colores'],
    img: 'assets/catalog/volantes.jpg'
  },
  {
    id: 'cat-01',
    name: 'Catálogo 16 págs',
    category: 'catalogos',
    price: 'Desde S/ 9 c/u (100 u.)',
    tags: ['Tapa 250g', 'Interior 150g', 'Engrapado'],
    img: 'assets/catalog/catalogo.jpg'
  },
  {
    id: 'pack-01',
    name: 'Packaging Caja Plegadiza',
    category: 'packaging',
    price: 'Cotizar',
    tags: ['Cartulina sulfatada', 'Troquel', 'Barniz UV'],
    img: 'assets/catalog/packaging.jpg'
  },
  {
    id: 'ot-01',
    name: 'Afiches A3',
    category: 'otros',
    price: 'S/ 3.5 c/u (100 u.)',
    tags: ['Couché 150g', 'Full color'],
    img: 'assets/catalog/afiche.jpg'
  }
];

const catalogGrid = document.getElementById('catalogGrid');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');

/** Pinta el catálogo en la web según la lista recibida */
function renderCatalog(items){
  catalogGrid.innerHTML = items.map(p => `
    <article class="catalog-item">
      <img src="${p.img}" alt="${p.name}">
      <div class="info">
        <h3>${p.name}</h3>
        <div class="price">${p.price}</div>
        <div class="tags">
          ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    </article>
  `).join('');
}

/** Filtro por texto y categoría (llamado en cada cambio) */
function filterCatalog(){
  const q = (searchInput?.value || '').toLowerCase();
  const cat = categorySelect?.value || 'todas';
  const out = PRODUCTS.filter(p => {
    const byCat = cat === 'todas' || p.category === cat;
    const byText = p.name.toLowerCase().includes(q) || p.tags.join(' ').toLowerCase().includes(q);
    return byCat && byText;
  });
  renderCatalog(out);
}

// Escucha de filtros
searchInput?.addEventListener('input', filterCatalog);
categorySelect?.addEventListener('change', filterCatalog);

// Mostrar todo al inicio
if (catalogGrid) renderCatalog(PRODUCTS);

/* ===========================
   PEDIDOS
   - WhatsApp: genera un enlace con los datos del form
   - Submit: valida y guarda un registro local (localStorage)
=========================== */

// 👉 CAMBIA AQUÍ tu número de WhatsApp (sin '+'). Ej: 51 + tu número
const WHATSAPP_NUMBER = '51999999999';

const waLink = document.getElementById('waLink');
const orderForm = document.getElementById('orderForm');
const msg = document.getElementById('formMsg');

/** Valida formato de email simple */
function validateEmail(val){
  return /^\S+@\S+\.\S+$/.test(val);
}

/** Muestra/oculta el mensaje rojo de error bajo cada campo */
function showError(input, condition){
  const field = input.closest('.form-field');
  const err = field.querySelector('.error');
  if(!condition){
    err.style.display = 'block';
    input.setAttribute('aria-invalid','true');
  }else{
    err.style.display = 'none';
    input.removeAttribute('aria-invalid');
  }
}

/** Construye el texto para WhatsApp con los datos del form */
function buildWhatsAppText(data){
  const lines = [
    `Hola CREARTE, quiero cotizar:`,
    `• Nombre: ${data.name}`,
    `• Email: ${data.email}`,
    data.phone ? `• WhatsApp: ${data.phone}` : '',
    `• Producto: ${data.product}`,
    data.details ? `• Detalles: ${data.details}` : ''
  ].filter(Boolean);
  return encodeURIComponent(lines.join('\n'));
}

/** Actualiza el botón de WhatsApp cada vez que escribes algo */
function updateWaLink(){
  const data = {
    name: document.getElementById('name')?.value.trim() || '',
    email: document.getElementById('email')?.value.trim() || '',
    phone: document.getElementById('phone')?.value.trim() || '',
    product: document.getElementById('product')?.value || '',
    details: document.getElementById('details')?.value.trim() || ''
  };
  const text = buildWhatsAppText(data);
  if (waLink) waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

/** Escucha inputs para refrescar el enlace de WhatsApp */
document.querySelectorAll('#orderForm input, #orderForm select, #orderForm textarea').forEach(el=>{
  el.addEventListener('input', updateWaLink);
});
updateWaLink();

/** Maneja el envío del formulario (validación + registro local) */
const form = document.getElementById("orderForm");
const waLink = document.getElementById("waLink");

form.addEventListener("input", () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const product = document.getElementById("product").value;
  const details = document.getElementById("details").value;

  // Número de WhatsApp de CreArte (cámbialo si deseas)
  const waNumber = "51921595658";

  // Mensaje que se enviará
  const msg = `Hola, soy ${name}.
Correo: ${email}
WhatsApp: ${phone}
Producto: ${product}
Detalles: ${details}`;

  // Actualiza el link
  waLink.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
});

