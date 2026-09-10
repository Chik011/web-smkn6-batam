/* Siswa - Pelajaran View Module */

window.selectedSiswaDay = window.selectedSiswaDay || 'Senin';
window.setSiswaScheduleDay = function(day) {
  window.selectedSiswaDay = day;
  if (window.renderApp) window.renderApp();
};

export function renderPelajaran(state) {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const activeDay = window.selectedSiswaDay || 'Senin';
  
  let schedules = (state.schedules || []).filter(s => !s.hari || s.hari === activeDay);
  if (schedules.length === 0 && state.mapel && state.mapel.length > 0) {
    schedules = state.mapel.map((m, idx) => ({
      id: m.id || idx,
      mapel: m.name,
      ruangan: 'Lab TKJ',
      guru: 'Guru Pengampu',
      waktu: '08:00 - 11:30'
    }));
  }
  
  return `
    <div style="background:white; padding:16px 18px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0;">
      <div style="display:flex; align-items:center; gap:12px;">
        <button style="background:none; border:none; cursor:pointer;" onclick="window.switchSiswaTab('home')">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <h3 style="font-size:1.05rem; font-weight:700; color:#1e293b;">Jadwal & Presensi</h3>
      </div>
      <button style="background:none; border:none; color:#0284c7; font-weight:700; font-size:0.8rem; cursor:pointer;" onclick="window.showToast('Jadwal Semester Aktif', 'info')">
        Semester Ganjil
      </button>
    </div>

    <div style="padding:14px 16px 6px;">
      <span style="font-size:0.85rem; font-weight:700; color:#475569;">Pilih Hari Pembelajaran</span>
    </div>

    <!-- Day Selector Pills with Interactive Switcher -->
    <div class="day-pill-container">
      ${days.map(d => `
        <button class="day-pill ${d === activeDay ? 'active' : ''}" onclick="window.setSiswaScheduleDay('${d}')">${d}</button>
      `).join('')}
    </div>

    <div style="padding:0 16px; margin-top:8px;">
      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:12px;">
        <h4 style="font-size:1.15rem; font-weight:800; color:#1e293b;">Hari ${activeDay}</h4>
        <span style="font-size:0.75rem; color:#64748b; font-weight:600;">${schedules.length} Mata Pelajaran</span>
      </div>

      ${schedules.length === 0 ? `
        <div class="content-card text-center" style="color:#64748b; padding:32px 20px;">
          <div style="font-size:2rem; margin-bottom:8px;">☕</div>
          <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin-bottom:4px;">Tidak Ada Jadwal</h4>
          <p style="font-size:0.78rem; color:#94a3b8;">Tidak ada mata pelajaran dijadwalkan pada hari ${activeDay}.</p>
        </div>
      ` : schedules.map(s => `
        <div style="background:#e8f1f8; border-radius:16px; padding:16px; margin-bottom:12px; border:1px solid #d4e3f0; transition:transform 0.2s ease;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <h4 style="font-size:1.05rem; font-weight:700; color:#0b345e;">${s.mapel}</h4>
              <p style="font-size:0.78rem; color:#475569; margin-top:4px;">📍 ${s.ruangan} • 👨‍🏫 ${s.guru}</p>
            </div>
            <span class="badge-tag badge-blue" style="font-size:0.7rem;">Wajib</span>
          </div>
          <p style="font-size:0.78rem; color:#0284c7; margin-top:8px; font-weight:600;">⏰ ${s.waktu}</p>
        </div>
      `).join('')}
    </div>
  `;
}
