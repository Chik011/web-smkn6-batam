/* Siswa - Home View Module */
import { getYouTubeDetails } from '../firebase.js';

export function renderHome(state) {
  const user = state.currentUser.siswa;
  const newsList = state.broadcastNews || [];
  
  let scheduleToday = (state.schedules || []).filter(s => {
    if (!s.class && !s.className) return true;
    const sClass = String(s.class || s.className || '').trim().toLowerCase();
    const uClass = String(user.class || '10 TKJ 1').trim().toLowerCase();
    return sClass === uClass || sClass.includes('10');
  });

  // Fallback to state.mapel if schedules is empty so Pelajaran is always populated from Firebase
  if (scheduleToday.length === 0 && state.mapel && state.mapel.length > 0) {
    scheduleToday = state.mapel.slice(0, 3).map((m, idx) => ({
      id: m.id || idx,
      mapel: m.name,
      ruangan: 'Lab TKJ',
      guru: 'Guru TKJ',
      waktu: idx === 0 ? '07:30 - 09:30' : idx === 1 ? '09:45 - 11:45' : '12:30 - 14:30'
    }));
  }

  const currentHour = new Date().getHours();
  let greeting = 'Selamat Datang';
  if (currentHour >= 4 && currentHour < 11) greeting = 'Selamat Pagi ☀️';
  else if (currentHour >= 11 && currentHour < 15) greeting = 'Selamat Siang 🌤️';
  else if (currentHour >= 15 && currentHour < 18) greeting = 'Selamat Sore 🌇';
  else greeting = 'Selamat Malam 🌙';

  return `
    <div class="app-header-card">
      <div class="header-top-row">
        <div class="user-info-group">
          <div class="user-avatar-circle" style="box-shadow: 0 4px 14px rgba(0,0,0,0.2);">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
          <div class="user-text-details">
            <p style="font-size:0.75rem; opacity:0.85; margin-bottom:2px;">${greeting},</p>
            <h3>${user.name}</h3>
            <p>${user.class} • NIS: ${user.nis}</p>
          </div>
        </div>
        <button class="header-icon-btn" onclick="window.switchSiswaTab('notifikasi')">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        </button>
      </div>
    </div>

    <!-- Overlapping Schedule Card -->
    <div class="overlapping-card">
      ${scheduleToday.length === 0 ? `
        <div class="empty-schedule-box">
          <div class="sleep-icon">🛌</div>
          <span style="font-size:0.75rem; color:#94a3b8; font-weight:700; margin-bottom:4px;">Z z</span>
          <p>Jadwal pelajaran tidak ada</p>
        </div>
      ` : scheduleToday.map(s => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px dashed #e2e8f0; padding-bottom:8px;">
          <div>
            <span class="badge-tag badge-blue" style="font-size:0.68rem;">Hari Ini</span>
            <h4 style="font-size:1.05rem; font-weight:700; color:#0b345e; margin-top:4px;">${s.mapel}</h4>
            <p style="font-size:0.75rem; color:#64748b; margin-top:2px;">${s.ruangan} • ${s.guru}</p>
            <p style="font-size:0.75rem; font-weight:600; color:#0284c7; margin-top:4px;">⏰ ${s.waktu}</p>
          </div>
          <div style="background:#e0f2fe; color:#0284c7; padding:10px; border-radius:12px;">
            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Fitur Aplikasi Section -->
    <div class="section-title">Fitur Aplikasi</div>
    <div class="apps-grid">
      <button class="app-icon-item" onclick="window.openSiswaModal('survey')">
        <div class="icon-box">
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <span>Survey</span>
      </button>

      <button class="app-icon-item" onclick="window.switchSiswaTab('pelajaran')">
        <div class="icon-box">
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        </div>
        <span>Nilai Siswa</span>
      </button>

      <button class="app-icon-item" onclick="window.switchSiswaTab('scan')">
        <div class="icon-box">
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
        </div>
        <span>Presensi</span>
      </button>

      <button class="app-icon-item" onclick="window.openSiswaModal('lainnya')">
        <div class="icon-box">
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
        </div>
        <span>Lainnya</span>
      </button>
    </div>

    <!-- TKJ News Section -->
    <div class="news-section-wrapper">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div class="section-title" style="margin:0;">TKJ News</div>
        <button style="background:none; border:none; color:#0284c7; font-weight:700; font-size:0.78rem; cursor:pointer; display:flex; align-items:center; gap:4px;" onclick="window.openSiswaModal('videoTKJ')">
          Lihat Semua <span style="font-size:0.9rem;">→</span>
        </button>
      </div>
      <div class="news-scroll-row">
        ${newsList.length === 0 ? `
          <p style="font-size:0.8rem; color:#94a3b8; padding:10px 0;">Belum ada berita / pengumuman TKJ.</p>
        ` : newsList.map((item, idx) => {
          const yt = getYouTubeDetails(item.url);
          const thumb = yt.thumbnailUrl || 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg';
          return `
            <div class="news-card-item" onclick="window.playNewsVideo('${item.title}', '${item.url}')">
              <div class="news-thumb" style="background-image: url('${thumb}'); background-size: cover; background-position: center;">
                <div class="news-play-btn">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
              <div class="news-card-title">${item.title}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
