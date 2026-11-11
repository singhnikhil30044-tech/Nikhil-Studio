import { store } from '../store';
import { ActiveTab } from '../types';
import { audioEngine } from '../audioEngine';
import { ModalManager } from './Modals';

export function renderNavbar(
  activeTab: ActiveTab,
  modalManager: ModalManager,
  onToggleSidebarMobile: () => void
): string {
  const s = store.settings;
  const isAudioPlaying = audioEngine.getIsPlaying();
  const activeTrack = audioEngine.getActiveTrackTitle();

  return `
    <header class="sticky top-0 z-40 w-full bg-[#0a0c13]/90 backdrop-blur-xl border-b border-amber-500/20 px-4 sm:px-6 py-3 transition-all no-print">
      <div class="flex items-center justify-between gap-4">
        <!-- Brand & Mobile Toggle -->
        <div class="flex items-center gap-3">
          <button id="mobileMenuBtn" class="lg:hidden p-2 rounded-xl bg-slate-800/80 text-amber-400 hover:bg-slate-700">
            <span class="material-symbols-outlined">menu</span>
          </button>
          
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div class="w-full h-full bg-[#08090c] rounded-[10px] flex items-center justify-center text-amber-400">
                <span class="material-symbols-outlined text-xl">camera</span>
              </div>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-amber-300">
                  ${s.studioName.toUpperCase()}
                </span>
                <span class="hidden md:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  PRO ERP
                </span>
              </div>
              <p class="hidden sm:block text-[11px] text-slate-400 font-light truncate max-w-xs">
                ${s.tagline}
              </p>
            </div>
          </div>
        </div>

        <!-- Live Audio Widget & Quick Actions -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Audio Indicator Widget -->
          <div id="liveAudioPill" class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <span class="material-symbols-outlined text-sm ${isAudioPlaying ? 'text-amber-400 animate-pulse' : 'text-slate-500'}">
              ${isAudioPlaying ? 'graphic_eq' : 'music_note'}
            </span>
            <span class="max-w-[140px] truncate text-[11px]">
              ${isAudioPlaying ? `Playing: ${activeTrack}` : 'Studio Audio Desk'}
            </span>
            ${isAudioPlaying ? `
              <button id="navStopAudioBtn" class="p-0.5 text-slate-400 hover:text-white rounded" title="Stop Audio">
                <span class="material-symbols-outlined text-xs">stop_circle</span>
              </button>
            ` : ''}
          </div>

          <!-- Quick Action: New Customer -->
          <button id="navAddCustBtn" class="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-xl bg-slate-800/90 border border-slate-700/60 hover:border-slate-600">
            <span class="material-symbols-outlined text-sm text-amber-400">person_add</span>
            <span>+ Customer</span>
          </button>

          <!-- Quick Action: New Booking -->
          <button id="navAddBookingBtn" class="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-black shadow-lg shadow-amber-500/20 hover:opacity-95">
            <span class="material-symbols-outlined text-base">calendar_add_on</span>
            <span class="hidden sm:inline">New Booking</span>
            <span class="sm:hidden">Book</span>
          </button>
        </div>
      </div>
    </header>
  `;
}

export function renderSidebar(activeTab: ActiveTab): string {
  const navItems: { id: ActiveTab; label: string; icon: string; badge?: string }[] = [
    { id: 'dashboard', label: 'Main Dashboard', icon: 'dashboard' },
    { id: 'photo', label: 'Photo Shoots', icon: 'photo_camera', badge: 'Active' },
    { id: 'video', label: '4K Video Cinema', icon: 'movie_filter', badge: '4K' },
    { id: 'audio', label: 'Audio & Mixing', icon: 'album', badge: 'DAW' },
    { id: 'bookings', label: 'Bookings & Calendar', icon: 'calendar_month' },
    { id: 'customers', label: 'Customer CRM', icon: 'group' },
    { id: 'packages', label: 'Packages & Pricing', icon: 'diamond' },
    { id: 'accounting', label: 'Invoices & P&L', icon: 'account_balance_wallet' },
    { id: 'staff', label: 'Studio Crew', icon: 'badge' },
    { id: 'gallery', label: 'Galleries & Files', icon: 'photo_library' },
    { id: 'virtual_stage', label: '3D Stage & XR', icon: 'view_in_ar', badge: '3D' },
    { id: 'settings', label: 'Admin Settings', icon: 'settings' },
  ];

  return `
    <aside id="appSidebar" class="w-64 bg-[#090b11] border-r border-amber-500/15 flex flex-col justify-between h-[calc(100vh-61px)] sticky top-[61px] transition-transform z-30 no-print">
      <div class="p-3 space-y-1 overflow-y-auto">
        <div class="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-amber-400/70">
          Studio Operations
        </div>
        ${navItems.map(item => {
          const isActive = activeTab === item.id;
          return `
            <button data-tab="${item.id}" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
              isActive
                ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/5'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-lg transition-transform group-hover:scale-110 ${
                  isActive ? 'text-amber-400' : 'text-slate-400'
                }">${item.icon}</span>
                <span class="font-medium">${item.label}</span>
              </div>
              ${item.badge ? `
                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-300'
                }">${item.badge}</span>
              ` : ''}
            </button>
          `;
        }).join('')}
      </div>

      <!-- Bottom Studio Status Widget -->
      <div class="p-3 border-t border-white/5 bg-[#07080d]">
        <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <p class="text-[11px] font-semibold text-slate-200">Studio Complex Online</p>
              <p class="text-[10px] text-slate-400">Cyclorama A, B & Booth Active</p>
            </div>
          </div>
          <span class="material-symbols-outlined text-amber-400 text-base">verified</span>
        </div>
      </div>
    </aside>
  `;
}
