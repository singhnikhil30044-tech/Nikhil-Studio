import { store } from '../store';
import { ModalManager } from './Modals';

export function renderAccountingView(modalManager: ModalManager): string {
  const f = store.getFinancialSummary();
  const s = store.settings;
  const invoices = store.invoices;
  const expenses = store.expenses;

  return `
    <div class="space-y-6 sm:space-y-8 animate-fade-in">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 material-symbols-outlined">account_balance_wallet</span>
            <h1 class="text-xl sm:text-2xl font-bold font-cinzel text-amber-300">
              Billing, Invoices & Profit & Loss Accounting
            </h1>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Reconcile client deposits, print luxury PDF invoices, monitor operating expenditures, and review net studio margins.
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <button id="accLogExpBtn" class="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium">
            <span class="material-symbols-outlined text-sm text-amber-400">add_card</span>
            <span>Log Expense</span>
          </button>
        </div>
      </div>

      <!-- Financial Cards Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div class="glass-panel p-4">
          <span class="text-slate-400 text-xs font-medium block mb-1">Total Contracted</span>
          <div class="text-xl font-bold text-white font-cinzel">${s.currencySymbol}${f.totalRevenue.toLocaleString()}</div>
          <p class="text-[10px] text-slate-400 mt-1">All active invoices</p>
        </div>

        <div class="glass-panel p-4">
          <span class="text-slate-400 text-xs font-medium block mb-1">Cash Collected</span>
          <div class="text-xl font-bold text-emerald-400 font-cinzel">${s.currencySymbol}${f.collectedRevenue.toLocaleString()}</div>
          <p class="text-[10px] text-emerald-300/80 mt-1">Advance & cleared payments</p>
        </div>

        <div class="glass-panel p-4">
          <span class="text-slate-400 text-xs font-medium block mb-1">Pending Receivables</span>
          <div class="text-xl font-bold text-rose-400 font-cinzel">${s.currencySymbol}${f.pendingBalance.toLocaleString()}</div>
          <p class="text-[10px] text-rose-300/80 mt-1">Pending final master release</p>
        </div>

        <div class="glass-panel p-4">
          <span class="text-slate-400 text-xs font-medium block mb-1">Studio Expenses</span>
          <div class="text-xl font-bold text-slate-200 font-cinzel">${s.currencySymbol}${f.totalExpenses.toLocaleString()}</div>
          <p class="text-[10px] text-slate-400 mt-1">Gear, power, crew & rent</p>
        </div>

        <div class="glass-panel-gold p-4 col-span-2 lg:col-span-1">
          <span class="text-amber-300 text-xs font-bold block mb-1 uppercase tracking-wider">Net Operating Profit</span>
          <div class="text-xl font-extrabold text-amber-300 font-cinzel">${s.currencySymbol}${f.netProfit.toLocaleString()}</div>
          <p class="text-[10px] text-amber-200/80 mt-1">Healthy studio margin</p>
        </div>
      </div>

      <!-- P&L Visual Bar -->
      <div class="glass-panel p-5 border-amber-500/20">
        <div class="flex items-center justify-between text-xs mb-2">
          <span class="font-bold text-slate-300">Revenue vs Operating Cost Ratio</span>
          <span class="text-amber-400 font-semibold">
            Profit Margin: ${f.collectedRevenue > 0 ? Math.round((f.netProfit / f.collectedRevenue) * 100) : 0}%
          </span>
        </div>
        <div class="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
          <div class="h-full bg-emerald-500" style="width: ${f.collectedRevenue > 0 ? (f.netProfit / f.collectedRevenue) * 100 : 70}%" title="Net Profit"></div>
          <div class="h-full bg-rose-500" style="width: ${f.collectedRevenue > 0 ? (f.totalExpenses / f.collectedRevenue) * 100 : 30}%" title="Operating Expenses"></div>
        </div>
        <div class="flex items-center justify-between text-[11px] text-slate-400 mt-2">
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Retained Earnings (${s.currencySymbol}${f.netProfit.toLocaleString()})</span>
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-rose-500"></span> Studio Overhead Expenses (${s.currencySymbol}${f.totalExpenses.toLocaleString()})</span>
        </div>
      </div>

      <!-- Invoices Section -->
      <div class="glass-panel p-5 sm:p-6 border-amber-500/20">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div>
            <h2 class="text-base sm:text-lg font-bold font-cinzel text-amber-300">
              Client Invoices & Statement of Accounts
            </h2>
            <p class="text-xs text-slate-400">Click any invoice to view or print official luxury PDF receipt</p>
          </div>
          <span class="text-xs text-slate-400 font-medium">${invoices.length} invoices generated</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-950/80 text-amber-300 font-semibold uppercase tracking-wider border-b border-white/10">
                <th class="py-3 px-3">Invoice #</th>
                <th class="py-3 px-3">Client</th>
                <th class="py-3 px-3">Issue Date</th>
                <th class="py-3 px-3 text-right">Subtotal</th>
                <th class="py-3 px-3 text-right">Tax</th>
                <th class="py-3 px-3 text-right">Total</th>
                <th class="py-3 px-3 text-right">Balance Due</th>
                <th class="py-3 px-3 text-center">Payment Status</th>
                <th class="py-3 px-3 text-right">Print</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              ${invoices.map(inv => `
                <tr class="hover:bg-white/[0.02] transition-colors">
                  <td class="py-3.5 px-3 font-mono font-bold text-amber-400">${inv.invoiceNumber}</td>
                  <td class="py-3.5 px-3 font-semibold text-white">${inv.customerName}</td>
                  <td class="py-3.5 px-3 text-slate-400">${inv.issueDate}</td>
                  <td class="py-3.5 px-3 text-right text-slate-300">${s.currencySymbol}${inv.subtotal.toLocaleString()}</td>
                  <td class="py-3.5 px-3 text-right text-slate-400">${s.currencySymbol}${inv.taxAmount.toLocaleString()}</td>
                  <td class="py-3.5 px-3 text-right font-bold text-white">${s.currencySymbol}${inv.totalAmount.toLocaleString()}</td>
                  <td class="py-3.5 px-3 text-right font-bold ${inv.balanceDue > 0 ? 'text-rose-400' : 'text-emerald-400'}">
                    ${inv.balanceDue > 0 ? `${s.currencySymbol}${inv.balanceDue.toLocaleString()}` : 'Cleared'}
                  </td>
                  <td class="py-3.5 px-3 text-center">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      inv.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      inv.paymentStatus === 'partial' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }">${inv.paymentStatus}</span>
                  </td>
                  <td class="py-3.5 px-3 text-right">
                    <button data-invoice-id="${inv.id}" class="open-inv-btn px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 text-xs font-semibold flex items-center gap-1 ml-auto">
                      <span class="material-symbols-outlined text-sm">print</span>
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Studio Operating Expenses Tracker -->
      <div class="glass-panel p-5 sm:p-6 border-slate-800">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div>
            <h2 class="text-base sm:text-lg font-bold font-cinzel text-amber-300">
              Studio Operating Expenses & Maintenance
            </h2>
            <p class="text-xs text-slate-400">Deductible business gear, software, and crew logs</p>
          </div>
          <button id="addExpenseSecondaryBtn" class="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold">
            <span class="material-symbols-outlined text-sm">add</span>
            <span>Log Expense</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-white/10">
                <th class="py-2.5 px-3">Expense Item</th>
                <th class="py-2.5 px-3">Category</th>
                <th class="py-2.5 px-3">Date</th>
                <th class="py-2.5 px-3">Receipt / Note</th>
                <th class="py-2.5 px-3 text-right">Amount</th>
                <th class="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              ${expenses.map(e => `
                <tr class="hover:bg-white/[0.02]">
                  <td class="py-3 px-3 font-medium text-white">${e.title}</td>
                  <td class="py-3 px-3 text-slate-300">
                    <span class="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-amber-300">${e.category}</span>
                  </td>
                  <td class="py-3 px-3 text-slate-400">${e.date}</td>
                  <td class="py-3 px-3 text-slate-400">${e.receiptNumber || '-'}</td>
                  <td class="py-3 px-3 text-right font-bold text-rose-400 font-mono">${s.currencySymbol}${e.amount.toLocaleString()}</td>
                  <td class="py-3 px-3 text-right">
                    <button data-delete-exp-id="${e.id}" class="delete-exp-btn text-slate-400 hover:text-rose-400 p-1" title="Delete">
                      <span class="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function bindAccountingEvents(modalManager: ModalManager, onDataChanged: () => void) {
  document.getElementById('accLogExpBtn')?.addEventListener('click', () => {
    modalManager.openAddExpenseModal();
  });

  document.getElementById('addExpenseSecondaryBtn')?.addEventListener('click', () => {
    modalManager.openAddExpenseModal();
  });

  document.querySelectorAll('.open-inv-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const invId = target.dataset.invoiceId;
      const inv = store.invoices.find(i => i.id === invId);
      if (inv) {
        modalManager.openInvoiceModal(inv);
      }
    });
  });

  document.querySelectorAll('.delete-exp-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const expId = target.dataset.deleteExpId;
      if (expId && confirm('Delete this expense record?')) {
        store.deleteExpense(expId);
        modalManager.showToast('Expense record removed');
        onDataChanged();
      }
    });
  });
}
