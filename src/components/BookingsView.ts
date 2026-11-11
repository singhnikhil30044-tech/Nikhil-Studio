import { store } from '../store';
import { ModalManager } from './Modals';
import { BookingStatus } from '../types';
import { renderGanttChart } from './GanttChart';

export type BookingsViewMode = 'gantt' | 'table' | 'dual';

export function renderBookingsView(
  modalManager: ModalManager,
  filterStatus = 'all',
  viewMode: BookingsViewMode = 'gantt',
  ganttServiceFilter = 'all',
  ganttOverlapsOnly = false
): string {
  const s = store.settings;
  const bookings = store.bookings.filter(b => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  return `
    <div class="space-y-6 sm:space-y-8 animate-fade-in">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 material-symbols-outlined">calendar_month</span>
            <h1 class="text-xl sm:text-2xl font-bold font-cinzel text-amber-300">
              Studio Bookings & Timeline Gantt Schedule
            </h1>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Track confirmed shoot dates, timeline overlaps across photo, video, and audio services, advance deposits, and post-production delivery.
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <!-- View Switcher (Gantt vs Table vs Dual) -->
          <div class="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button id="viewModeGanttBtn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'gantt' ? 'bg-amber-400 text-black shadow-sm' : 'text-slate-400 hover:text-white'
            }">
              <span class="material-symbols-outlined text-sm">bar_chart</span>
              <span>Gantt Chart</span>
            </button>

            <button id="viewModeDualBtn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'dual' ? 'bg-amber-400 text-black shadow-sm' : 'text-slate-400 hover:text-white'
            }">
              <span class="material-symbols-outlined text-sm">dashboard_customize</span>
              <span class="hidden sm:inline">Dual View</span>
            </button>

            <button id="viewModeTableBtn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'table' ? 'bg-amber-400 text-black shadow-sm' : 'text-slate-400 hover:text-white'
            }">
              <span class="material-symbols-outlined text-sm">table_rows</span>
              <span>Table Roster</span>
            </button>
          </div>

          <button id="bookNewBtn" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-bold shadow-lg shadow-amber-500/20 hover:opacity-95">
            <span class="material-symbols-outlined text-sm">add_circle</span>
            <span class="hidden sm:inline">New Booking</span>
            <span class="sm:hidden">Book</span>
          </button>
        </div>
      </div>

      <!-- Gantt Chart Section (Shown if viewMode is 'gantt' or 'dual') -->
      ${viewMode === 'gantt' || viewMode === 'dual' ? `
        <div id="ganttChartSection">
          ${renderGanttChart(modalManager, ganttServiceFilter, ganttOverlapsOnly)}
        </div>
      ` : ''}

      <!-- Detailed Table Roster Section (Shown if viewMode is 'table' or 'dual') -->
      ${viewMode === 'table' || viewMode === 'dual' ? `
        <div class="space-y-4">
          <!-- Filters & Status Tabs -->
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-2">
              <span class="text-xs uppercase font-bold text-amber-400 tracking-wider">Booking Roster:</span>
            </div>
            <div class="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              ${[
                { id: 'all', label: 'All Bookings', count: store.bookings.length },
                { id: 'confirmed', label: 'Confirmed', count: store.bookings.filter(b => b.status === 'confirmed').length },
                { id: 'in_progress', label: 'In Progress', count: store.bookings.filter(b => b.status === 'in_progress').length },
                { id: 'completed', label: 'Completed', count: store.bookings.filter(b => b.status === 'completed').length },
                { id: 'pending', label: 'Pending', count: store.bookings.filter(b => b.status === 'pending').length },
              ].map(f => `
                <button data-filter="${f.id}" class="booking-filter-btn px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterStatus === f.id
                    ? 'bg-amber-400 text-black shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }">
                  ${f.label} (${f.count})
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Bookings Table -->
          <div class="glass-panel overflow-hidden border-amber-500/20">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-950/80 text-amber-300 font-semibold uppercase tracking-wider border-b border-white/10">
                    <th class="py-3.5 px-4">Booking # / Title</th>
                    <th class="py-3.5 px-4">Service</th>
                    <th class="py-3.5 px-4">Customer Contact</th>
                    <th class="py-3.5 px-4">Shoot Date & Time</th>
                    <th class="py-3.5 px-4">Location</th>
                    <th class="py-3.5 px-4 text-right">Financials</th>
                    <th class="py-3.5 px-4 text-center">Status</th>
                    <th class="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  ${bookings.length === 0 ? `
                    <tr>
                      <td colspan="8" class="py-12 text-center text-slate-500">No bookings found matching filter.</td>
                    </tr>
                  ` : bookings.map(b => `
                    <tr class="hover:bg-white/[0.02] transition-colors">
                      <td class="py-4 px-4">
                        <span class="text-[10px] font-mono text-amber-400 font-bold">${b.bookingNumber}</span>
                        <h3 class="text-sm font-bold text-white mt-0.5">${b.title}</h3>
                        <p class="text-[11px] text-slate-400">${b.packageName}</p>
                      </td>

                      <td class="py-4 px-4">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          b.serviceCategory === 'combo' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          b.serviceCategory === 'video' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                          b.serviceCategory === 'photo' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }">
                          ${b.serviceCategory}
                        </span>
                      </td>

                      <td class="py-4 px-4">
                        <p class="font-semibold text-white">${b.customerName}</p>
                        <p class="text-[11px] text-slate-400">${b.customerPhone}</p>
                        <p class="text-[11px] text-slate-500">${b.customerEmail}</p>
                      </td>

                      <td class="py-4 px-4 whitespace-nowrap">
                        <p class="font-medium text-amber-200">${b.date}</p>
                        <p class="text-[11px] text-slate-400">${b.time}</p>
                      </td>

                      <td class="py-4 px-4 max-w-[150px]">
                        <p class="text-slate-300 truncate">${b.location}</p>
                      </td>

                      <td class="py-4 px-4 text-right whitespace-nowrap">
                        <p class="font-bold text-white">${s.currencySymbol}${b.totalAmount.toLocaleString()}</p>
                        <p class="text-[10px] text-emerald-400">Paid: ${s.currencySymbol}${b.advancePaid.toLocaleString()}</p>
                        ${b.balanceDue > 0 ? `
                          <p class="text-[10px] font-bold text-rose-400">Due: ${s.currencySymbol}${b.balanceDue.toLocaleString()}</p>
                        ` : `
                          <p class="text-[10px] font-bold text-emerald-400">Cleared</p>
                        `}
                      </td>

                      <td class="py-4 px-4 text-center">
                        <select data-booking-status-id="${b.id}" class="booking-status-select bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-semibold text-white focus:outline-none ${
                          b.status === 'completed' ? 'text-emerald-400' :
                          b.status === 'in_progress' ? 'text-amber-400' :
                          b.status === 'cancelled' ? 'text-rose-400' : 'text-blue-400'
                        }">
                          <option value="pending" ${b.status === 'pending' ? 'selected' : ''}>Pending</option>
                          <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                          <option value="in_progress" ${b.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                          <option value="completed" ${b.status === 'completed' ? 'selected' : ''}>Completed</option>
                          <option value="cancelled" ${b.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                      </td>

                      <td class="py-4 px-4 text-right">
                        <div class="flex items-center justify-end gap-1.5">
                          ${b.balanceDue > 0 ? `
                            <button data-record-pay-id="${b.id}" class="record-pay-btn p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30" title="Record Payment">
                              <span class="material-symbols-outlined text-base">payments</span>
                            </button>
                          ` : ''}
                          <button data-invoice-booking-id="${b.id}" class="view-inv-btn p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300" title="View Invoice">
                            <span class="material-symbols-outlined text-base">receipt_long</span>
                          </button>
                          <button data-wa-booking-id="${b.id}" class="booking-wa-btn p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-600/30" title="WhatsApp Message">
                            <span class="material-symbols-outlined text-base">chat</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

export function bindBookingsEvents(
  modalManager: ModalManager,
  onDataChanged: () => void,
  onFilterChanged: (filter: string) => void,
  onViewModeChanged?: (mode: BookingsViewMode) => void,
  onGanttServiceChanged?: (svc: string) => void,
  onGanttOverlapsToggled?: () => void
) {
  document.getElementById('bookNewBtn')?.addEventListener('click', () => {
    modalManager.openNewBookingModal();
  });

  // View Mode Buttons
  document.getElementById('viewModeGanttBtn')?.addEventListener('click', () => {
    onViewModeChanged?.('gantt');
  });

  document.getElementById('viewModeDualBtn')?.addEventListener('click', () => {
    onViewModeChanged?.('dual');
  });

  document.getElementById('viewModeTableBtn')?.addEventListener('click', () => {
    onViewModeChanged?.('table');
  });

  // Gantt Service Filter Buttons
  document.querySelectorAll('.gantt-svc-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const svc = target.dataset.ganttService || 'all';
      onGanttServiceChanged?.(svc);
    });
  });

  // Gantt Overlaps Only Toggle
  document.getElementById('toggleOverlapsBtn')?.addEventListener('click', () => {
    onGanttOverlapsToggled?.();
  });

  // Clicking on a Gantt bar opens booking actions / invoice
  document.querySelectorAll('.gantt-bar-element').forEach(bar => {
    bar.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const bId = target.dataset.ganttItemId;
      const b = store.bookings.find(x => x.id === bId);
      if (b) {
        const inv = store.invoices.find(i => i.bookingId === b.id);
        if (inv) {
          modalManager.openInvoiceModal(inv);
        } else {
          modalManager.showToast(`Selected "${b.title}" - Status: ${b.status.toUpperCase()}`);
        }
      }
    });
  });

  // Table filter buttons
  document.querySelectorAll('.booking-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const f = target.dataset.filter || 'all';
      onFilterChanged(f);
    });
  });

  // Status select
  document.querySelectorAll('.booking-status-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const target = e.currentTarget as HTMLSelectElement;
      const bId = target.dataset.bookingStatusId;
      const newStatus = target.value as BookingStatus;
      if (bId && newStatus) {
        store.updateBookingStatus(bId, newStatus);
        modalManager.showToast(`Booking status updated to ${newStatus}`);
        onDataChanged();
      }
    });
  });

  // Record Payment
  document.querySelectorAll('.record-pay-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const bId = target.dataset.recordPayId;
      const b = store.bookings.find(x => x.id === bId);
      if (b) {
        const amtStr = prompt(
          `Record payment for ${b.customerName}.\nRemaining balance: ${store.settings.currencySymbol}${b.balanceDue}\n\nEnter amount collected:`,
          String(b.balanceDue)
        );
        if (amtStr) {
          const amt = parseFloat(amtStr);
          if (!isNaN(amt) && amt > 0) {
            store.recordBookingPayment(b.id, amt);
            modalManager.showToast(`Recorded payment of ${store.settings.currencySymbol}${amt}!`);
            onDataChanged();
          }
        }
      }
    });
  });

  // View Invoice
  document.querySelectorAll('.view-inv-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const bId = target.dataset.invoiceBookingId;
      const inv = store.invoices.find(i => i.bookingId === bId);
      if (inv) {
        modalManager.openInvoiceModal(inv);
      } else {
        modalManager.showToast('No generated invoice found for this booking.', 'info');
      }
    });
  });

  // WhatsApp
  document.querySelectorAll('.booking-wa-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const bId = target.dataset.waBookingId;
      const b = store.bookings.find(x => x.id === bId);
      if (b) {
        const c = store.customers.find(cust => cust.id === b.customerId);
        if (c) {
          modalManager.openWhatsAppModal(c, b);
        }
      }
    });
  });
}
