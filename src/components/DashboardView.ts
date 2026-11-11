import { store } from '../store';
import { ModalManager } from './Modals';
import { audioEngine } from '../audioEngine';

export function renderDashboardView(modalManager: ModalManager, onNavigateTab: (tab: any) => void): string {
  const f = store.getFinancialSummary();
  const s = store.settings;
  const recentBookings = store.bookings.slice(0, 5);
  const activeProjects = store.projects.filter(p => p.progressPercent < 100);

  return `
    <div class="space-y-6 sm:space-y-8 animate-fade-in relative pb-16">
      <!-- Welcome Banner -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#171a26] via-[#151822] to-[#0c0e14] border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div class="absolute -right-8 -top-8 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
        <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                VIP STUDIO OPERATIONS
              </span>
              <span class="text-xs text-slate-400">• November 11, 2026</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold font-cinzel text-white">
              Studio Command Center
            </h1>
            <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Real-time production tracking across high-fashion photography, 4K cinema pipelines, and multi-track audio mastering suites.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <button id="dashNewBookingBtn" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-bold shadow-lg shadow-amber-500/20 hover:opacity-95">
              <span class="material-symbols-outlined text-sm">add_circle</span>
              <span>New Booking</span>
            </button>
            <button id="dashNewExpenseBtn" class="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium">
              <span class="material-symbols-outlined text-sm text-amber-400">payments</span>
              <span>Log Expense</span>
            </button>
            <button id="dashOpenStageBtn" class="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium">
              <span class="material-symbols-outlined text-sm text-amber-400">view_in_ar</span>
              <span>3D Virtual Stage</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 8 Key Metrics Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <!-- 1. Total Customers -->
        <div class="glass-panel p-4 sm:p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-medium">Total Customers</span>
            <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 material-symbols-outlined text-lg">group</span>
          </div>
          <div class="text-xl sm:text-2xl font-bold text-white font-cinzel">${f.totalCustomers}</div>
          <p class="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">trending_up</span> +3 new this month
          </p>
        </div>

        <!-- 2. Total Bookings -->
        <div class="glass-panel p-4 sm:p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-medium">Total Bookings</span>
            <span class="p-2 rounded-xl bg-blue-500/10 text-blue-400 material-symbols-outlined text-lg">calendar_month</span>
          </div>
          <div class="text-xl sm:text-2xl font-bold text-white font-cinzel">${f.totalBookings}</div>
          <p class="text-[11px] text-slate-400 mt-1">Confirmed & Scheduled</p>
        </div>

        <!-- 3. Today's Shoots -->
        <div class="glass-panel-gold p-4 sm:p-5 relative overflow-hidden group">
          <div class="flex items-center justify-between text-amber-300 mb-2">
            <span class="text-xs font-bold uppercase tracking-wider">Today's Shoots</span>
            <span class="p-2 rounded-xl bg-amber-400/20 text-amber-300 material-symbols-outlined text-lg">videocam</span>
          </div>
          <div class="text-xl sm:text-2xl font-extrabold text-amber-300 font-cinzel">${f.todayShootsCount} Sessions</div>
          <p class="text-[11px] text-amber-200/80 mt-1">Happening right now</p>
        </div>

        <!-- 4. Pending Projects -->
        <div class="glass-panel p-4 sm:p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-medium">In-Progress Projects</span>
            <span class="p-2 rounded-xl bg-purple-500/10 text-purple-400 material-symbols-outlined text-lg">pending_actions</span>
          </div>
          <div class="text-xl sm:text-2xl font-bold text-white font-cinzel">${f.pendingProjectsCount}</div>
          <p class="text-[11px] text-slate-400 mt-1">In editing & mixing pipelines</p>
        </div>

        <!-- 5. Completed Projects -->
        <div class="glass-panel p-4 sm:p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-medium">Delivered Projects</span>
            <span class="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 material-symbols-outlined text-lg">task_alt</span>
          </div>
          <div class="text-xl sm:text-2xl font-bold text-emerald-400 font-cinzel">${f.completedProjectsCount}</div>
          <p class="text-[11px] text-slate-400 mt-1">100% Client satisfaction</p>
        </div>

        <!-- 6. Total Revenue -->
        <div class="glass-panel p-4 sm:p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-medium">Total Booked Value</span>
            <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 material-symbols-outlined text-lg">account_balance</span>
          </div>
          <div class="text-xl sm:text-2xl font-bold text-white font-cinzel">
            ${s.currencySymbol}${f.totalRevenue.toLocaleString()}
          </div>
          <p class="text-[11px] text-slate-400 mt-1">Gross contractual volume</p>
        </div>

        <!-- 7. Pending Payments -->
        <div class="glass-panel p-4 sm:p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-medium">Pending Balances</span>
            <span class="p-2 rounded-xl bg-rose-500/10 text-rose-400 material-symbols-outlined text-lg">pending</span>
          </div>
          <div class="text-xl sm:text-2xl font-bold text-rose-400 font-cinzel">
            ${s.currencySymbol}${f.pendingBalance.toLocaleString()}
          </div>
          <p class="text-[11px] text-slate-400 mt-1">Due on final master delivery</p>
        </div>

        <!-- 8. Monthly Earnings / Net Profit -->
        <div class="glass-panel p-4 sm:p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-medium">Net Studio Profit</span>
            <span class="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 material-symbols-outlined text-lg">savings</span>
          </div>
          <div class="text-xl sm:text-2xl font-bold text-emerald-300 font-cinzel">
            ${s.currencySymbol}${f.netProfit.toLocaleString()}
          </div>
          <p class="text-[11px] text-slate-400 mt-1">Revenue minus studio expenses</p>
        </div>
      </div>

      <!-- Today's Live Production Schedule -->
      <div class="glass-panel p-5 sm:p-6 border-amber-500/20">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
            <div>
              <h2 class="text-base sm:text-lg font-bold font-cinzel text-amber-300">
                Today's On-Set Shoots & Live Sessions
              </h2>
              <p class="text-xs text-slate-400">Live active bookings for November 11, 2026</p>
            </div>
          </div>
          <button id="viewAllBookingsBtn" class="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold">
            <span>View Full Calendar</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        ${f.todayShoots.length === 0 ? `
          <div class="py-8 text-center text-slate-500 text-xs">No shoots scheduled for today.</div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${f.todayShoots.map(shoot => `
              <div class="p-4 rounded-xl bg-[#0e111a] border border-amber-500/30 flex flex-col justify-between gap-4">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      shoot.serviceCategory === 'combo' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      shoot.serviceCategory === 'video' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                      shoot.serviceCategory === 'photo' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }">${shoot.packageName}</span>
                    <span class="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      ${shoot.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 class="text-sm sm:text-base font-bold text-white">${shoot.title}</h3>
                  <p class="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-xs text-amber-400">person</span>
                    <span>Client: ${shoot.customerName}</span>
                  </p>
                  <p class="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-xs text-slate-500">schedule</span>
                    <span>${shoot.time}</span>
                  </p>
                  <p class="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-xs text-slate-500">location_on</span>
                    <span class="truncate">${shoot.location}</span>
                  </p>
                </div>

                <div class="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span class="text-slate-400">Balance Due:</span>
                    <span class="font-bold text-amber-400 ml-1">${s.currencySymbol}${shoot.balanceDue}</span>
                  </div>
                  <button data-wa-booking="${shoot.id}" class="dash-wa-btn px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/30 flex items-center gap-1 transition-colors">
                    <span class="material-symbols-outlined text-xs">chat</span>
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Two Column Layout: Active Projects Progress & Recent Bookings -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Active Projects Pipeline -->
        <div class="glass-panel p-5 sm:p-6">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <h2 class="text-sm sm:text-base font-bold font-cinzel text-amber-300">
              Active Production Pipelines
            </h2>
            <span class="text-xs text-slate-400">${activeProjects.length} in progress</span>
          </div>

          <div class="space-y-4">
            ${activeProjects.map(p => `
              <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div class="flex items-center justify-between text-xs mb-1.5">
                  <span class="font-semibold text-white truncate max-w-[200px]">${p.title}</span>
                  <span class="text-amber-400 font-bold">${p.progressPercent}%</span>
                </div>
                <!-- Progress Bar -->
                <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div class="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500" style="width: ${p.progressPercent}%"></div>
                </div>
                <div class="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Stage: <strong class="text-slate-200">${p.stage}</strong></span>
                  <span>Due: ${p.deadline}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Recent Studio Bookings Table -->
        <div class="glass-panel p-5 sm:p-6">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <h2 class="text-sm sm:text-base font-bold font-cinzel text-amber-300">
              Recent Studio Bookings
            </h2>
            <button id="seeAllBookingsLink" class="text-xs text-amber-400 hover:underline">See all (${store.bookings.length})</button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="text-slate-400 border-b border-slate-800">
                  <th class="pb-2">Client / Shoot</th>
                  <th class="pb-2">Date</th>
                  <th class="pb-2 text-right">Amount</th>
                  <th class="pb-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                ${recentBookings.map(b => `
                  <tr>
                    <td class="py-2.5 pr-2">
                      <div class="font-medium text-white truncate max-w-[150px]">${b.customerName}</div>
                      <div class="text-[10px] text-slate-400 truncate max-w-[150px]">${b.title}</div>
                    </td>
                    <td class="py-2.5 text-slate-300 whitespace-nowrap">${b.date}</td>
                    <td class="py-2.5 text-right font-semibold text-white whitespace-nowrap">${s.currencySymbol}${b.totalAmount}</td>
                    <td class="py-2.5 text-center">
                      <span class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        b.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                        b.status === 'in_progress' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      }">${b.status}</span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Quick Actions Floating Action Menu (FAB) -->
      <div id="quickActionsContainer" class="fixed bottom-7 right-7 z-40 flex flex-col items-end pointer-events-auto">
        <!-- Floating Options Menu (Initially hidden / animated) -->
        <div id="quickActionsMenu" class="hidden flex-col items-end space-y-3 mb-3.5 transition-all duration-300">
          <!-- 1. New Booking Shortcut -->
          <div class="flex items-center gap-2.5 group">
            <span class="px-3 py-1.5 rounded-xl bg-[#0e111a]/95 text-amber-300 text-xs font-semibold shadow-xl border border-amber-500/30 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              New Booking
            </span>
            <button id="fabNewBooking" class="w-11 h-11 rounded-2xl bg-[#141824] hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/40 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95" title="Schedule New Booking">
              <span class="material-symbols-outlined text-xl">calendar_add_on</span>
            </button>
          </div>

          <!-- 2. New Customer Shortcut -->
          <div class="flex items-center gap-2.5 group">
            <span class="px-3 py-1.5 rounded-xl bg-[#0e111a]/95 text-blue-300 text-xs font-semibold shadow-xl border border-blue-500/30 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Add New Customer
            </span>
            <button id="fabNewCustomer" class="w-11 h-11 rounded-2xl bg-[#141824] hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/40 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95" title="Register Customer">
              <span class="material-symbols-outlined text-xl">person_add</span>
            </button>
          </div>

          <!-- 3. Log Expense Shortcut -->
          <div class="flex items-center gap-2.5 group">
            <span class="px-3 py-1.5 rounded-xl bg-[#0e111a]/95 text-emerald-300 text-xs font-semibold shadow-xl border border-emerald-500/30 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Log Studio Expense
            </span>
            <button id="fabLogExpense" class="w-11 h-11 rounded-2xl bg-[#141824] hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/40 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95" title="Log Operating Expense">
              <span class="material-symbols-outlined text-xl">payments</span>
            </button>
          </div>

          <!-- 4. Virtual Stage 3D Shortcut -->
          <div class="flex items-center gap-2.5 group">
            <span class="px-3 py-1.5 rounded-xl bg-[#0e111a]/95 text-purple-300 text-xs font-semibold shadow-xl border border-purple-500/30 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              3D Virtual Stage
            </span>
            <button id="fabVirtualStage" class="w-11 h-11 rounded-2xl bg-[#141824] hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-500/40 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95" title="Inspect 3D Lighting & Stage">
              <span class="material-symbols-outlined text-xl">view_in_ar</span>
            </button>
          </div>
        </div>

        <!-- Main FAB Trigger Button -->
        <button id="quickActionsToggleBtn" class="relative group w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-black shadow-2xl shadow-amber-500/40 border-2 border-amber-200/90 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 focus:outline-none" aria-label="Quick Actions Menu">
          <!-- Subtle Glowing Outer Ring -->
          <span class="absolute inset-0 rounded-full bg-amber-400/30 animate-ping pointer-events-none"></span>
          <!-- Dynamic Toggle Icon -->
          <span id="quickActionsIcon" class="material-symbols-outlined text-2xl font-black transition-transform duration-300">
            flash_on
          </span>
        </button>
      </div>

      <!-- Backdrop Click Dismiss Overlay for Floating Menu -->
      <div id="quickActionsBackdrop" class="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] hidden transition-opacity"></div>
    </div>
  `;
}

export function bindDashboardEvents(modalManager: ModalManager, onNavigateTab: (tab: any) => void) {
  // Existing Banner Buttons
  document.getElementById('dashNewBookingBtn')?.addEventListener('click', () => {
    modalManager.openNewBookingModal();
  });

  document.getElementById('dashNewExpenseBtn')?.addEventListener('click', () => {
    modalManager.openAddExpenseModal();
  });

  document.getElementById('dashOpenStageBtn')?.addEventListener('click', () => {
    onNavigateTab('virtual_stage');
  });

  document.getElementById('viewAllBookingsBtn')?.addEventListener('click', () => {
    onNavigateTab('bookings');
  });

  document.getElementById('seeAllBookingsLink')?.addEventListener('click', () => {
    onNavigateTab('bookings');
  });

  // Today's Shoot WhatsApp buttons
  document.querySelectorAll('.dash-wa-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const bookingId = target.dataset.waBooking;
      const booking = store.bookings.find(b => b.id === bookingId);
      if (booking) {
        const customer = store.customers.find(c => c.id === booking.customerId);
        if (customer) {
          modalManager.openWhatsAppModal(customer, booking);
        }
      }
    });
  });

  // --- Floating Action Button (FAB) Menu Logic ---
  const toggleBtn = document.getElementById('quickActionsToggleBtn');
  const menu = document.getElementById('quickActionsMenu');
  const icon = document.getElementById('quickActionsIcon');
  const backdrop = document.getElementById('quickActionsBackdrop');

  let isMenuOpen = false;

  const openMenu = () => {
    if (isMenuOpen) return;
    isMenuOpen = true;
    menu?.classList.remove('hidden');
    menu?.classList.add('flex');
    backdrop?.classList.remove('hidden');
    if (icon) {
      icon.textContent = 'close';
      icon.style.transform = 'rotate(90deg)';
    }
    audioEngine.playBeep(784, 0.06);
  };

  const closeMenu = () => {
    if (!isMenuOpen) return;
    isMenuOpen = false;
    menu?.classList.add('hidden');
    menu?.classList.remove('flex');
    backdrop?.classList.add('hidden');
    if (icon) {
      icon.textContent = 'flash_on';
      icon.style.transform = 'rotate(0deg)';
    }
  };

  toggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop?.addEventListener('click', () => {
    closeMenu();
  });

  // FAB 1: New Booking
  document.getElementById('fabNewBooking')?.addEventListener('click', () => {
    closeMenu();
    modalManager.openNewBookingModal();
  });

  // FAB 2: New Customer
  document.getElementById('fabNewCustomer')?.addEventListener('click', () => {
    closeMenu();
    modalManager.openNewCustomerModal();
  });

  // FAB 3: Log Expense
  document.getElementById('fabLogExpense')?.addEventListener('click', () => {
    closeMenu();
    modalManager.openAddExpenseModal();
  });

  // FAB 4: 3D Virtual Stage
  document.getElementById('fabVirtualStage')?.addEventListener('click', () => {
    closeMenu();
    onNavigateTab('virtual_stage');
  });

  // Close on Escape key
  const escHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  };
  window.addEventListener('keydown', escHandler, { once: true });
}
