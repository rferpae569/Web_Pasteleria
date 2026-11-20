import { CarritoFDZ } from './carrito.js';

// Catálogo completo
const productosData = [
  {
    id: 1,
    nombre: "Tarta Suprema de Cacao 70%",
    categoria: "tartas",
    precio: 32.00,
    descripcion: "Bizcocho húmedo de cacao con ganache de chocolate belga y avellanas tostadas.",
    imagen: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80",
    etiqueta: "Estrella del Obrador"
  },
  {
    id: 2,
    nombre: "Croissant Artesanal de Mantequilla",
    categoria: "bolleria",
    precio: 2.20,
    descripcion: "Hojaldre crujiente elaborado con mantequilla P.D.O. de Bretaña y fermentación lenta.",
    imagen: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=80",
    etiqueta: "Horneado a las 07:00"
  },
  {
    id: 3,
    nombre: "Tartaleta de Frutos Rojos y Vainilla",
    categoria: "dulces",
    precio: 4.50,
    descripcion: "Base crujiente sablé, crema ligera de vainilla de Madagascar y frambuesas frescas.",
    imagen: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1000&q=80",
    etiqueta: "Temporada"
  },
  {
    id: 4,
    nombre: "Tarta de Queso Cremosa al Horno",
    categoria: "tartas",
    precio: 28.00,
    descripcion: "Interior cremoso de queso artesanal con tostado sutil al horno y base de galleta crujiente.",
    imagen: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1000&q=80",
    etiqueta: "Recomendada"
  },
 {
  "id": 5,
  "nombre": "Napolitana de Chocolate Belga",
  "categoria": "bolleria",
  "precio": 2.50,
  "descripcion": "Masa de hojaldre dorada y crujiente rellena de dos barritas de auténtico chocolate negro.",
  "imagen": "https://images.immediate.co.uk/production/volatile/sites/2/2023/08/230901PAINAUCHOCOLAT07062-180bffc.jpg?resize=768,869",
  "etiqueta": "Recomendada"
},
  {
    id: 6,
    nombre: "Macarons Artesanales (Caja de 6)",
    categoria: "dulces",
    precio: 12.00,
    descripcion: "Surtido de alta pastelería francesa: pistacho, frambuesa, vainilla, café y chocolate.",
    imagen: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=1000&q=80",
    etiqueta: "Edición Limitada"
  }
];

const carrito = new CarritoFDZ();

function mostrarToast(mensaje) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'bg-cocoa-900 text-cream-50 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium flex items-center gap-2 border border-gold-500/30 pointer-events-auto';
  toast.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 text-gold-400"></i><span>${mensaje}</span>`;
  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

function renderizarCatalogo(categoria) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const filtrados = categoria === 'all'
    ? productosData
    : productosData.filter(p => p.categoria === categoria);

  grid.innerHTML = filtrados.map(prod => `
    <article class="bg-white border border-cream-200 rounded-3xl overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
      <div class="relative h-60 overflow-hidden bg-cream-200">
        <img src="${prod.imagen}" alt="${prod.nombre}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://placehold.co/600x400/422B20/FDFBF7?text=Pasteleria+FDZ'">
        ${prod.etiqueta ? `<span class="absolute top-3 left-3 bg-cocoa-900/95 backdrop-blur-md text-cream-50 text-[11px] font-semibold px-3 py-1 rounded-full tracking-wide border border-gold-500/30">${prod.etiqueta}</span>` : ''}
      </div>
      <div class="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start gap-2 mb-2">
            <h3 class="text-xl font-serif font-bold text-cocoa-900">${prod.nombre}</h3>
            <span class="font-bold text-gold-600 text-lg whitespace-nowrap">${prod.precio.toFixed(2)} €</span>
          </div>
          <p class="text-sm text-cocoa-700 leading-relaxed mb-6">${prod.descripcion}</p>
        </div>
        <button type="button" class="btn-add w-full py-3 px-4 rounded-2xl bg-cream-100 hover:bg-cocoa-900 text-cocoa-900 hover:text-cream-50 border border-cream-300 hover:border-cocoa-900 text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2" data-id="${prod.id}">
          <i data-lucide="shopping-bag" class="w-4 h-4"></i>
          <span>Añadir al pedido</span>
        </button>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
      window.addToCart(btn.dataset.id);
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

// Funciones globales vinculadas al HTML
window.addToCart = function(id) {
  const producto = productosData.find(p => Number(p.id) === Number(id));
  if (producto) {
    carrito.agregar(producto);
    mostrarToast(`¡${producto.nombre} añadido al pedido!`);
  }
};

window.toggleCartDrawer = function() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (drawer?.classList.contains('translate-x-full')) {
    carrito.abrirDrawer();
  } else {
    carrito.cerrarDrawer();
  }
};

window.openCustomModal = function() {
  document.getElementById('custom-order-modal')?.classList.remove('hidden');
};

window.closeCustomModal = function() {
  document.getElementById('custom-order-modal')?.classList.add('hidden');
};

window.toggleMobileMenu = function() {
  document.getElementById('mobile-menu')?.classList.toggle('hidden');
};

window.filterProducts = function(categoria) {
  document.querySelectorAll('#category-filters button').forEach(btn => {
    if (btn.dataset.filter === categoria) {
      btn.classList.add('bg-cocoa-900', 'text-cream-50', 'shadow-sm');
      btn.classList.remove('bg-white', 'text-cocoa-800', 'border', 'border-cream-300');
    } else {
      btn.classList.remove('bg-cocoa-900', 'text-cream-50', 'shadow-sm');
      btn.classList.add('bg-white', 'text-cocoa-800', 'border', 'border-cream-300');
    }
  });
  renderizarCatalogo(categoria);
};

// EJECUCIÓN DIRECTA (Sin esperar a DOMContentLoaded para evitar bloqueos de módulos)
renderizarCatalogo('all');
carrito.renderizar();

if (window.lucide) window.lucide.createIcons();