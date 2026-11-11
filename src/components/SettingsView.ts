import { store } from '../store';
import { ModalManager } from './Modals';

export function renderSettingsView(): string {
  const s = store.settings;

  return `
    <div class="space-y-6 sm:space-y-8 animate-fade-in max-w-4xl">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 material-symbols-outlined">settings</span>
            <h1 class="text-xl sm:text-2xl font-bold font-cinzel text-amber-300">
              Studio Admin Settings & System Configuration
            </h1>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Customize commercial studio branding, invoice prefix, banking credentials, and manage system backups.
          </p>
        </div>
      </div>

      <!-- Settings Form -->
      <form id="settingsForm" class="space-y-6">
        <!-- Studio Brand Info -->
        <div class="glass-panel p-6 border-amber-500/20 space-y-4">
          <h2 class="text-sm font-bold uppercase tracking-wider text-amber-300 font-cinzel flex items-center gap-2">
            <span class="material-symbols-outlined text-base">storefront</span>
            Studio Profile & Branding
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-300 mb-1.5">Studio Name *</label>
              <input type="text" id="sStudioName" required value="${s.studioName}" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white focus:outline-none" />
            </div>

            <div>
              <label class="block font-semibold text-slate-300 mb-1.5">Tagline / Motto</label>
              <input type="text" id="sTagline" value="${s.tagline}" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white focus:outline-none" />
            </div>

            <div>
              <label class="block font-semibold text-slate-300 mb-1.5">Studio Phone Number</label>
              <input type="tel" id="sPhone" value="${s.phone}" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white focus:outline-none" />
            </div>

            <div>
              <label class="block font-semibold text-slate-300 mb-1.5">Concierge Email</label>
              <input type="email" id="sEmail" value="${s.email}" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white focus:outline-none" />
            </div>

            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-300 mb-1.5">Studio Physical Address</label>
              <input type="text" id="sAddress" value="${s.address}" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white focus:outline-none" />
            </div>

            <div>
              <label class="block font-semibold text-slate-300 mb-1.5">Website URL</label>
              <input type="url" id="sWebsite" value="${s.website}" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white focus:outline-none" />
            </div>

            <div>
              <label class="block font-semibold text-slate-300 mb-1.5">Currency Symbol</label>
              <input type="text" id="sCurrency" value="${s.currencySymbol}" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white focus:outline-none font-bold text-amber-400" />
            </div>

            <div>
              <label class="block font-semibold text-slate-300 mb-1.5">Default Tax Rate (%)</label>
              <input type="number" id="sTax" step="0.1" value="${s.taxRatePercent}" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white focus:outline-none" />
            </div>

            <div>
              <label class="block font-semibold text-slate-300 mb-1.5">Invoice Number Prefix</label>
              <input type="text" id="sPrefix" value="${s.invoicePrefix}" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white focus:outline-none" />
            </div>
          </div>
        </div>

        <!-- Bank & Wire Transfer Credentials -->
        <div class="glass-panel p-6 border-amber-500/20 space-y-4">
          <h2 class="text-sm font-bold uppercase tracking-wider text-amber-300 font-cinzel flex items-center gap-2">
            <span class="material-symbols-outlined text-base">account_balance</span>
            Client Wire & Banking Coordinates (Shown on Invoices)
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-300 mb-1.5">Bank Name</label>
              <input type="text" id="sBankName" value="${s.bankDetails.bankName}" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-300 mb-1.5">Account Beneficiary Name</label>
              <input type="text" id="sAccountName" value="${s.bankDetails.accountName}" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-300 mb-1.5">Account Number</label>
              <input type="text" id="sAccountNumber" value="${s.bankDetails.accountNumber}" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-300 mb-1.5">Routing / IFSC / SWIFT Code</label>
              <input type="text" id="sRouting" value="${s.bankDetails.ifscOrRouting}" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-300 mb-1.5">UPI ID / Wire ID</label>
              <input type="text" id="sUpi" value="${s.bankDetails.upiId || ''}" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white focus:outline-none" />
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex items-center justify-end">
          <button type="submit" class="px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-black hover:opacity-95 shadow-lg shadow-amber-500/20">
            Save Studio Settings
          </button>
        </div>
      </form>

      <!-- Data Backup & Restore Operations -->
      <div class="glass-panel p-6 border-slate-800 space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-amber-300 font-cinzel flex items-center gap-2">
          <span class="material-symbols-outlined text-base">cloud_sync</span>
          Database Backup, Export & Restore
        </h2>
        <p class="text-xs text-slate-400">
          Export your entire studio management database (clients, bookings, shoots, invoices, and expenses) to a JSON file or restore from a backup.
        </p>

        <div class="flex flex-wrap items-center gap-3 pt-2">
          <button id="exportDataBtn" class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700">
            <span class="material-symbols-outlined text-sm text-amber-400">download</span>
            <span>Download Full JSON Backup</span>
          </button>

          <label class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer">
            <span class="material-symbols-outlined text-sm text-emerald-400">upload</span>
            <span>Restore Backup JSON</span>
            <input type="file" id="importFileInput" accept=".json" class="hidden" />
          </label>

          <button id="resetDemoDataBtn" class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-800/60">
            <span class="material-symbols-outlined text-sm">restart_alt</span>
            <span>Reset Demo Seed Data</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function bindSettingsEvents(modalManager: ModalManager, onDataChanged: () => void) {
  const form = document.getElementById('settingsForm') as HTMLFormElement;
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const studioName = (document.getElementById('sStudioName') as HTMLInputElement).value;
    const tagline = (document.getElementById('sTagline') as HTMLInputElement).value;
    const phone = (document.getElementById('sPhone') as HTMLInputElement).value;
    const email = (document.getElementById('sEmail') as HTMLInputElement).value;
    const address = (document.getElementById('sAddress') as HTMLInputElement).value;
    const website = (document.getElementById('sWebsite') as HTMLInputElement).value;
    const currencySymbol = (document.getElementById('sCurrency') as HTMLInputElement).value;
    const taxRatePercent = parseFloat((document.getElementById('sTax') as HTMLInputElement).value) || 0;
    const invoicePrefix = (document.getElementById('sPrefix') as HTMLInputElement).value;

    const bankName = (document.getElementById('sBankName') as HTMLInputElement).value;
    const accountName = (document.getElementById('sAccountName') as HTMLInputElement).value;
    const accountNumber = (document.getElementById('sAccountNumber') as HTMLInputElement).value;
    const ifscOrRouting = (document.getElementById('sRouting') as HTMLInputElement).value;
    const upiId = (document.getElementById('sUpi') as HTMLInputElement).value;

    store.updateSettings({
      studioName,
      tagline,
      phone,
      email,
      address,
      website,
      currencySymbol,
      taxRatePercent,
      invoicePrefix,
      bankDetails: {
        bankName,
        accountName,
        accountNumber,
        ifscOrRouting,
        upiId
      }
    });

    modalManager.showToast('Studio settings saved successfully!');
    onDataChanged();
  });

  // Export JSON
  document.getElementById('exportDataBtn')?.addEventListener('click', () => {
    const jsonStr = store.exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AuraGold_Studio_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    modalManager.showToast('Database backup downloaded!');
  });

  // Import JSON
  const fileInput = document.getElementById('importFileInput') as HTMLInputElement;
  fileInput?.addEventListener('change', (e) => {
    const file = fileInput.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text && store.importData(text)) {
          modalManager.showToast('Database restored successfully!');
          onDataChanged();
        } else {
          modalManager.showToast('Invalid backup file format.', 'warning');
        }
      };
      reader.readAsText(file);
    }
  });

  // Reset to Demo Data
  document.getElementById('resetDemoDataBtn')?.addEventListener('click', () => {
    if (confirm('Reset all customers, bookings, projects, and invoices to initial demo data?')) {
      store.resetToDefaults();
      modalManager.showToast('Studio database reset to factory defaults.');
      onDataChanged();
    }
  });
}
