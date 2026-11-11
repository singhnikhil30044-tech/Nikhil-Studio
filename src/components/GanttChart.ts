import { store } from '../store';
import { Booking, ServiceCategory } from '../types';
import { ModalManager } from './Modals';

export interface GanttItem {
  booking: Booking;
  startDate: Date;
  endDate: Date;
  category: ServiceCategory;
  progress: number;
  stage: string;
  hasOverlap: boolean;
  overlapCount: number;
  overlappingWith: string[];
}

export function buildGanttItems(
  serviceFilter: string = 'all',
  overlapsOnly: boolean = false
): { items: GanttItem[]; minDate: Date; maxDate: Date; days: Date[]; totalOverlaps: number } {
  const bookings = store.bookings;
  const projects = store.projects;

  // Build items with start date and end/delivery date
  let items: GanttItem[] = bookings.map(b => {
    const proj = projects.find(p => p.bookingId === b.id);
    const start = new Date(b.date + 'T00:00:00');
    
    // End date from project deadline or estimated delivery (e.g. +7 to +14 days for post production)
    let end: Date;
    if (proj?.deadline) {
      end = new Date(proj.deadline + 'T23:59:59');
    } else {
      end = new Date(start.getTime() + (b.serviceCategory === 'audio' ? 7 : 14) * 86400000);
    }

    if (end.getTime() <= start.getTime()) {
      end = new Date(start.getTime() + 5 * 86400000);
    }

    return {
      booking: b,
      startDate: start,
      endDate: end,
      category: b.serviceCategory,
      progress: proj ? proj.progressPercent : (b.status === 'completed' ? 100 : b.status === 'in_progress' ? 50 : 15),
      stage: proj ? proj.stage : (b.status === 'completed' ? 'Delivered' : 'Scheduled'),
      hasOverlap: false,
      overlapCount: 0,
      overlappingWith: []
    };
  });

  // Calculate overlaps across services (date range collision detection)
  let totalOverlaps = 0;
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];

      // Collision condition: a.start <= b.end && a.end >= b.start
      const collision = a.startDate.getTime() <= b.endDate.getTime() && a.endDate.getTime() >= b.startDate.getTime();
      if (collision) {
        a.hasOverlap = true;
        a.overlapCount++;
        a.overlappingWith.push(b.booking.title);

        b.hasOverlap = true;
        b.overlapCount++;
        b.overlappingWith.push(a.booking.title);
        totalOverlaps++;
      }
    }
  }

  // Filter by service if needed
  if (serviceFilter !== 'all') {
    items = items.filter(it => it.category === serviceFilter);
  }

  // Filter overlaps only if toggled
  if (overlapsOnly) {
    items = items.filter(it => it.hasOverlap);
  }

  // Sort by start date ascending
  items.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  // Fixed anchor timeline around studio schedule (Nov 08, 2026 to Nov 30, 2026)
  const minDate = new Date('2026-11-08T00:00:00');
  const maxDate = new Date('2026-11-30T23:59:59');

  const days: Date[] = [];
  const curr = new Date(minDate);
  while (curr <= maxDate) {
    days.push(new Date(curr));
    curr.setDate(curr.getDate() + 1);
  }

  return { items, minDate, maxDate, days, totalOverlaps };
}

export function renderGanttChart(
  modalManager: ModalManager,
  serviceFilter: string = 'all',
  overlapsOnly: boolean = false
): string {
  const s = store.settings;
  const { items, minDate, maxDate, days, totalOverlaps } = buildGanttItems(serviceFilter, overlapsOnly);

  const totalTimeSpan = maxDate.getTime() - minDate.getTime();
  const todayStr = '2026-11-11';
  const todayDate = new Date(todayStr + 'T00:00:00');
  const todayPercent = Math.max(0, Math.min(100, ((todayDate.getTime() - minDate.getTime()) / totalTimeSpan) * 100));

  const formatShortDate = (d: Date) => {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return `
    <div class="glass-panel p-5 sm:p-7 border-amber-500/30 overflow-hidden space-y-6">
      <!-- Gantt Header & Controls Bar -->
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 material-symbols-outlined text-xl">bar_chart</span>
            <div>
              <h2 class="text-base sm:text-lg font-bold font-cinzel text-amber-300">
                Service Production Gantt Timeline
              </h2>
              <p class="text-xs text-slate-400">
                Visualizing multi-day production lifecycles, on-set shoot dates, and cross-service overlapping workflows.
              </p>
            </div>
          </div>
        </div>

        <!-- Filter Controls -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Service Filter Dropdown / Chips -->
          <div class="flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            ${[
              { id: 'all', label: 'All Services' },
              { id: 'photo', label: '📸 Photo' },
              { id: 'video', label: '🎬 4K Video' },
              { id: 'audio', label: '🎙️ Audio' },
              { id: 'combo', label: '💎 Combo' },
            ].map(f => `
              <button data-gantt-service="${f.id}" class="gantt-svc-btn px-2.5 py-1 rounded-lg font-medium transition-all ${
                serviceFilter === f.id
                  ? 'bg-amber-400 text-black font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }">
                ${f.label}
              </button>
            `).join('')}
          </div>

          <!-- Overlaps Only Toggle -->
          <button id="toggleOverlapsBtn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            overlapsOnly
              ? 'bg-amber-500 text-black border-amber-400 shadow-md'
              : 'bg-slate-900/80 text-amber-400 border-amber-500/30 hover:bg-amber-500/10'
          }">
            <span class="material-symbols-outlined text-sm">dynamic_feed</span>
            <span>${overlapsOnly ? 'Showing Overlaps Only' : 'Filter Overlaps'}</span>
          </button>
        </div>
      </div>

      <!-- Legend & Stats Summary -->
      <div class="flex flex-wrap items-center justify-between gap-3 text-xs bg-[#0b0d14] p-3 rounded-xl border border-slate-800">
        <div class="flex flex-wrap items-center gap-4">
          <span class="text-slate-400 font-semibold">Service Timeline Legend:</span>
          <span class="flex items-center gap-1.5 text-purple-300">
            <span class="w-3 h-3 rounded-md bg-gradient-to-r from-purple-500 to-indigo-500 border border-purple-400"></span>
            Photography
          </span>
          <span class="flex items-center gap-1.5 text-blue-300">
            <span class="w-3 h-3 rounded-md bg-gradient-to-r from-blue-500 to-cyan-500 border border-blue-400"></span>
            4K Video Cinema
          </span>
          <span class="flex items-center gap-1.5 text-emerald-300">
            <span class="w-3 h-3 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 border border-emerald-400"></span>
            Audio Mixing & DAW
          </span>
          <span class="flex items-center gap-1.5 text-amber-300">
            <span class="w-3 h-3 rounded-md bg-gradient-to-r from-amber-400 to-yellow-500 border border-amber-400"></span>
            All-In-One Combo
          </span>
        </div>

        <div class="flex items-center gap-3">
          <span class="flex items-center gap-1 text-red-400 font-semibold">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            Today Marker: Nov 11, 2026
          </span>
          <span class="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold">
            ${totalOverlaps} Service Overlaps Detected
          </span>
        </div>
      </div>

      <!-- Gantt Interactive Timeline Canvas Container -->
      <div class="overflow-x-auto select-none border border-slate-800 rounded-2xl bg-[#090b10]">
        <div class="min-w-[920px]">
          <!-- Days Header Row -->
          <div class="grid grid-cols-12 bg-slate-950/90 border-b border-slate-800 sticky top-0 z-10 text-[11px] font-mono text-slate-400">
            <!-- Left Info Column -->
            <div class="col-span-4 p-3 font-semibold text-slate-300 uppercase tracking-wider border-r border-slate-800 flex items-center justify-between">
              <span>Project / Booking & Stage</span>
              <span class="text-[10px] text-amber-400">Nov 2026</span>
            </div>
            <!-- Days Grid Header -->
            <div class="col-span-8 relative py-2.5 px-1 flex items-center justify-between text-center overflow-hidden">
              ${days.filter((_, idx) => idx % 2 === 0).map(d => {
                const isToday = d.toISOString().split('T')[0] === todayStr;
                return `
                  <div class="flex-1 ${isToday ? 'text-amber-300 font-bold' : ''}">
                    ${d.getDate()} <span class="text-[9px] text-slate-500 block uppercase">${d.toLocaleDateString('en-US', { weekday: 'narrow' })}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Gantt Task Rows -->
          <div class="divide-y divide-white/5 relative">
            <!-- Today Vertical Guide Line spanning all rows -->
            <div class="absolute top-0 bottom-0 pointer-events-none z-20 flex flex-col items-center" style="left: calc(33.333% + (66.666% * ${todayPercent / 100})); width: 2px;">
              <div class="w-2 h-2 rounded-full bg-red-500 shadow-md shadow-red-500/50 -mt-1"></div>
              <div class="w-full flex-1 bg-red-500/70 border-r border-dashed border-red-400/80"></div>
            </div>

            ${items.length === 0 ? `
              <div class="py-12 text-center text-xs text-slate-500">
                No bookings or timeline items matching current filter.
              </div>
            ` : items.map((it, rowIdx) => {
              const b = it.booking;
              // Calculate horizontal positioning on timeline [0, 100%]
              const startOffset = Math.max(0, it.startDate.getTime() - minDate.getTime());
              const duration = it.endDate.getTime() - it.startDate.getTime();
              
              const leftPercent = Math.max(0, Math.min(95, (startOffset / totalTimeSpan) * 100));
              const widthPercent = Math.max(8, Math.min(100 - leftPercent, (duration / totalTimeSpan) * 100));

              // Colors based on category
              const bgGradient = 
                it.category === 'combo' ? 'from-amber-500 via-amber-400 to-yellow-600 border-amber-300 text-black' :
                it.category === 'video' ? 'from-blue-600 to-cyan-500 border-blue-400 text-white' :
                it.category === 'photo' ? 'from-purple-600 to-indigo-500 border-purple-400 text-white' :
                'from-emerald-600 to-teal-500 border-emerald-400 text-white';

              const badgeColor = 
                it.category === 'combo' ? 'bg-black/30 text-black' :
                it.category === 'video' ? 'bg-blue-900/60 text-blue-200' :
                it.category === 'photo' ? 'bg-purple-900/60 text-purple-200' :
                'bg-emerald-900/60 text-emerald-200';

              return `
                <div class="grid grid-cols-12 hover:bg-white/[0.02] transition-colors relative group py-2.5">
                  <!-- Left Task Meta Column -->
                  <div class="col-span-4 px-3.5 flex flex-col justify-center border-r border-slate-800/80">
                    <div class="flex items-center justify-between gap-1">
                      <span class="text-[10px] font-mono font-bold text-amber-400 truncate">${b.bookingNumber}</span>
                      <span class="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                        it.category === 'combo' ? 'bg-amber-500/20 text-amber-300' :
                        it.category === 'video' ? 'bg-blue-500/20 text-blue-300' :
                        it.category === 'photo' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-emerald-500/20 text-emerald-300'
                      }">${it.category}</span>
                    </div>

                    <h4 class="text-xs font-bold text-white truncate max-w-[210px] mt-0.5">${b.title}</h4>
                    
                    <div class="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                      <span class="truncate max-w-[130px]">Client: ${b.customerName}</span>
                      <span class="text-slate-300 font-medium">${it.stage} (${it.progress}%)</span>
                    </div>

                    ${it.hasOverlap ? `
                      <div class="mt-1 flex items-center gap-1 text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 w-fit">
                        <span class="material-symbols-outlined text-[11px]">bolt</span>
                        <span>Concurrent Shoot Overlap (${it.overlapCount})</span>
                      </div>
                    ` : ''}
                  </div>

                  <!-- Right Gantt Bar Track Column -->
                  <div class="col-span-8 relative flex items-center px-2 min-h-[58px]">
                    <!-- Background Day Grid Vertical Lines -->
                    <div class="absolute inset-0 flex justify-between pointer-events-none opacity-10">
                      ${days.map(() => `<div class="h-full border-r border-slate-600 flex-1"></div>`).join('')}
                    </div>

                    <!-- Gantt Task Bar -->
                    <div 
                      data-gantt-item-id="${b.id}"
                      class="gantt-bar-element absolute h-10 rounded-xl bg-gradient-to-r ${bgGradient} border shadow-lg cursor-pointer transition-all hover:scale-[1.01] hover:brightness-110 flex items-center justify-between px-3 z-10"
                      style="left: ${leftPercent}%; width: ${widthPercent}%;"
                      title="${b.title} (${formatShortDate(it.startDate)} - ${formatShortDate(it.endDate)})"
                    >
                      <!-- Progress Fill Bar inside -->
                      <div class="absolute left-0 top-0 bottom-0 bg-white/20 rounded-l-xl pointer-events-none" style="width: ${it.progress}%"></div>

                      <!-- Label inside Bar -->
                      <div class="relative z-10 flex items-center gap-1.5 truncate text-xs font-bold">
                        <span class="material-symbols-outlined text-sm">
                          ${it.category === 'video' ? 'movie' : it.category === 'audio' ? 'album' : 'photo_camera'}
                        </span>
                        <span class="truncate max-w-[120px] sm:max-w-[180px]">${b.packageName}</span>
                      </div>

                      <div class="relative z-10 flex items-center gap-2 text-[10px] font-mono shrink-0 ml-2">
                        <span class="hidden sm:inline-block px-1.5 py-0.5 rounded ${badgeColor} font-bold">
                          ${formatShortDate(it.startDate)} &rarr; ${formatShortDate(it.endDate)}
                        </span>
                        <span class="font-extrabold">${it.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Gantt Insight Summary Footer -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div class="p-4 rounded-xl bg-[#0c0e14] border border-slate-800 flex items-center gap-3">
          <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 material-symbols-outlined text-xl">camera_outdoor</span>
          <div>
            <p class="text-[11px] text-slate-400">Peak Simultaneous Shoots</p>
            <p class="text-sm font-bold text-white font-cinzel">2 On-Set Sessions (Nov 11)</p>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-[#0c0e14] border border-slate-800 flex items-center gap-3">
          <span class="p-2 rounded-xl bg-blue-500/10 text-blue-400 material-symbols-outlined text-xl">precision_manufacturing</span>
          <div>
            <p class="text-[11px] text-slate-400">Cinema & Edit Pipeline</p>
            <p class="text-sm font-bold text-white font-cinzel">Active Delivery: Nov 16 - 28</p>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-[#0c0e14] border border-slate-800 flex items-center gap-3">
          <span class="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 material-symbols-outlined text-xl">graphic_eq</span>
          <div>
            <p class="text-[11px] text-slate-400">Sound Stage Availability</p>
            <p class="text-sm font-bold text-emerald-400 font-cinzel">100% Studio Utilization</p>
          </div>
        </div>
      </div>
    </div>
  `;
}
