import { store } from '../store';
import { ModalManager } from './Modals';

export function renderStaffView(modalManager: ModalManager): string {
  const staff = store.staff;

  return `
    <div class="space-y-6 sm:space-y-8 animate-fade-in">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 material-symbols-outlined">badge</span>
            <h1 class="text-xl sm:text-2xl font-bold font-cinzel text-amber-300">
              Studio Staff, Crew & Creative Talent
            </h1>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Manage lead photographers, drone cinematographers, analog audio engineers, and post-production colorists.
          </p>
        </div>

        <button id="addStaffBtn" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-bold shadow-lg shadow-amber-500/20 hover:opacity-95">
          <span class="material-symbols-outlined text-sm">person_add</span>
          <span>Add Crew Member</span>
        </button>
      </div>

      <!-- Staff Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${staff.map(member => `
          <div class="glass-panel p-6 border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div>
              <div class="flex items-start justify-between gap-3 mb-4">
                <div class="flex items-center gap-3">
                  <img src="${member.avatarUrl}" alt="${member.name}" class="w-14 h-14 rounded-2xl object-cover border border-amber-500/40 shadow-md" />
                  <div>
                    <h3 class="text-base font-bold text-white">${member.name}</h3>
                    <p class="text-xs text-amber-300 font-semibold">${member.role}</p>
                    <p class="text-[11px] text-slate-400 mt-0.5">${member.phone}</p>
                  </div>
                </div>

                <span class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  member.status === 'available' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  member.status === 'on_shoot' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-slate-800 text-slate-400'
                }">
                  ${member.status === 'on_shoot' ? 'On Set' : member.status}
                </span>
              </div>

              <!-- Rating & Workload -->
              <div class="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#0d0f17] border border-slate-800/80 text-xs mb-4">
                <div>
                  <span class="text-slate-400 text-[10px] block">Client Rating</span>
                  <span class="font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                    <span class="material-symbols-outlined text-xs">star</span>
                    ${member.rating} / 5.0
                  </span>
                </div>
                <div>
                  <span class="text-slate-400 text-[10px] block">Assigned Shoots</span>
                  <span class="font-bold text-white mt-0.5 block">${member.activeProjects} Active</span>
                </div>
              </div>

              <!-- Specialties Tags -->
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Core Competencies:</span>
                <div class="flex flex-wrap gap-1.5">
                  ${member.specialties.map(spec => `
                    <span class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] border border-white/5">
                      ${spec}
                    </span>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Delete Staff -->
            <div class="pt-4 mt-6 border-t border-white/5 flex items-center justify-between">
              <span class="text-[11px] text-slate-400 truncate max-w-[170px]">${member.email}</span>
              <button data-delete-staff-id="${member.id}" class="delete-staff-btn p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800" title="Remove Member">
                <span class="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function bindStaffEvents(modalManager: ModalManager, onDataChanged: () => void) {
  document.querySelectorAll('.delete-staff-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const staffId = target.dataset.deleteStaffId;
      const mem = store.staff.find(s => s.id === staffId);
      if (mem && confirm(`Remove ${mem.name} from studio roster?`)) {
        store.deleteStaff(mem.id);
        modalManager.showToast(`Removed ${mem.name}`);
        onDataChanged();
      }
    });
  });

  document.getElementById('addStaffBtn')?.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto';
    modal.innerHTML = `
      <div class="relative w-full max-w-md bg-[#0f121a] border border-amber-500/30 rounded-2xl p-6 text-white shadow-2xl">
        <div class="flex items-center justify-between pb-4 border-b border-white/10">
          <h2 class="text-lg font-bold font-cinzel text-amber-300">Add Staff / Crew Member</h2>
          <button id="closeStaffModalBtn" class="text-slate-400 hover:text-white p-1 rounded-lg">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form id="newStaffForm" class="mt-4 space-y-3.5 text-xs">
          <div>
            <label class="block font-semibold text-slate-300 mb-1">Full Name *</label>
            <input type="text" id="sName" required placeholder="e.g. Julian Ross" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white focus:outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Role *</label>
              <select id="sRole" required class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white focus:outline-none">
                <option value="Lead Photographer">Lead Photographer</option>
                <option value="Cinematographer">Cinematographer</option>
                <option value="Audio Engineer">Audio Engineer</option>
                <option value="Colorist & Editor">Colorist & Editor</option>
                <option value="Studio Manager">Studio Manager</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Phone Number *</label>
              <input type="tel" id="sPhone" required placeholder="+1 (555) 700-1122" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white focus:outline-none" />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Email Address *</label>
            <input type="email" id="sEmail" required placeholder="crew@auragoldstudios.com" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white focus:outline-none" />
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Specialties (Comma-separated)</label>
            <input type="text" id="sSpecs" placeholder="e.g. Medium Format, Drone, Color Grading" class="w-full bg-[#161a25] border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white focus:outline-none" />
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button type="button" id="cancelStaffBtn" class="px-4 py-2 text-slate-300 hover:text-white rounded-lg bg-slate-800">Cancel</button>
            <button type="submit" class="px-5 py-2 font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-black">Save Member</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('#closeStaffModalBtn')?.addEventListener('click', close);
    modal.querySelector('#cancelStaffBtn')?.addEventListener('click', close);

    const form = modal.querySelector('#newStaffForm') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (modal.querySelector('#sName') as HTMLInputElement).value;
      const role = (modal.querySelector('#sRole') as HTMLSelectElement).value as any;
      const phone = (modal.querySelector('#sPhone') as HTMLInputElement).value;
      const email = (modal.querySelector('#sEmail') as HTMLInputElement).value;
      const specsRaw = (modal.querySelector('#sSpecs') as HTMLInputElement).value;
      const specs = specsRaw.split(',').map(s => s.trim()).filter(Boolean);

      store.addStaff({
        name,
        role,
        phone,
        email,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        rating: 5.0,
        status: 'available',
        specialties: specs.length > 0 ? specs : ['Creative Production']
      });

      modalManager.showToast(`Added ${name} to team!`);
      onDataChanged();
      close();
    });
  });
}
