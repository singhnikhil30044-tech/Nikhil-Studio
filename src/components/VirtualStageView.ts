import { store } from '../store';
import { ModalManager } from './Modals';

export function renderVirtualStageView(): string {
  return `
    <div class="space-y-6 sm:space-y-8 animate-fade-in">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 material-symbols-outlined">view_in_ar</span>
            <h1 class="text-xl sm:text-2xl font-bold font-cinzel text-amber-300">
              3D Virtual Stage & XR Set Visualizer
            </h1>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Spatial studio staging: preview Profoto lighting rigs, Sony cinema camera angles, vocal booth mic setups, and switch into immersive WebXR on spatial headsets.
          </p>
        </div>

        <button id="enterXrBtn" class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-black text-xs font-bold shadow-lg shadow-amber-500/25 hover:scale-105 transition-transform">
          <span class="material-symbols-outlined text-base">head_mounted_device</span>
          <span>Launch WebXR Experience</span>
        </button>
      </div>

      <!-- Controls & Staging Canvas -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 3D Canvas Container -->
        <div class="lg:col-span-2 glass-panel p-2 overflow-hidden border-amber-500/30 flex flex-col">
          <div class="relative w-full aspect-video sm:h-[480px] bg-black rounded-xl overflow-hidden" id="stageCanvasContainer">
            <!-- Three.js Canvas will be mounted or overlayed here -->
            <div id="threeJsStageOverlay" class="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
              <div class="flex items-center justify-between text-xs font-mono text-amber-300 bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-md w-fit">
                <span class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  CYC STUDIO A - THREE.JS VIRTUAL STAGE
                </span>
              </div>
              <div class="text-[11px] text-slate-400 bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-md w-fit">
                Drag to orbit around lighting rigs & audio desk
              </div>
            </div>
          </div>
        </div>

        <!-- Stage Configuration Controls -->
        <div class="glass-panel p-6 border-amber-500/20 space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-amber-300 font-cinzel">
            Set & Lighting Controls
          </h2>

          <!-- Backdrop Color -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-2">Cyclorama Wall Color</label>
            <div class="grid grid-cols-2 gap-2">
              <button data-cyc-color="0x0c0e14" class="cyc-color-btn p-2 rounded-xl bg-[#0c0e14] border border-amber-500/40 text-xs text-white font-medium flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-black border border-white/20"></span>
                <span>Obsidian Black</span>
              </button>
              <button data-cyc-color="0xd4af37" class="cyc-color-btn p-2 rounded-xl bg-[#1c1808] border border-slate-700 hover:border-amber-400 text-xs text-amber-300 font-medium flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-amber-400"></span>
                <span>Imperial Gold</span>
              </button>
              <button data-cyc-color="0x00ff00" class="cyc-color-btn p-2 rounded-xl bg-[#041a04] border border-slate-700 hover:border-emerald-400 text-xs text-emerald-300 font-medium flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Chroma Green</span>
              </button>
              <button data-cyc-color="0xf8fafc" class="cyc-color-btn p-2 rounded-xl bg-[#202533] border border-slate-700 hover:border-white text-xs text-slate-200 font-medium flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-white"></span>
                <span>Pure White</span>
              </button>
            </div>
          </div>

          <!-- Key Light Intensity -->
          <div>
            <div class="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span class="font-semibold">Key Softbox Intensity</span>
              <span id="keyLightVal" class="text-amber-400 font-mono font-bold">4.0x</span>
            </div>
            <input type="range" id="keyLightSlider" min="0" max="8" step="0.2" value="4" class="w-full accent-amber-500 cursor-pointer" />
          </div>

          <!-- Hardware Rig Manifest -->
          <div class="p-3.5 rounded-xl bg-[#0e111a] border border-slate-800 space-y-2 text-xs">
            <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Stage Gear Deployed:</span>
            <div class="flex items-center justify-between text-slate-300">
              <span>Main Key Light:</span>
              <span class="text-white font-medium">Profoto B10X Plus + Softbox</span>
            </div>
            <div class="flex items-center justify-between text-slate-300">
              <span>Cinema Camera:</span>
              <span class="text-white font-medium">Sony FX6 + Anamorphic Prime</span>
            </div>
            <div class="flex items-center justify-between text-slate-300">
              <span>Vocal Booth:</span>
              <span class="text-amber-300 font-medium">Neumann U87 Ai Gold</span>
            </div>
            <div class="flex items-center justify-between text-slate-300">
              <span>Mixing Console:</span>
              <span class="text-white font-medium">Neve 88RS Custom Board</span>
            </div>
          </div>

          <!-- Spatial XR Notice -->
          <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
            <p class="font-semibold flex items-center gap-1.5 mb-1 text-amber-300">
              <span class="material-symbols-outlined text-sm">info</span>
              Android XR & Desktop Simulation
            </p>
            The XR experience is best viewed in an Android XR device like Galaxy XR or XREAL AURA. On desktop, we provide an interactive simulated 3D environment for previewing the studio set.
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindVirtualStageEvents(
  modalManager: ModalManager,
  virtualStageScript?: any
) {
  // Enter XR Button
  document.getElementById('enterXrBtn')?.addEventListener('click', () => {
    // Look for XRButton rendered by XR Blocks or trigger XR session
    const xrBtn = document.querySelector('.XRButton') as HTMLButtonElement;
    if (xrBtn) {
      xrBtn.click();
    } else {
      modalManager.showToast('Initializing Spatial WebXR session...');
    }
  });

  // Backdrop Color
  document.querySelectorAll('.cyc-color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const hexStr = target.dataset.cycColor;
      if (hexStr && virtualStageScript) {
        const hex = parseInt(hexStr, 16);
        virtualStageScript.setBackdropColor(hex);
        modalManager.showToast('Backdrop color updated!');
      }
    });
  });

  // Key Light Slider
  const slider = document.getElementById('keyLightSlider') as HTMLInputElement;
  const valDisplay = document.getElementById('keyLightVal');
  slider?.addEventListener('input', () => {
    const val = parseFloat(slider.value);
    if (valDisplay) valDisplay.textContent = `${val.toFixed(1)}x`;
    if (virtualStageScript) {
      virtualStageScript.setKeyLightIntensity(val);
    }
  });
}
