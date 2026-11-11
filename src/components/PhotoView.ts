import { store } from '../store';
import { ModalManager } from './Modals';

export function renderPhotoView(modalManager: ModalManager): string {
  const s = store.settings;
  const photoProjects = store.projects.filter(p => p.category === 'photo' || p.category === 'combo');
  const photoBookings = store.bookings.filter(b => b.serviceCategory === 'photo' || b.serviceCategory === 'combo');

  return `
    <div class="space-y-6 sm:space-y-8 animate-fade-in">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 material-symbols-outlined">photo_camera</span>
            <h1 class="text-xl sm:text-2xl font-bold font-cinzel text-amber-300">
              Photography Shoot & Proofing Management
            </h1>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Master camera gear allocation, shotlists, client selection proofing, and magazine retouching delivery.
          </p>
        </div>

        <button id="photoNewBookingBtn" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-bold shadow-lg shadow-amber-500/20 hover:opacity-95">
          <span class="material-symbols-outlined text-sm">add_a_photo</span>
          <span>New Photo Booking</span>
        </button>
      </div>

      <!-- Active Photo Projects with Proofing Galleries -->
      <div class="space-y-6">
        ${photoProjects.map(proj => {
          const booking = photoBookings.find(b => b.id === proj.bookingId);
          const approvedCount = proj.proofingPhotos?.filter(ph => ph.status === 'approved').length || 0;
          const totalPhotos = proj.proofingPhotos?.length || 0;

          return `
            <div class="glass-panel p-5 sm:p-7 border-amber-500/25">
              <!-- Project Top Bar -->
              <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-white/10">
                <div>
                  <div class="flex items-center gap-2.5">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      ${proj.stage}
                    </span>
                    <span class="text-xs text-slate-400">Deadline: ${proj.deadline}</span>
                  </div>
                  <h2 class="text-lg sm:text-xl font-bold text-white mt-1">${proj.title}</h2>
                  <p class="text-xs text-slate-300 mt-0.5">Client: <strong class="text-amber-300">${proj.customerName}</strong></p>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                    Lead: <strong class="text-white">${proj.assignedStaff}</strong>
                  </span>
                  <span class="text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                    Gear: <strong class="text-amber-400">${proj.leadGear || 'Hasselblad 100C'}</strong>
                  </span>
                </div>
              </div>

              <!-- Shot List & Progress Status -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                <!-- Progress Stage -->
                <div class="p-4 rounded-xl bg-[#0d1017] border border-slate-800">
                  <div class="flex items-center justify-between text-xs mb-2">
                    <span class="text-slate-400 font-semibold">Workflow Stage</span>
                    <span class="text-amber-400 font-bold">${proj.progressPercent}%</span>
                  </div>
                  <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                    <div class="h-full bg-gradient-to-r from-amber-500 to-yellow-400" style="width: ${proj.progressPercent}%"></div>
                  </div>
                  <p class="text-[11px] text-slate-400">Current Phase: <strong class="text-slate-200">${proj.stage}</strong></p>
                </div>

                <!-- Proofing Status -->
                <div class="p-4 rounded-xl bg-[#0d1017] border border-slate-800">
                  <div class="flex items-center justify-between text-xs mb-2">
                    <span class="text-slate-400 font-semibold">Client Proofing Selection</span>
                    <span class="text-emerald-400 font-bold">${approvedCount} / ${totalPhotos} Approved</span>
                  </div>
                  <p class="text-xs text-slate-300 mt-2">
                    Clients can click any photo below to inspect in high-res and approve or flag for retouching notes.
                  </p>
                </div>

                <!-- Deliverable Files -->
                <div class="p-4 rounded-xl bg-[#0d1017] border border-slate-800">
                  <span class="text-xs text-slate-400 font-semibold block mb-2">High-Res Delivery Links</span>
                  <div class="space-y-1.5">
                    ${(proj.deliverables || []).map(del => `
                      <div class="flex items-center justify-between text-xs py-1 border-b border-white/5">
                        <span class="text-slate-200 truncate max-w-[140px]">${del.name}</span>
                        <span class="text-amber-400 font-medium">${del.size}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- Interactive Proofing Grid -->
              ${proj.proofingPhotos && proj.proofingPhotos.length > 0 ? `
                <div class="mt-6 pt-5 border-t border-white/10">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-sm font-bold font-cinzel text-amber-300">
                      Live Proofing Photo Gallery (Click to Inspect & Approve)
                    </h3>
                    <span class="text-xs text-slate-400">Hover or click to change status</span>
                  </div>

                  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    ${proj.proofingPhotos.map(ph => `
                      <div data-photo-id="${ph.id}" data-proj-id="${proj.id}" class="photo-card group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border border-slate-800 hover:border-amber-400 transition-all shadow-lg bg-black">
                        <img src="${ph.url}" alt="${ph.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <!-- Status Badge -->
                        <div class="absolute top-2 left-2">
                          <span class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            ph.status === 'approved' ? 'bg-emerald-600 text-white' :
                            ph.status === 'rejected' ? 'bg-rose-600 text-white' :
                            'bg-amber-500 text-black'
                          }">${ph.status}</span>
                        </div>
                        <!-- Overlay on Hover -->
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                          <p class="text-[10px] font-bold text-white truncate">${ph.title}</p>
                          <p class="text-[9px] text-amber-300">Click to Inspect</p>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : `
                <div class="p-6 text-center text-xs text-slate-400 bg-slate-900/40 rounded-xl">
                  Shoot completed. High-res RAW ingest in progress. Proofing images will be published here.
                </div>
              `}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function bindPhotoEvents(modalManager: ModalManager) {
  document.getElementById('photoNewBookingBtn')?.addEventListener('click', () => {
    modalManager.openNewBookingModal();
  });

  document.querySelectorAll('.photo-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const projId = target.dataset.projId;
      const photoId = target.dataset.photoId;
      if (projId && photoId) {
        modalManager.openPhotoProofingModal(projId, photoId);
      }
    });
  });
}
