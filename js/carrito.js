export class CarritoFDZ {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart_fdz')) || [];
    this.renderizar();
  }

  agregar(producto) {
    const existe = this.items.find(item => Number(item.id) === Number(producto.id));
    if (existe) {
      existe.cantidad += 1;
    } else {
      this.items.push({ ...producto, cantidad: 1 });
    }
    this.guardarYActualizar();
    this.abrirDrawer();
  }

  eliminar(id) {
    this.items = this.items.filter(item => Number(item.id) !== Number(id));
    this.guardarYActualizar();
  }

  cambiarCantidad(id, delta) {
    const item = this.items.find(i => Number(i.id) === Number(id));
    if (item) {
      item.cantidad += delta;
      if (item.cantidad <= 0) {
        this.eliminar(id);
      } else {
        this.guardarYActualizar();
      }
    }
  }

  guardarYActualizar() {
    localStorage.setItem('cart_fdz', JSON.stringify(this.items));
    this.renderizar();
  }

  calcularTotal() {
    return this.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  }

  calcularCantidadTotal() {
    return this.items.reduce((sum, item) => sum + item.cantidad, 0);
  }

  abrirDrawer() {
    document.getElementById('cart-drawer')?.classList.remove('translate-x-full');
    document.getElementById('cart-overlay')?.classList.remove('hidden');
  }

  cerrarDrawer() {
    document.getElementById('cart-drawer')?.classList.add('translate-x-full');
    document.getElementById('cart-overlay')?.classList.add('hidden');
  }

  renderizar() {
    // 1. Contador superior
    const badge = document.getElementById('cart-badge');
    const totalCount = this.calcularCantidadTotal();
    if (badge) {
      badge.textContent = totalCount;
      if (totalCount > 0) badge.classList.remove('hidden');
      else badge.classList.add('hidden');
    }

    // 2. Contenedor de items en el drawer (Corregido a 'cart-items-container')
    const container = document.getElementById('cart-items-container');
    if (container) {
      if (this.items.length === 0) {
        container.innerHTML = `
          <div class="text-center py-12 text-cocoa-700/60">
            <p class="text-base font-medium">Tu cesta está vacía</p>
            <p class="text-xs mt-1">¡Elige tus dulces favoritos de la vitrina!</p>
          </div>
        `;
      } else {
        container.innerHTML = this.items.map(item => `
          <div class="flex items-center gap-4 py-4 border-b border-cream-200">
            <img src="${item.imagen}" alt="${item.nombre}" class="w-16 h-16 object-cover rounded-xl bg-cream-200">
            <div class="flex-1">
              <h4 class="font-serif font-semibold text-cocoa-900 text-sm">${item.nombre}</h4>
              <span class="text-xs font-bold text-gold-600">${item.precio.toFixed(2)} €</span>
              <div class="flex items-center gap-3 mt-2">
                <button type="button" class="btn-qty-minus w-6 h-6 rounded-full border border-cream-300 flex items-center justify-center text-xs text-cocoa-900 hover:bg-cocoa-900 hover:text-cream-50 cursor-pointer" data-id="${item.id}">-</button>
                <span class="text-xs font-bold text-cocoa-900">${item.cantidad}</span>
                <button type="button" class="btn-qty-plus w-6 h-6 rounded-full border border-cream-300 flex items-center justify-center text-xs text-cocoa-900 hover:bg-cocoa-900 hover:text-cream-50 cursor-pointer" data-id="${item.id}">+</button>
              </div>
            </div>
            <button type="button" class="btn-remove text-cocoa-700/50 hover:text-red-600 p-2 cursor-pointer" data-id="${item.id}" title="Eliminar">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        `).join('');

        container.querySelectorAll('.btn-qty-plus').forEach(b => b.addEventListener('click', () => this.cambiarCantidad(b.dataset.id, 1)));
        container.querySelectorAll('.btn-qty-minus').forEach(b => b.addEventListener('click', () => this.cambiarCantidad(b.dataset.id, -1)));
        container.querySelectorAll('.btn-remove').forEach(b => b.addEventListener('click', () => this.eliminar(b.dataset.id)));
      }
    }

    // 3. Total en dinero
    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = this.calcularTotal().toFixed(2) + ' €';

    if (window.lucide) window.lucide.createIcons();
  }
}