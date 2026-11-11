import { store } from './store';
import { ActiveTab } from './types';
import { ModalManager } from './components/Modals';
import { renderNavbar, renderSidebar } from './components/Navigation';
import { renderDashboardView, bindDashboardEvents } from './components/DashboardView';
import { renderPhotoView, bindPhotoEvents } from './components/PhotoView';
import { renderVideoView, bindVideoEvents } from './components/VideoView';
import { renderAudioView, bindAudioEvents } from './components/AudioView';
import { renderBookingsView, bindBookingsEvents, BookingsViewMode } from './components/BookingsView';
import { renderCustomersView, bindCustomersEvents } from './components/CustomersView';
import { renderPackagesView, bindPackagesEvents } from './components/PackagesView';
import { renderAccountingView, bindAccountingEvents } from './components/AccountingView';
import { renderStaffView, bindStaffEvents } from './components/StaffView';
import { renderGalleryView, bindGalleryEvents } from './components/GalleryView';
import { renderVirtualStageView, bindVirtualStageEvents } from './components/VirtualStageView';
import { renderSettingsView, bindSettingsEvents } from './components/SettingsView';
import { audioEngine } from './audioEngine';
import { StudioVirtualStageScript } from './virtualStage';

export class StudioManagementApp {
  private root: HTMLElement;
  private activeTab: ActiveTab = 'dashboard';
  private modalManager!: ModalManager;
  private isMobileSidebarOpen = false;

  // View Filter states
  private customerSearch = '';
  private bookingFilter = 'all';
  private bookingViewMode: BookingsViewMode = 'gantt';
  private ganttServiceFilter = 'all';
  private ganttOverlapsOnly = false;
  private packageFilter = 'all';

  private virtualStageScript?: StudioVirtualStageScript;

  constructor(root: HTMLElement, virtualStageScript?: StudioVirtualStageScript) {
    this.root = root;
    this.virtualStageScript = virtualStageScript;
    this.modalManager = new ModalManager(document.body, () => this.render());

    // Subscribe to store updates
    store.subscribe(() => {
      this.render();
    });
  }

  setTab(tab: ActiveTab) {
    this.activeTab = tab;
    this.isMobileSidebarOpen = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  }

  render() {
    this.root.innerHTML = `
      <div class="min-h-screen flex flex-col bg-[#08090c] text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
        <!-- Top Navbar -->
        ${renderNavbar(this.activeTab, this.modalManager, () => {
          this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
          this.render();
        })}

        <div class="flex-1 flex">
          <!-- Sidebar for Desktop & Mobile Drawer -->
          <div class="hidden lg:block">
            ${renderSidebar(this.activeTab)}
          </div>

          <!-- Mobile Sidebar Drawer -->
          ${this.isMobileSidebarOpen ? `
            <div id="mobileBackdrop" class="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"></div>
            <div class="fixed top-[61px] left-0 bottom-0 z-50 w-64 bg-[#090b11] border-r border-amber-500/20 lg:hidden shadow-2xl">
              ${renderSidebar(this.activeTab)}
            </div>
          ` : ''}

          <!-- Main Scrollable Content Area -->
          <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
            ${this.renderActiveTabContent()}
          </main>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private renderActiveTabContent(): string {
    switch (this.activeTab) {
      case 'dashboard':
        return renderDashboardView(this.modalManager, (t) => this.setTab(t));
      case 'photo':
        return renderPhotoView(this.modalManager);
      case 'video':
        return renderVideoView(this.modalManager);
      case 'audio':
        return renderAudioView(this.modalManager);
      case 'bookings':
        return renderBookingsView(
          this.modalManager,
          this.bookingFilter,
          this.bookingViewMode,
          this.ganttServiceFilter,
          this.ganttOverlapsOnly
        );
      case 'customers':
        return renderCustomersView(this.modalManager, this.customerSearch);
      case 'packages':
        return renderPackagesView(this.modalManager, this.packageFilter);
      case 'accounting':
        return renderAccountingView(this.modalManager);
      case 'staff':
        return renderStaffView(this.modalManager);
      case 'gallery':
        return renderGalleryView(this.modalManager);
      case 'virtual_stage':
        return renderVirtualStageView();
      case 'settings':
        return renderSettingsView();
      default:
        return renderDashboardView(this.modalManager, (t) => this.setTab(t));
    }
  }

  private bindEvents() {
    // Mobile menu button
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
      this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
      this.render();
    });

    document.getElementById('mobileBackdrop')?.addEventListener('click', () => {
      this.isMobileSidebarOpen = false;
      this.render();
    });

    // Sidebar Tab Navigation
    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const tab = target.dataset.tab as ActiveTab;
        if (tab) {
          this.setTab(tab);
        }
      });
    });

    // Top Navbar Actions
    document.getElementById('navAddBookingBtn')?.addEventListener('click', () => {
      this.modalManager.openNewBookingModal();
    });

    document.getElementById('navAddCustBtn')?.addEventListener('click', () => {
      this.modalManager.openNewCustomerModal();
    });

    document.getElementById('navStopAudioBtn')?.addEventListener('click', () => {
      audioEngine.stop();
      this.render();
    });

    // Active View Bindings
    switch (this.activeTab) {
      case 'dashboard':
        bindDashboardEvents(this.modalManager, (t) => this.setTab(t));
        break;
      case 'photo':
        bindPhotoEvents(this.modalManager);
        break;
      case 'video':
        bindVideoEvents(this.modalManager, () => this.render());
        break;
      case 'audio':
        bindAudioEvents(this.modalManager, () => this.render());
        break;
      case 'bookings':
        bindBookingsEvents(
          this.modalManager,
          () => this.render(),
          (f) => {
            this.bookingFilter = f;
            this.render();
          },
          (mode) => {
            this.bookingViewMode = mode;
            this.render();
          },
          (svc) => {
            this.ganttServiceFilter = svc;
            this.render();
          },
          () => {
            this.ganttOverlapsOnly = !this.ganttOverlapsOnly;
            this.render();
          }
        );
        break;
      case 'customers':
        bindCustomersEvents(
          this.modalManager,
          () => this.render(),
          (q) => {
            this.customerSearch = q;
            // update in-place without losing input focus
            const container = document.querySelector('main');
            if (container) {
              container.innerHTML = this.renderActiveTabContent();
              this.bindEvents();
              const inp = document.getElementById('custSearchInput') as HTMLInputElement;
              if (inp) {
                inp.focus();
                inp.setSelectionRange(inp.value.length, inp.value.length);
              }
            }
          }
        );
        break;
      case 'packages':
        bindPackagesEvents(
          this.modalManager,
          () => this.render(),
          (cat) => {
            this.packageFilter = cat;
            this.render();
          }
        );
        break;
      case 'accounting':
        bindAccountingEvents(this.modalManager, () => this.render());
        break;
      case 'staff':
        bindStaffEvents(this.modalManager, () => this.render());
        break;
      case 'gallery':
        bindGalleryEvents(this.modalManager);
        break;
      case 'virtual_stage':
        bindVirtualStageEvents(this.modalManager, this.virtualStageScript);
        break;
      case 'settings':
        bindSettingsEvents(this.modalManager, () => this.render());
        break;
    }
  }
}
