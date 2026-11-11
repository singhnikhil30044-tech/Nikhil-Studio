import { store } from '../store';
import { ModalManager } from './Modals';
import { audioEngine } from '../audioEngine';

export function renderAudioView(modalManager: ModalManager): string {
  const s = store.settings;
  const audioProjects = store.projects.filter(p => p.category === 'audio' || p.category === 'combo');
  const isPlaying = audioEngine.getIsPlaying();
  const currentTrack = audioEngine.getActiveTrackTitle();

  return `
    <div class="space-y-6 sm:space-y-8 animate-fade-in">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 material-symbols-outlined">album</span>
            <h1 class="text-xl sm:text-2xl font-bold font-cinzel text-amber-300">
              Audio Recording, Mixing & Dolby Atmos Mastering
            </h1>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Neumann U87 vocal booth tracking, Rupert Neve analog summing console, multi-track stems, and Apple Digital Masters.
          </p>
        </div>

        <button id="audioNewBookingBtn" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-bold shadow-lg shadow-amber-500/20 hover:opacity-95">
          <span class="material-symbols-outlined text-sm">mic</span>
          <span>Book Sound Booth Session</span>
        </button>
      </div>

      <!-- Live Interactive Mixing Desk & Spectrum Visualizer -->
      <div class="glass-panel-gold p-5 sm:p-7">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-amber-500/20">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}"></span>
              <span class="font-cinzel text-base font-bold text-amber-300">
                AuraGold Master Control Console (Studio A)
              </span>
            </div>
            <p class="text-xs text-slate-300 mt-0.5">
              ${isPlaying ? `Currently auditioning: <strong class="text-white">${currentTrack}</strong>` : 'Select any stem or track below to audition live harmonic synthesis.'}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button id="audioStopGlobalBtn" class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold">
              <span class="material-symbols-outlined text-sm">stop</span>
              <span>Stop Playback</span>
            </button>
          </div>
        </div>

        <!-- Live Spectrum Canvas -->
        <div class="my-5 p-4 rounded-xl bg-black/90 border border-amber-500/30 flex flex-col items-center justify-center">
          <div class="w-full flex items-center justify-between text-[11px] text-amber-400/80 mb-2 font-mono">
            <span>REAL-TIME FFT SPECTRUM & HARMONIC OSCILLATOR</span>
            <span>24-BIT / 96kHz ANALOG SUM</span>
          </div>
          <canvas id="audioSpectrumCanvas" width="700" height="90" class="w-full h-24 rounded-lg bg-slate-950"></canvas>
        </div>

        <!-- Multi-Channel Mixer Faders -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
          ${[
            { name: 'Lead Vocal', icon: 'mic', color: 'from-amber-500 to-yellow-400', db: '-2.4 dB' },
            { name: 'Backing Harmonies', icon: 'queue_music', color: 'from-purple-500 to-indigo-400', db: '-6.1 dB' },
            { name: 'Acoustic Guitar', icon: 'music_note', color: 'from-blue-500 to-cyan-400', db: '-4.0 dB' },
            { name: 'Drum Overhead', icon: 'equalizer', color: 'from-emerald-500 to-teal-400', db: '-1.8 dB' },
            { name: 'Sub & Bass Synth', icon: 'speaker', color: 'from-rose-500 to-pink-400', db: '-3.2 dB' },
            { name: 'Master Bus (Neve)', icon: 'tune', color: 'from-amber-400 to-yellow-200', db: '0.0 dB' },
          ].map(ch => `
            <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-center text-slate-400 mb-1">
                  <span class="material-symbols-outlined text-sm">${ch.icon}</span>
                </div>
                <p class="text-[11px] font-bold text-white truncate">${ch.name}</p>
                <p class="text-[10px] text-amber-400 font-mono mt-0.5">${ch.db}</p>
              </div>

              <!-- Fader Track -->
              <div class="my-3 mx-auto w-2 h-20 bg-slate-800 rounded-full relative flex items-end">
                <div class="w-full bg-gradient-to-t ${ch.color} rounded-full" style="height: 65%"></div>
              </div>

              <!-- Mute / Solo -->
              <div class="flex items-center justify-center gap-1">
                <button class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300">M</button>
                <button class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 hover:bg-amber-500/40 text-amber-300">S</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Active Audio Projects & Tracks -->
      <div class="space-y-6">
        ${audioProjects.map(proj => `
          <div class="glass-panel p-5 sm:p-7 border-amber-500/25">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    ${proj.stage}
                  </span>
                  <span class="text-xs text-slate-400">Master Due: ${proj.deadline}</span>
                </div>
                <h2 class="text-lg sm:text-xl font-bold text-white mt-1">${proj.title}</h2>
                <p class="text-xs text-slate-300">Artist: <strong class="text-amber-300">${proj.customerName}</strong> | Engineer: <strong class="text-white">${proj.assignedStaff}</strong></p>
              </div>

              <div class="text-xs text-slate-400 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
                Gear Chain: <strong class="text-amber-300">${proj.leadGear || 'Neve 88RS & Shadow Hills'}</strong>
              </div>
            </div>

            <!-- Stems & Tracks List -->
            <div class="mt-5 space-y-2.5">
              <h3 class="text-xs uppercase font-bold text-amber-400 tracking-wider">Session Multi-Track Stems</h3>
              ${(proj.audioTracks || []).map(track => `
                <div class="p-3.5 rounded-xl bg-[#0e111a] border border-slate-800 hover:border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors">
                  <div class="flex items-center gap-3">
                    <button data-play-track="${track.id}" data-proj-id="${proj.id}" class="play-track-btn w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-black flex items-center justify-center hover:scale-105 transition-transform shadow-md shadow-amber-500/20">
                      <span class="material-symbols-outlined text-xl">play_arrow</span>
                    </button>
                    <div>
                      <h4 class="text-xs sm:text-sm font-bold text-white">${track.title}</h4>
                      <p class="text-[11px] text-slate-400 font-mono">
                        ${track.bpm} BPM | Key: ${track.key} | ${track.genre} | Length: ${track.duration}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end">
                    <span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      track.stage === 'Master' ? 'bg-amber-500/20 text-amber-300' :
                      track.stage === 'Mix' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-purple-500/20 text-purple-300'
                    }">${track.stage} Phase</span>

                    <button class="flex items-center gap-1 text-[11px] text-amber-400 hover:underline">
                      <span class="material-symbols-outlined text-sm">cloud_download</span>
                      <span>Stems (.wav)</span>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function bindAudioEvents(modalManager: ModalManager, onDataChanged: () => void) {
  document.getElementById('audioNewBookingBtn')?.addEventListener('click', () => {
    modalManager.openNewBookingModal();
  });

  document.getElementById('audioStopGlobalBtn')?.addEventListener('click', () => {
    audioEngine.stop();
    modalManager.showToast('Audio playback stopped.');
    onDataChanged();
  });

  // Track play buttons
  document.querySelectorAll('.play-track-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const trackId = target.dataset.playTrack;
      const projId = target.dataset.projId;

      const proj = store.projects.find(p => p.id === projId);
      const track = proj?.audioTracks?.find(t => t.id === trackId);

      if (track) {
        audioEngine.playTrack(track);
        modalManager.showToast(`Auditioning "${track.title}" live!`);
        onDataChanged();
      }
    });
  });

  // Render spectrum animation loop on canvas
  startSpectrumVisualizer();
}

let spectrumAnimFrame: number | null = null;

function startSpectrumVisualizer() {
  if (spectrumAnimFrame) {
    cancelAnimationFrame(spectrumAnimFrame);
  }

  const canvas = document.getElementById('audioSpectrumCanvas') as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dataArray = new Uint8Array(32);

  const draw = () => {
    spectrumAnimFrame = requestAnimationFrame(draw);
    audioEngine.getFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isPlaying = audioEngine.getIsPlaying();
    const barWidth = (canvas.width / 32) - 3;
    let x = 2;

    for (let i = 0; i < 32; i++) {
      let barHeight = (dataArray[i] / 255) * canvas.height;
      if (!isPlaying) {
        // Idle gentle breathing line
        barHeight = 4 + Math.sin(Date.now() * 0.003 + i * 0.4) * 3;
      }

      const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
      grad.addColorStop(0, '#d4af37');
      grad.addColorStop(0.6, '#ffd700');
      grad.addColorStop(1, '#ffedd5');

      ctx.fillStyle = grad;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 3;
    }
  };

  draw();
}
