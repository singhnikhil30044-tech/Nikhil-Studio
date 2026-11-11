import { store } from '../store';
import { ModalManager } from './Modals';
import { ServiceCategory } from '../types';

export function renderPackagesView(modalManager: ModalManager, filterCat = 'all'): string {
  const s = store.settings;
  const packages = store.packages.filter(p => {
    if (filterCat === 'all') return true;
    return p.category === filterCat;
  });

  return `
    <div class="space-y-6 sm:space-y-8 animate-fade-in">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 material-symbols-outlined">diamond</span>
            <h1 class="text-xl sm:text-2xl font-bold font-cinzel text-amber-300">
              Studio Service Packages & Bespoke Pricing
            </h1>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Luxury tiered offerings for editorial photography, 4K wedding cinema, Dolby Atmos mixing, and custom commercial bundles.
          </p>
        </div>

        <button id="addPackageBtn" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-bold shadow-lg shadow-amber-500/20 hover:opacity-95">
          <span class="material-symbols-outlined text-sm">add_circle</span>
          <span>Create New Package</span>
        </button>
      </div>

      <!-- Category Filter -->
      <div class="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs w-fit">
        ${[
          { id: 'all', label: 'All Packages' },
          { id: 'photo', label: 'Photography' },
          { id: 'video', label: '4K Cinema / Video' },
          { id: 'audio', label: 'Audio & Mixing' },
          { id: 'combo', label: 'All-In-One Combos' },
        ].map(c => `
          <button data-cat-filter="${c.id}" class="pkg-cat-btn px-3 py-1.5 rounded-lg font-medium transition-all ${
            filterCat === c.id
              ? 'bg-amber-400 text-black font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }">
            ${c.label}
          </button>
        `).join('')}
      </div>

      <!-- Packages Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${packages.map(pkg => `
          <div class="glass-panel p-6 sm:p-7 border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between relative group ${
            pkg.isPopular ? 'border-amber-500/50 shadow-xl shadow-amber-500/5' : ''
          }">
            ${pkg.isPopular ? `
              <div class="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md">
                Signature Collection
              </div>
            ` : ''}

            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  pkg.category === 'combo' ? 'bg-amber-500/20 text-amber-300' :
                  pkg.category === 'video' ? 'bg-blue-500/20 text-blue-300' :
                  pkg.category === 'photo' ? 'bg-purple-500/20 text-purple-300' :
                  'bg-emerald-500/20 text-emerald-300'
                }">${pkg.category.toUpperCase()}</span>
                <span class="text-xs text-slate-400">${pkg.duration}</span>
              </div>

              <h3 class="text-lg font-bold text-white font-cinzel group-hover:text-amber-300 transition-colors">${pkg.name}</h3>
              <p class="text-xs text-slate-400 mt-2 leading-relaxed">${pkg.description}</p>

              <!-- Price Tag -->
              <div class="my-5 p-3.5 rounded-xl bg-[#0d0f17] border border-amber-500/20 flex items-baseline justify-between">
                <span class="text-xs text-slate-400">Total Investment</span>
                <div class="text-2xl font-black text-amber-400 font-cinzel">
                  ${s.currencySymbol}${pkg.price.toLocaleString()}
                </div>
              </div>

              <!-- Feature Bullets -->
              <div class="space-y-2 mb-6">
                <span class="text-[11px] font-bold uppercase text-slate-300 tracking-wider block">Included Deliverables:</span>
                ${pkg.features.map(f => `
                  <div class="flex items-start gap-2 text-xs text-slate-300">
                    <span class="material-symbols-outlined text-amber-400 text-sm mt-0.5 shrink-0">verified</span>
                    <span>${f}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Actions -->
            <div class="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <button data-book-pkg-id="${pkg.id}" class="book-this-pkg-btn flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-bold shadow-md hover:opacity-95 text-center">
                Book This Package
              </button>
              <button data-delete-pkg-id="${pkg.id}" class="delete-pkg-btn p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400" title="Delete Package">
                <span class="material-symbols-outlined text-base">delete</span>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function bindPackagesEvents(
  modalManager: ModalManager,
  onDataChanged: () => void,
  onFilterChanged: (cat: string) => void
) {
  document.querySelectorAll('.pkg-cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const cat = target.dataset.catFilter || 'all';
      onFilterChanged(cat);
    });
  });

  // Book this package
  document.querySelectorAll('.book-this-pkg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modalManager.openNewBookingModal();
    });
  });

  // Delete package
  document.querySelectorAll('.delete-pkg-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const pkgId = target.dataset.deletePkgId;
      const pkg = store.packages.find(p => p.id === pkgId);
      if (pkg && confirm(`Are you sure you want to delete package "${pkg.name}"?`)) {
        store.deletePackage(pkg.id);
        modalManager.showToast(`Deleted ${pkg.name}`);
        onDataChanged();
      }
    });
  });

  // Add new package modal
  document.getElementById('addPackageBtn')?.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto';
    modal.innerHTML = `
      <div class="relative w-full max-w-lg bg-[#0f121a] border border-amber-500/30 rounded-2xl p-6 sm:p-8 text-white shadow-2xl my-8">
        <div class="flex items-center justify-between pb-4 border-b border-white/10">
          <h2 class="text-lg font-bold font-cinzel text-amber-300">Create New Service Package</h2>
          <button id="closePkgModalBtn" class="text-slate-400 hover:text-white p-1 rounded-lg">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form id="newPkgForm" class="mt-4 space-y-3.5 text-xs">
          <div>
            <label class="block font-semibold text-slate-300 mb-1">Package Name *</label>
            <input type="text" id="pkgName" required placeholder="e.g. Masterclass Album & Drone Cinema" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white focus:outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Category *</label>
              <select id="pkgCat" required class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white focus:outline-none">
                <option value="photo">Photography</option>
                <option value="video">4K Cinema / Video</option>
                <option value="audio">Audio & Mixing</option>
                <option value="combo">All-In-One Combo</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Price (${store.settings.currencySymbol}) *</label>
              <input type="number" id="pkgPrice" required min="1" placeholder="3200" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white focus:outline-none" />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Duration / Scope *</label>
            <input type="text" id="pkgDuration" required placeholder="e.g. 8 Hours Full Coverage" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white focus:outline-none" />
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Package Description</label>
            <textarea id="pkgDesc" rows="2" placeholder="Brief summary of this premium offering" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white focus:outline-none"></textarea>
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Included Deliverables (One per line)</label>
            <textarea id="pkgFeatures" rows="3" placeholder="4K Raw Stills&#10;Drone Cinematography&#10;Private Online Proofing&#10;Leather Keepsake Album" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white focus:outline-none"></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button type="button" id="cancelPkgBtn" class="px-4 py-2 text-slate-300 hover:text-white rounded-lg bg-slate-800">Cancel</button>
            <button type="submit" class="px-5 py-2 font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-black">Save Package</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('#closePkgModalBtn')?.addEventListener('click', close);
    modal.querySelector('#cancelPkgBtn')?.addEventListener('click', close);

    const form = modal.querySelector('#newPkgForm') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (modal.querySelector('#pkgName') as HTMLInputElement).value;
      const category = (modal.querySelector('#pkgCat') as HTMLSelectElement).value as ServiceCategory;
      const price = parseFloat((modal.querySelector('#pkgPrice') as HTMLInputElement).value) || 0;
      const duration = (modal.querySelector('#pkgDuration') as HTMLInputElement).value;
      const description = (modal.querySelector('#pkgDesc') as HTMLTextAreaElement).value;
      const featuresRaw = (modal.querySelector('#pkgFeatures') as HTMLTextAreaElement).value;
      const features = featuresRaw.split('\n').map(l => l.trim()).filter(Boolean);

      store.addPackage({
        name,
        category,
        price,
        duration,
        description,
        features: features.length > 0 ? features : ['High-res masters included'],
        isPopular: false
      });

      modalManager.showToast(`Package "${name}" created!`);
      onDataChanged();
      close();
    });
  });
}
