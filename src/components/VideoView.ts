import { store } from '../store';
import { ModalManager } from './Modals';
import { ProjectStage } from '../types';

export function renderVideoView(modalManager: ModalManager): string {
  const s = store.settings;
  const videoProjects = store.projects.filter(p => p.category === 'video' || p.category === 'combo');

  const pipelineStages: ProjectStage[] = [
    'Footage Ingest',
    'Rough Cut Assembly',
    'Color Grading & FX',
    'Audio Sync & Master',
    'Final Render',
    'Export & Delivered'
  ];

  return `
    <div class="space-y-6 sm:space-y-8 animate-fade-in">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 material-symbols-outlined">movie_filter</span>
            <h1 class="text-xl sm:text-2xl font-bold font-cinzel text-amber-300">
              4K Cinematic Video Production & Post Pipeline
            </h1>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Tracking wedding cinema, brand commercial reels, multi-cam ingest, DaVinci Resolve color grading, and final 4K master delivery.
          </p>
        </div>

        <button id="videoNewBookingBtn" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-bold shadow-lg shadow-amber-500/20 hover:opacity-95">
          <span class="material-symbols-outlined text-sm">video_call</span>
          <span>New Video Shoot</span>
        </button>
      </div>

      <!-- Pipeline Workflow Overview -->
      <div class="glass-panel p-5 border-amber-500/20">
        <h3 class="text-xs uppercase font-bold text-amber-400 tracking-wider mb-4">
          Standard DaVinci / Cinema Post-Production Workflow
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          ${pipelineStages.map((stg, i) => `
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span class="w-5 h-5 rounded-full bg-amber-500/15 text-amber-400 font-bold text-[10px] inline-flex items-center justify-center mb-1">
                ${i + 1}
              </span>
              <p class="text-[11px] font-semibold text-white leading-tight">${stg}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Video Projects Cards -->
      <div class="space-y-6">
        ${videoProjects.map(proj => `
          <div class="glass-panel p-5 sm:p-7 border-amber-500/25">
            <!-- Header -->
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-white/10">
              <div>
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    ${proj.stage}
                  </span>
                  <span class="text-xs text-slate-400">Target Delivery: ${proj.deadline}</span>
                </div>
                <h2 class="text-lg sm:text-xl font-bold text-white mt-1">${proj.title}</h2>
                <p class="text-xs text-slate-300 mt-0.5">Client: <strong class="text-amber-300">${proj.customerName}</strong></p>
              </div>

              <div class="flex items-center gap-2.5">
                <button data-video-preview="${proj.id}" class="video-preview-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold">
                  <span class="material-symbols-outlined text-sm">play_circle</span>
                  <span>Play Teaser Reel</span>
                </button>
              </div>
            </div>

            <!-- Pipeline Stepper & Quick Updater -->
            <div class="my-6 p-4 rounded-xl bg-[#0c0e14] border border-slate-800">
              <div class="flex items-center justify-between text-xs mb-3">
                <span class="text-slate-300 font-semibold">Post-Production Timeline Status</span>
                <span class="text-amber-400 font-extrabold text-sm">${proj.progressPercent}% Complete</span>
              </div>
              
              <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-4">
                <div class="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300" style="width: ${proj.progressPercent}%"></div>
              </div>

              <!-- Quick Stage Buttons -->
              <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                <span class="text-[11px] text-slate-400 mr-2">Update Stage:</span>
                ${pipelineStages.map(st => {
                  const isCurrent = proj.stage === st;
                  return `
                    <button data-update-stage="${st}" data-proj-id="${proj.id}" class="stage-updater-btn px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                      isCurrent
                        ? 'bg-amber-400 text-black shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }">
                      ${st}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Details: Gear, Crew, Deliverables -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 rounded-xl bg-[#0f121a] border border-slate-800">
                <h4 class="text-xs uppercase font-bold text-amber-400 tracking-wider mb-2">Cinematography Setup</h4>
                <p class="text-xs text-slate-300">Camera Rig: <strong class="text-white">${proj.leadGear || 'Sony FX6 4K Cinema'}</strong></p>
                <p class="text-xs text-slate-300 mt-1">DP & Colorist: <strong class="text-white">${proj.assignedStaff}</strong></p>
              </div>

              <div class="p-4 rounded-xl bg-[#0f121a] border border-slate-800">
                <h4 class="text-xs uppercase font-bold text-amber-400 tracking-wider mb-2">Deliverables Manifest</h4>
                <div class="space-y-1.5">
                  ${(proj.deliverables || []).map(del => `
                    <div class="flex items-center justify-between text-xs py-1 border-b border-white/5">
                      <div class="flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-sm ${del.isReady ? 'text-emerald-400' : 'text-slate-500'}">
                          ${del.isReady ? 'check_circle' : 'pending'}
                        </span>
                        <span class="text-slate-200">${del.name}</span>
                      </div>
                      <span class="text-amber-400 font-mono text-[11px]">${del.size}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function bindVideoEvents(modalManager: ModalManager, onDataChanged: () => void) {
  document.getElementById('videoNewBookingBtn')?.addEventListener('click', () => {
    modalManager.openNewBookingModal();
  });

  document.querySelectorAll('.stage-updater-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const projId = target.dataset.projId;
      const stage = target.dataset.updateStage as ProjectStage;
      if (projId && stage) {
        let percent = 30;
        if (stage === 'Footage Ingest') percent = 15;
        if (stage === 'Rough Cut Assembly') percent = 45;
        if (stage === 'Color Grading & FX') percent = 65;
        if (stage === 'Audio Sync & Master') percent = 85;
        if (stage === 'Final Render') percent = 95;
        if (stage === 'Export & Delivered') percent = 100;

        store.updateProjectStage(projId, stage, percent);
        modalManager.showToast(`Updated stage to ${stage} (${percent}%)`);
        onDataChanged();
      }
    });
  });

  document.querySelectorAll('.video-preview-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Open Video Player Modal
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg';
      modal.innerHTML = `
        <div class="relative w-full max-w-4xl bg-[#0f1118] border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl text-white">
          <div class="p-4 bg-slate-900 border-b border-white/10 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-amber-400">play_circle</span>
              <span class="font-cinzel text-base font-bold text-amber-300">4K Cinema Client Reel Preview</span>
            </div>
            <button id="closeVideoModal" class="p-1 rounded-lg text-slate-400 hover:text-white">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="relative aspect-video bg-black flex items-center justify-center">
            <!-- Simulated High-End Cinema Player -->
            <div class="text-center p-8 space-y-3">
              <div class="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 flex items-center justify-center mx-auto animate-pulse">
                <span class="material-symbols-outlined text-3xl">smart_display</span>
              </div>
              <h3 class="text-lg font-bold text-white font-cinzel">AuraGold 4K HDR Client Cinema Player</h3>
              <p class="text-xs text-slate-400 max-w-md mx-auto">
                DCI-P3 Color Space, 24.000 fps, Anamorphic 2.39:1 Aspect Ratio with 24-bit 48kHz Master Audio.
              </p>
              <div class="pt-2 flex items-center justify-center gap-3">
                <span class="px-2.5 py-1 rounded bg-slate-800 text-[10px] text-amber-300">Dolby Vision</span>
                <span class="px-2.5 py-1 rounded bg-slate-800 text-[10px] text-blue-300">Apple ProRes 422 HQ</span>
                <span class="px-2.5 py-1 rounded bg-slate-800 text-[10px] text-emerald-300">Dolby Atmos</span>
              </div>
            </div>
          </div>
          <div class="p-4 bg-[#141722] flex items-center justify-between text-xs text-slate-400">
            <span>Watermarked Client Preview Copy</span>
            <button id="closeVideoModalBtn" class="px-4 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700">Close Player</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const close = () => modal.remove();
      modal.querySelector('#closeVideoModal')?.addEventListener('click', close);
      modal.querySelector('#closeVideoModalBtn')?.addEventListener('click', close);
    });
  });
}
