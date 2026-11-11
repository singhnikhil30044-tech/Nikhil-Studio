import { store } from '../store';
import { ModalManager } from './Modals';

export function renderGalleryView(modalManager: ModalManager): string {
  const projects = store.projects;

  return `
    <div class="space-y-6 sm:space-y-8 animate-fade-in">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 material-symbols-outlined">photo_library</span>
            <h1 class="text-xl sm:text-2xl font-bold font-cinzel text-amber-300">
              Client Master Galleries & Cloud Deliverables
            </h1>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Secure client download portals, 4K video exports, multi-track audio master archives, and cloud gallery sharing links.
          </p>
        </div>

        <button id="uploadDeliverableBtn" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-bold shadow-lg shadow-amber-500/20 hover:opacity-95">
          <span class="material-symbols-outlined text-sm">cloud_upload</span>
          <span>Upload Project Master</span>
        </button>
      </div>

      <!-- Projects Delivery Folders -->
      <div class="space-y-6">
        ${projects.map(proj => {
          const customer = store.customers.find(c => c.id === proj.customerId);

          return `
            <div class="glass-panel p-6 sm:p-7 border-amber-500/20">
              <!-- Folder Top Bar -->
              <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div class="flex items-center gap-3">
                  <div class="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <span class="material-symbols-outlined text-2xl">folder_shared</span>
                  </div>
                  <div>
                    <h3 class="text-base sm:text-lg font-bold text-white font-cinzel">${proj.title}</h3>
                    <p class="text-xs text-slate-400">
                      Client: <strong class="text-amber-300">${proj.customerName}</strong> | Delivery Stage: <strong class="text-slate-200">${proj.stage}</strong>
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <button data-share-portal-id="${proj.id}" class="share-portal-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700">
                    <span class="material-symbols-outlined text-sm text-amber-400">link</span>
                    <span>Copy Client Link</span>
                  </button>
                  ${customer ? `
                    <button data-wa-gallery-cust-id="${customer.id}" class="wa-gallery-btn px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black text-xs font-semibold border border-emerald-500/30 flex items-center gap-1">
                      <span class="material-symbols-outlined text-sm">chat</span>
                      <span>Send WhatsApp</span>
                    </button>
                  ` : ''}
                </div>
              </div>

              <!-- Deliverable Items Grid -->
              <div class="mt-5 space-y-3">
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Deliverables & Ready Downloads:</span>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  ${(proj.deliverables || []).map(del => `
                    <div class="p-3.5 rounded-xl bg-[#0d0f17] border border-slate-800 flex items-center justify-between gap-3 hover:border-amber-500/30 transition-all">
                      <div class="flex items-center gap-2.5 truncate">
                        <span class="material-symbols-outlined text-xl ${
                          del.type === 'video' ? 'text-blue-400' :
                          del.type === 'audio' ? 'text-emerald-400' :
                          'text-amber-400'
                        }">
                          ${del.type === 'video' ? 'movie' : del.type === 'audio' ? 'music_note' : 'image'}
                        </span>
                        <div class="truncate">
                          <p class="text-xs font-semibold text-white truncate">${del.name}</p>
                          <p class="text-[10px] text-slate-400 font-mono">${del.size}</p>
                        </div>
                      </div>

                      <button data-download-file="${del.name}" class="download-file-btn p-2 rounded-lg bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-black transition-colors" title="Download File">
                        <span class="material-symbols-outlined text-base">download</span>
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Photo Gallery Thumbnails (if any) -->
              ${proj.proofingPhotos && proj.proofingPhotos.length > 0 ? `
                <div class="mt-5 pt-4 border-t border-white/5">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">High-Res Photo Masters Preview:</span>
                    <button class="download-zip-btn text-xs text-amber-400 hover:underline flex items-center gap-1">
                      <span class="material-symbols-outlined text-sm">archive</span>
                      <span>Download All ZIP (35 Images)</span>
                    </button>
                  </div>
                  <div class="flex items-center gap-2.5 overflow-x-auto pb-2">
                    ${proj.proofingPhotos.map(ph => `
                      <img src="${ph.url}" alt="${ph.title}" class="w-20 h-20 rounded-xl object-cover border border-slate-800 shrink-0 hover:scale-105 transition-transform cursor-pointer" />
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function bindGalleryEvents(modalManager: ModalManager) {
  document.querySelectorAll('.share-portal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const projId = target.dataset.sharePortalId;
      const url = `https://auragoldstudios.com/client-vault/${projId}`;
      navigator.clipboard.writeText(url);
      modalManager.showToast('Secure client gallery link copied to clipboard!');
    });
  });

  document.querySelectorAll('.download-file-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const fileName = target.dataset.downloadFile;
      modalManager.showToast(`Starting secure high-res download for "${fileName}"...`);
    });
  });

  document.querySelectorAll('.download-zip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modalManager.showToast('Preparing master ZIP archive package...');
    });
  });

  document.querySelectorAll('.wa-gallery-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const custId = target.dataset.waGalleryCustId;
      const cust = store.customers.find(c => c.id === custId);
      if (cust) {
        modalManager.openWhatsAppModal(cust);
      }
    });
  });

  document.getElementById('uploadDeliverableBtn')?.addEventListener('click', () => {
    modalManager.showToast('Opening secure high-speed upload connection...');
  });
}
