import { store } from '../store';
import { ModalManager } from './Modals';

export function renderCustomersView(modalManager: ModalManager, searchQuery = ''): string {
  const s = store.settings;
  const filteredCustomers = store.customers.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  });

  return `
    <div class="space-y-6 sm:space-y-8 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 material-symbols-outlined">group</span>
            <h1 class="text-xl sm:text-2xl font-bold font-cinzel text-amber-300">
              Customer Relationship Management (CRM)
            </h1>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Maintain high-net-worth client profiles, booking history, lifetime revenue spend, and instant WhatsApp concierge.
          </p>
        </div>

        <button id="addCustHeaderBtn" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-bold shadow-lg shadow-amber-500/20 hover:opacity-95">
          <span class="material-symbols-outlined text-sm">person_add</span>
          <span>Add New Client</span>
        </button>
      </div>

      <!-- Search Input -->
      <div class="flex items-center gap-3">
        <div class="relative flex-1 max-w-md">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
          <input type="text" id="custSearchInput" value="${searchQuery}" placeholder="Search client by name, phone, or email..." class="w-full bg-[#11141d] border border-slate-800 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none" />
        </div>
        <span class="text-xs text-slate-400 font-medium">${filteredCustomers.length} clients registered</span>
      </div>

      <!-- Customers Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        ${filteredCustomers.map(c => {
          const clientBookings = store.bookings.filter(b => b.customerId === c.id);

          return `
            <div class="glass-panel p-5 sm:p-6 border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group">
              <div>
                <!-- Top Card Bar -->
                <div class="flex items-start justify-between gap-3 mb-4">
                  <div class="flex items-center gap-3">
                    <img src="${c.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}" alt="${c.name}" class="w-12 h-12 rounded-xl object-cover border border-amber-500/40 shadow-md" />
                    <div>
                      <h3 class="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors">${c.name}</h3>
                      <p class="text-[11px] text-slate-400 flex items-center gap-1">
                        <span class="material-symbols-outlined text-[12px] text-amber-400">location_on</span>
                        <span class="truncate max-w-[140px]">${c.address}</span>
                      </p>
                    </div>
                  </div>

                  ${c.vipStatus ? `
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
                      VIP
                    </span>
                  ` : ''}
                </div>

                <!-- Contact & Financials -->
                <div class="space-y-1.5 p-3 rounded-xl bg-[#0d0f17] border border-slate-800/80 text-xs mb-4">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400">Phone:</span>
                    <span class="font-medium text-slate-200">${c.phone}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400">Email:</span>
                    <span class="font-medium text-slate-200 truncate max-w-[150px]">${c.email}</span>
                  </div>
                  <div class="flex items-center justify-between pt-1 border-t border-white/5">
                    <span class="text-slate-400">Lifetime Spend:</span>
                    <span class="font-bold text-amber-400">${s.currencySymbol}${c.totalSpent.toLocaleString()}</span>
                  </div>
                </div>

                <!-- Notes -->
                ${c.notes ? `
                  <p class="text-[11px] text-slate-400 italic mb-4 line-clamp-2">"${c.notes}"</p>
                ` : ''}

                <!-- Booking History Count -->
                <div class="text-[11px] text-slate-400 mb-4 flex items-center justify-between">
                  <span>Completed / Active Shoots:</span>
                  <span class="font-bold text-white">${clientBookings.length} Bookings</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <button data-cust-book-id="${c.id}" class="cust-book-btn px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1">
                  <span class="material-symbols-outlined text-xs text-amber-400">calendar_add_on</span>
                  <span>Book</span>
                </button>

                <div class="flex items-center gap-1.5">
                  <button data-cust-wa-id="${c.id}" class="cust-wa-btn p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30" title="Direct WhatsApp">
                    <span class="material-symbols-outlined text-sm">chat</span>
                  </button>
                  <button data-cust-delete-id="${c.id}" class="cust-delete-btn p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400" title="Delete Profile">
                    <span class="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function bindCustomersEvents(
  modalManager: ModalManager,
  onDataChanged: () => void,
  onSearch: (q: string) => void
) {
  document.getElementById('addCustHeaderBtn')?.addEventListener('click', () => {
    modalManager.openNewCustomerModal();
  });

  const searchInput = document.getElementById('custSearchInput') as HTMLInputElement;
  searchInput?.addEventListener('input', (e) => {
    onSearch((e.target as HTMLInputElement).value);
  });

  // Book for this customer
  document.querySelectorAll('.cust-book-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const custId = target.dataset.custBookId;
      modalManager.openNewBookingModal(custId);
    });
  });

  // WhatsApp shortcut
  document.querySelectorAll('.cust-wa-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const custId = target.dataset.custWaId;
      const cust = store.customers.find(c => c.id === custId);
      if (cust) {
        modalManager.openWhatsAppModal(cust);
      }
    });
  });

  // Delete customer
  document.querySelectorAll('.cust-delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const custId = target.dataset.custDeleteId;
      const cust = store.customers.find(c => c.id === custId);
      if (cust && confirm(`Are you sure you want to delete profile for ${cust.name}?`)) {
        store.deleteCustomer(cust.id);
        modalManager.showToast(`Deleted ${cust.name}`);
        onDataChanged();
      }
    });
  });
}
