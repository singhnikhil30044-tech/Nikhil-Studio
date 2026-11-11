import { store } from '../store';
import { Customer, Booking, Invoice, PackageItem, ServiceCategory } from '../types';
import { audioEngine } from '../audioEngine';

export class ModalManager {
  private container: HTMLElement;
  private onDataChanged: () => void;

  constructor(container: HTMLElement, onDataChanged: () => void) {
    this.container = container;
    this.onDataChanged = onDataChanged;
  }

  showToast(message: string, type: 'success' | 'info' | 'warning' = 'success') {
    const toast = document.createElement('div');
    const borderCol = type === 'success' ? 'border-amber-400' : type === 'warning' ? 'border-red-400' : 'border-blue-400';
    const icon = type === 'success' ? 'check_circle' : type === 'warning' ? 'warning' : 'info';
    
    toast.className = `fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-slate-900/95 text-white shadow-2xl border ${borderCol} backdrop-blur-xl animate-fade-in`;
    toast.innerHTML = `
      <span class="material-symbols-outlined text-amber-400">${icon}</span>
      <span class="text-sm font-medium tracking-wide">${message}</span>
    `;
    document.body.appendChild(toast);
    audioEngine.playBeep(type === 'success' ? 987 : 440, 0.08);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- New Booking Modal ---
  openNewBookingModal(preselectedCustomerId?: string) {
    const packages = store.packages;
    const customers = store.customers;
    const staff = store.staff;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto';
    modal.innerHTML = `
      <div class="relative w-full max-w-2xl bg-[#0f121a] border border-amber-500/30 rounded-2xl p-6 sm:p-8 text-white shadow-2xl my-8">
        <div class="flex items-center justify-between pb-5 border-b border-white/10">
          <div class="flex items-center gap-3">
            <span class="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 material-symbols-outlined">event_available</span>
            <div>
              <h2 class="text-xl font-bold font-cinzel text-amber-300">New Studio Booking</h2>
              <p class="text-xs text-slate-400">Schedule photography, 4K film, or audio session</p>
            </div>
          </div>
          <button id="closeModalBtn" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form id="newBookingForm" class="mt-6 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Customer *</label>
              <select id="bCustId" required class="w-full bg-[#171b26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none">
                <option value="">Select Existing Customer</option>
                ${customers.map(c => `
                  <option value="${c.id}" ${c.id === preselectedCustomerId ? 'selected' : ''}>${c.name} (${c.phone})</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Service Category *</label>
              <select id="bCategory" required class="w-full bg-[#171b26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none">
                <option value="photo">Photography Shoot</option>
                <option value="video">4K Cinema / Videography</option>
                <option value="audio">Audio Recording & Mixing</option>
                <option value="combo">The Magnum Opus Combo</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Project / Shoot Title *</label>
            <input type="text" id="bTitle" required placeholder="e.g. Royal Wedding Cinema or Vocal EP Master" class="w-full bg-[#171b26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Service Package *</label>
              <select id="bPackageId" required class="w-full bg-[#171b26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none">
                ${packages.map(p => `
                  <option value="${p.id}" data-price="${p.price}" data-name="${p.name}">
                    ${p.name} - ${store.settings.currencySymbol}${p.price.toLocaleString()}
                  </option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Shoot / Session Date *</label>
              <input type="date" id="bDate" required value="2026-11-12" class="w-full bg-[#171b26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Time Window *</label>
              <input type="text" id="bTime" required value="10:00 - 16:00" placeholder="e.g. 14:00 - 18:00" class="w-full bg-[#171b26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Shoot Location *</label>
              <input type="text" id="bLocation" required value="Main Cyclorama Studio A" placeholder="e.g. Studio A or Malibu Coastal Beach" class="w-full bg-[#171b26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Total Package Price (${store.settings.currencySymbol}) *</label>
              <input type="number" id="bTotalAmount" required value="2400" min="0" class="w-full bg-[#171b26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Advance Payment Collected (${store.settings.currencySymbol})</label>
              <input type="number" id="bAdvancePaid" value="1000" min="0" class="w-full bg-[#171b26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Lead Crew / Staff Assignment</label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              ${staff.map(s => `
                <label class="flex items-center gap-2 p-2 rounded-lg bg-[#151922] border border-slate-800 text-xs text-slate-300 hover:border-amber-500/50 cursor-pointer">
                  <input type="checkbox" name="staffSelect" value="${s.id}" class="accent-amber-500" />
                  <span class="truncate">${s.name}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Special Instructions & Shot Notes</label>
            <textarea id="bNotes" rows="2" placeholder="e.g. Needs drone clearance, vintage anamorphic look, prompt client review" class="w-full bg-[#171b26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" id="cancelBtn" class="px-5 py-2.5 text-sm text-slate-300 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700">Cancel</button>
            <button type="submit" class="px-6 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-black hover:opacity-95 shadow-lg shadow-amber-500/20">
              Confirm & Book
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Sync package price when package selection changes
    const pkgSelect = modal.querySelector('#bPackageId') as HTMLSelectElement;
    const priceInput = modal.querySelector('#bTotalAmount') as HTMLInputElement;
    pkgSelect.addEventListener('change', () => {
      const opt = pkgSelect.selectedOptions[0];
      if (opt && opt.dataset.price) {
        priceInput.value = opt.dataset.price;
      }
    });

    const close = () => modal.remove();
    modal.querySelector('#closeModalBtn')?.addEventListener('click', close);
    modal.querySelector('#cancelBtn')?.addEventListener('click', close);

    const form = modal.querySelector('#newBookingForm') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const custId = (modal.querySelector('#bCustId') as HTMLSelectElement).value;
      const cust = store.customers.find(c => c.id === custId);
      if (!cust) {
        alert('Please select a valid customer.');
        return;
      }

      const category = (modal.querySelector('#bCategory') as HTMLSelectElement).value as ServiceCategory;
      const title = (modal.querySelector('#bTitle') as HTMLInputElement).value;
      const opt = pkgSelect.selectedOptions[0];
      const pkgId = pkgSelect.value;
      const pkgName = opt ? (opt.dataset.name || opt.text) : 'Studio Package';
      const date = (modal.querySelector('#bDate') as HTMLInputElement).value;
      const time = (modal.querySelector('#bTime') as HTMLInputElement).value;
      const location = (modal.querySelector('#bLocation') as HTMLInputElement).value;
      const totalAmount = parseFloat((modal.querySelector('#bTotalAmount') as HTMLInputElement).value) || 0;
      const advancePaid = parseFloat((modal.querySelector('#bAdvancePaid') as HTMLInputElement).value) || 0;
      const notes = (modal.querySelector('#bNotes') as HTMLTextAreaElement).value;

      const checkedStaff = Array.from(modal.querySelectorAll('input[name="staffSelect"]:checked')).map(
        (cb) => (cb as HTMLInputElement).value
      );

      const balanceDue = Math.max(0, totalAmount - advancePaid);
      const paymentStatus = balanceDue === 0 ? 'paid' : (advancePaid > 0 ? 'partial' : 'unpaid');

      store.addBooking({
        customerId: cust.id,
        customerName: cust.name,
        customerPhone: cust.phone,
        customerEmail: cust.email,
        serviceCategory: category,
        title,
        packageId: pkgId,
        packageName: pkgName,
        date,
        time,
        location,
        status: 'confirmed',
        totalAmount,
        advancePaid,
        balanceDue,
        paymentStatus,
        assignedStaffIds: checkedStaff,
        notes,
        shotList: [title, 'Main Master Take', 'B-Roll & Details']
      });

      this.showToast(`Booking created for ${cust.name}!`);
      this.onDataChanged();
      close();
    });
  }

  // --- New Customer Modal ---
  openNewCustomerModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto';
    modal.innerHTML = `
      <div class="relative w-full max-w-lg bg-[#0f121a] border border-amber-500/30 rounded-2xl p-6 sm:p-8 text-white shadow-2xl my-8">
        <div class="flex items-center justify-between pb-5 border-b border-white/10">
          <div class="flex items-center gap-3">
            <span class="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 material-symbols-outlined">person_add</span>
            <div>
              <h2 class="text-xl font-bold font-cinzel text-amber-300">Add New Customer</h2>
              <p class="text-xs text-slate-400">Save client contact profile and preferences</p>
            </div>
          </div>
          <button id="closeModalBtn" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form id="newCustForm" class="mt-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Full Name / Organization *</label>
            <input type="text" id="cName" required placeholder="e.g. Victoria & Alexander Sterling" class="w-full bg-[#171b26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number *</label>
              <input type="tel" id="cPhone" required placeholder="+1 (555) 123-4567" class="w-full bg-[#171b26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Email Address *</label>
              <input type="email" id="cEmail" required placeholder="client@luxurybrand.com" class="w-full bg-[#171b26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Location / City Address</label>
            <input type="text" id="cAddress" placeholder="e.g. Beverly Hills, CA" class="w-full bg-[#171b26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Avatar / Photo URL (Optional)</label>
            <input type="url" id="cAvatar" placeholder="https://images.unsplash.com/..." class="w-full bg-[#171b26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">VIP Client Status</label>
            <label class="flex items-center gap-2 text-sm text-amber-300 cursor-pointer">
              <input type="checkbox" id="cVIP" class="accent-amber-500 w-4 h-4" />
              <span>Mark as High-Priority VIP Client</span>
            </label>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Creative Notes & Preferences</label>
            <textarea id="cNotes" rows="2" placeholder="e.g. Loves cinematic anamorphic tone, prefers evening calls" class="w-full bg-[#171b26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" id="cancelBtn" class="px-5 py-2.5 text-sm text-slate-300 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700">Cancel</button>
            <button type="submit" class="px-6 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-400 to-yellow-600 text-black hover:opacity-95 shadow-lg shadow-amber-500/20">
              Save Customer
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('#closeModalBtn')?.addEventListener('click', close);
    modal.querySelector('#cancelBtn')?.addEventListener('click', close);

    const form = modal.querySelector('#newCustForm') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (modal.querySelector('#cName') as HTMLInputElement).value;
      const phone = (modal.querySelector('#cPhone') as HTMLInputElement).value;
      const email = (modal.querySelector('#cEmail') as HTMLInputElement).value;
      const address = (modal.querySelector('#cAddress') as HTMLInputElement).value || 'Los Angeles, CA';
      const avatarUrl = (modal.querySelector('#cAvatar') as HTMLInputElement).value || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
      const vipStatus = (modal.querySelector('#cVIP') as HTMLInputElement).checked;
      const notes = (modal.querySelector('#cNotes') as HTMLTextAreaElement).value;

      store.addCustomer({
        name,
        phone,
        email,
        address,
        avatarUrl,
        vipStatus,
        notes
      });

      this.showToast(`Customer ${name} added successfully!`);
      this.onDataChanged();
      close();
    });
  }

  // --- Professional Printable Invoice Modal ---
  openInvoiceModal(invoice: Invoice) {
    const s = store.settings;
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto';

    modal.innerHTML = `
      <div class="relative w-full max-w-3xl bg-[#0f1118] border border-amber-500/40 rounded-2xl p-6 sm:p-10 text-white shadow-2xl my-6">
        <!-- Action Header -->
        <div class="flex items-center justify-between pb-6 border-b border-amber-500/20 no-print">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-400">receipt_long</span>
            <span class="font-cinzel text-lg font-bold text-amber-300">Invoice: ${invoice.invoiceNumber}</span>
          </div>
          <div class="flex items-center gap-3">
            <button id="printInvoiceBtn" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold text-xs hover:bg-amber-400">
              <span class="material-symbols-outlined text-sm">print</span>
              <span>Print / Save PDF</span>
            </button>
            <button id="closeInvoiceBtn" class="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <!-- Printable Document Canvas -->
        <div id="printableContent" class="invoice-printable pt-6 text-slate-100">
          <!-- Studio Header -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-3xl text-amber-400">camera</span>
                <span class="font-cinzel text-2xl font-black text-amber-300 tracking-wider">${s.studioName}</span>
              </div>
              <p class="text-xs text-amber-200/80 mt-1 italic">${s.tagline}</p>
              <p class="text-xs text-slate-400 mt-2">${s.address}</p>
              <p class="text-xs text-slate-400">${s.phone} | ${s.email}</p>
            </div>
            <div class="text-left sm:text-right">
              <span class="inline-block px-3 py-1 text-xs font-bold uppercase rounded-md ${
                invoice.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                invoice.paymentStatus === 'partial' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }">${invoice.paymentStatus.toUpperCase()}</span>
              <p class="text-xs text-slate-400 mt-2">Invoice Date: <span class="text-white font-medium">${invoice.issueDate}</span></p>
              <p class="text-xs text-slate-400">Due Date: <span class="text-white font-medium">${invoice.dueDate}</span></p>
            </div>
          </div>

          <!-- Client Info & Bill To -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <span class="text-xs uppercase font-bold text-amber-400 tracking-wider">Bill To Client</span>
              <h3 class="text-base font-bold text-white mt-1">${invoice.customerName}</h3>
              <p class="text-xs text-slate-300">${invoice.customerPhone}</p>
              <p class="text-xs text-slate-300">${invoice.customerEmail}</p>
              <p class="text-xs text-slate-400 mt-1">${invoice.customerAddress}</p>
            </div>
            <div>
              <span class="text-xs uppercase font-bold text-amber-400 tracking-wider">Payment Details</span>
              <p class="text-xs text-slate-300 mt-1">Bank: <span class="text-white">${s.bankDetails.bankName}</span></p>
              <p class="text-xs text-slate-300">Account: <span class="text-white">${s.bankDetails.accountName} (${s.bankDetails.accountNumber})</span></p>
              <p class="text-xs text-slate-300">Routing / IFSC: <span class="text-white">${s.bankDetails.ifscOrRouting}</span></p>
              <p class="text-xs text-slate-300">UPI / Wire: <span class="text-amber-300">${s.bankDetails.upiId}</span></p>
            </div>
          </div>

          <!-- Items Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-amber-500/30 text-amber-300 font-semibold uppercase">
                  <th class="py-2.5 px-3">Item Description</th>
                  <th class="py-2.5 px-3 text-center">Qty</th>
                  <th class="py-2.5 px-3 text-right">Unit Rate</th>
                  <th class="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                ${invoice.items.map(item => `
                  <tr>
                    <td class="py-3 px-3 font-medium text-slate-200">${item.description}</td>
                    <td class="py-3 px-3 text-center text-slate-400">${item.qty}</td>
                    <td class="py-3 px-3 text-right text-slate-400">${s.currencySymbol}${item.rate.toLocaleString()}</td>
                    <td class="py-3 px-3 text-right font-semibold text-white">${s.currencySymbol}${item.amount.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Total Calculations -->
          <div class="flex justify-end mt-6">
            <div class="w-full sm:w-72 space-y-2 text-xs">
              <div class="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span class="text-white font-medium">${s.currencySymbol}${invoice.subtotal.toLocaleString()}</span>
              </div>
              <div class="flex justify-between text-slate-400">
                <span>Tax (${invoice.taxRate}%):</span>
                <span class="text-white font-medium">${s.currencySymbol}${invoice.taxAmount.toLocaleString()}</span>
              </div>
              ${invoice.discount > 0 ? `
                <div class="flex justify-between text-emerald-400">
                  <span>Special VIP Discount:</span>
                  <span>-${s.currencySymbol}${invoice.discount.toLocaleString()}</span>
                </div>
              ` : ''}
              <div class="flex justify-between pt-2 border-t border-white/10 text-sm font-bold text-amber-300">
                <span>Grand Total:</span>
                <span>${s.currencySymbol}${invoice.totalAmount.toLocaleString()}</span>
              </div>
              <div class="flex justify-between text-slate-400">
                <span>Advance Paid:</span>
                <span class="text-emerald-400 font-medium">-${s.currencySymbol}${invoice.advancePaid.toLocaleString()}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-amber-500/30 text-base font-extrabold text-amber-400">
                <span>Balance Due:</span>
                <span>${s.currencySymbol}${invoice.balanceDue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="mt-8 pt-4 border-t border-white/10 text-xs text-slate-400">
            <p class="font-semibold text-slate-300">Terms & Conditions:</p>
            <p class="mt-1">${invoice.notes || 'All high-res deliverables are released once final payment is cleared. Thank you for your partnership.'}</p>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-between pt-6 mt-6 border-t border-white/10 no-print">
          ${invoice.balanceDue > 0 ? `
            <button id="markPaidBtn" class="px-4 py-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">price_check</span>
              <span>Record Full Balance Payment</span>
            </button>
          ` : `
            <span class="text-xs text-emerald-400 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base">check_circle</span>
              Paid in full
            </span>
          `}
          <button id="closeInvoiceBottomBtn" class="px-5 py-2 text-xs text-slate-300 hover:text-white rounded-xl bg-slate-800">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('#closeInvoiceBtn')?.addEventListener('click', close);
    modal.querySelector('#closeInvoiceBottomBtn')?.addEventListener('click', close);

    modal.querySelector('#printInvoiceBtn')?.addEventListener('click', () => {
      window.print();
    });

    modal.querySelector('#markPaidBtn')?.addEventListener('click', () => {
      store.markInvoicePaid(invoice.id);
      // Also update related booking
      const b = store.bookings.find(x => x.id === invoice.bookingId);
      if (b) {
        store.recordBookingPayment(b.id, b.balanceDue);
      }
      this.showToast(`Invoice ${invoice.invoiceNumber} marked as fully paid!`);
      this.onDataChanged();
      close();
    });
  }

  // --- WhatsApp Sharing Modal ---
  openWhatsAppModal(customer: Customer, booking?: Booking) {
    const s = store.settings;
    const defaultMsg = booking 
      ? `Dear ${customer.name},\n\nGreetings from ${s.studioName}! 🌟\n\nYour shoot for "${booking.title}" is confirmed for ${booking.date} at ${booking.time} (${booking.location}).\n\nAdvance Paid: ${s.currencySymbol}${booking.advancePaid}\nBalance Due: ${s.currencySymbol}${booking.balanceDue}\n\nOur creative crew is looking forward to creating cinematic magic with you!\n\nWarm regards,\n${s.studioName} Team`
      : `Dear ${customer.name},\n\nGreetings from ${s.studioName}! 🌟\n\nWe wanted to check in regarding your photography, video, or audio production requirements. Let us know how we can bring your next vision to life!\n\nWarm regards,\n${s.studioName}`;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md';
    modal.innerHTML = `
      <div class="relative w-full max-w-lg bg-[#0f121a] border border-emerald-500/40 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
        <div class="flex items-center justify-between pb-4 border-b border-white/10">
          <div class="flex items-center gap-3">
            <span class="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 material-symbols-outlined">chat</span>
            <div>
              <h2 class="text-lg font-bold font-cinzel text-emerald-300">WhatsApp Studio Message</h2>
              <p class="text-xs text-slate-400">To: ${customer.name} (${customer.phone})</p>
            </div>
          </div>
          <button id="closeWaBtn" class="text-slate-400 hover:text-white p-1 rounded-lg">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="mt-4 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Formatted Message Template</label>
            <textarea id="waMessageText" rows="9" class="w-full bg-[#161a25] border border-slate-700 focus:border-emerald-400 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none leading-relaxed">${defaultMsg}</textarea>
          </div>

          <div class="flex items-center justify-between pt-2">
            <button id="copyWaBtn" class="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-2 rounded-lg">
              <span class="material-symbols-outlined text-sm">content_copy</span>
              <span>Copy Text</span>
            </button>
            <button id="sendWaBtn" class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs shadow-lg shadow-emerald-500/20">
              <span class="material-symbols-outlined text-sm">send</span>
              <span>Launch WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('#closeWaBtn')?.addEventListener('click', close);

    const copyBtn = modal.querySelector('#copyWaBtn') as HTMLButtonElement;
    copyBtn.addEventListener('click', () => {
      const text = (modal.querySelector('#waMessageText') as HTMLTextAreaElement).value;
      navigator.clipboard.writeText(text);
      this.showToast('Message copied to clipboard!');
    });

    const sendBtn = modal.querySelector('#sendWaBtn') as HTMLButtonElement;
    sendBtn.addEventListener('click', () => {
      const text = (modal.querySelector('#waMessageText') as HTMLTextAreaElement).value;
      const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
      const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
      this.showToast('WhatsApp launched!');
      close();
    });
  }

  // --- Photo Proofing Lightbox Modal ---
  openPhotoProofingModal(projectId: string, photoId: string) {
    const proj = store.projects.find(p => p.id === projectId);
    const photo = proj?.proofingPhotos?.find(ph => ph.id === photoId);
    if (!proj || !photo) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg';
    modal.innerHTML = `
      <div class="relative w-full max-w-4xl bg-[#0f1118] border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl text-white">
        <!-- Image Preview -->
        <div class="relative bg-black flex items-center justify-center max-h-[65vh] overflow-hidden">
          <img src="${photo.url}" alt="${photo.title}" class="w-full h-full object-contain" />
          <button id="closePhotoBtn" class="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Info & Approval Controls -->
        <div class="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 bg-[#141722]">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-bold text-amber-300 font-cinzel">${photo.title}</h3>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                photo.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                photo.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }">${photo.status}</span>
            </div>
            <p class="text-xs text-slate-400 mt-1">Project: ${proj.title}</p>
            ${photo.clientComment ? `
              <p class="text-xs text-amber-200 mt-1 italic">" ${photo.clientComment} "</p>
            ` : ''}
          </div>

          <div class="flex items-center gap-2.5">
            <button id="approveBtn" class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold">
              <span class="material-symbols-outlined text-sm">thumb_up</span>
              <span>Approve for Master Edit</span>
            </button>
            <button id="rejectBtn" class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold">
              <span class="material-symbols-outlined text-sm">thumb_down</span>
              <span>Flag / Reject</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('#closePhotoBtn')?.addEventListener('click', close);

    modal.querySelector('#approveBtn')?.addEventListener('click', () => {
      store.toggleProofingPhotoStatus(projectId, photoId, 'approved');
      this.showToast('Photo approved!');
      this.onDataChanged();
      close();
    });

    modal.querySelector('#rejectBtn')?.addEventListener('click', () => {
      store.toggleProofingPhotoStatus(projectId, photoId, 'rejected');
      this.showToast('Photo flagged for revision.');
      this.onDataChanged();
      close();
    });
  }

  // --- Add Expense Modal ---
  openAddExpenseModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md';
    modal.innerHTML = `
      <div class="relative w-full max-w-md bg-[#0f121a] border border-amber-500/30 rounded-2xl p-6 text-white shadow-2xl">
        <div class="flex items-center justify-between pb-4 border-b border-white/10">
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 material-symbols-outlined">payments</span>
            <h2 class="text-lg font-bold font-cinzel text-amber-300">Log Studio Expense</h2>
          </div>
          <button id="closeExpBtn" class="text-slate-400 hover:text-white p-1 rounded-lg">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form id="expenseForm" class="mt-4 space-y-3.5 text-xs">
          <div>
            <label class="block font-semibold text-slate-300 mb-1">Expense Description *</label>
            <input type="text" id="expTitle" required placeholder="e.g. Cinema Lens Rental or High-Speed Internet" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white focus:outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Amount (${store.settings.currencySymbol}) *</label>
              <input type="number" id="expAmount" required min="1" placeholder="450" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Category *</label>
              <select id="expCategory" required class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white focus:outline-none">
                <option value="Equipment & Gear">Equipment & Gear</option>
                <option value="Studio Rent & Power">Studio Rent & Power</option>
                <option value="Software & Plugins">Software & Plugins</option>
                <option value="Freelancers & Crew">Freelancers & Crew</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Date</label>
            <input type="date" id="expDate" value="2026-11-11" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white focus:outline-none" />
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Receipt Number / Vendor Note</label>
            <input type="text" id="expReceipt" placeholder="e.g. B&H Photo INV-9481" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white focus:outline-none" />
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button type="button" id="cancelExpBtn" class="px-4 py-2 text-slate-300 hover:text-white rounded-lg bg-slate-800">Cancel</button>
            <button type="submit" class="px-5 py-2 font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-black">Record Expense</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('#closeExpBtn')?.addEventListener('click', close);
    modal.querySelector('#cancelExpBtn')?.addEventListener('click', close);

    const form = modal.querySelector('#expenseForm') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = (modal.querySelector('#expTitle') as HTMLInputElement).value;
      const amount = parseFloat((modal.querySelector('#expAmount') as HTMLInputElement).value) || 0;
      const category = (modal.querySelector('#expCategory') as HTMLSelectElement).value as any;
      const date = (modal.querySelector('#expDate') as HTMLInputElement).value;
      const receiptNumber = (modal.querySelector('#expReceipt') as HTMLInputElement).value;

      store.addExpense({
        title,
        amount,
        category,
        date,
        receiptNumber
      });

      this.showToast('Expense recorded successfully!');
      this.onDataChanged();
      close();
    });
  }
}
