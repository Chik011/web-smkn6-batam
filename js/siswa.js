/* Siswa View Renderer */

import { store } from './state.js';
import { getYouTubeDetails } from './firebase.js';

export function renderSiswaScreen(state) {
  const activeTab = state.activeTabs.siswa || 'home';

  let contentHtml = '';
  switch (activeTab) {
    case 'home':
      contentHtml = renderHome(state);
      break;
    case 'visimisi':
      contentHtml = renderVisiMisiView(state);
      break;
    case 'gurutkj':
      contentHtml = renderGuruTKJView(state);
      break;
    case 'totalsiswa':
      contentHtml = renderTotalSiswaView(state);
      break;
    case 'kalender':
      contentHtml = renderKalenderView(state);
      break;
    case 'galerisiswa':
      contentHtml = renderGaleriSiswaView(state);
      break;
    case 'library':
    case 'elibrary':
      contentHtml = renderLibraryView(state);
      break;
    case 'pelajaran':
      contentHtml = renderPelajaran(state);
      break;
    case 'scan':
      contentHtml = renderScan(state);
      break;
    case 'notifikasi':
      contentHtml = renderNotifikasi(state);
      break;
    case 'akun':
      contentHtml = renderAkun(state);
      break;
    default:
      contentHtml = renderHome(state);
  }

  const bottomNavHtml = `
    <nav class="phone-bottom-nav">
      <button class="nav-item ${activeTab === 'home' ? 'active' : ''}" data-tab="home">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 00-1 1m-6 0h6"/></svg>
        </div>
        <span>Home</span>
      </button>

      <button class="nav-item ${activeTab === 'pelajaran' ? 'active' : ''}" data-tab="pelajaran">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        </div>
        <span>Pelajaran</span>
      </button>

      <button class="nav-item ${activeTab === 'scan' ? 'active' : ''}" data-tab="scan">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
        </div>
        <span>Scan</span>
      </button>

      <button class="nav-item ${activeTab === 'notifikasi' ? 'active' : ''}" data-tab="notifikasi">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        </div>
        <span>Notifikasi</span>
      </button>

      <button class="nav-item ${activeTab === 'akun' ? 'active' : ''}" data-tab="akun">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </div>
        <span>Akun</span>
      </button>
    </nav>
  `;

  return { contentHtml, bottomNavHtml };
}

window.selectedSiswaDay = window.selectedSiswaDay || 'Senin';
window.setSiswaScheduleDay = function(day) {
  window.selectedSiswaDay = day;
  store.notify();
};

function renderHome(state) {
  const user = state.currentUser.siswa;
  const newsList = state.broadcastNews || [];
  const scheduleToday = state.schedules.filter(s => s.class === user.class);

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
        <div style="display:flex; justify-content:space-between; align-items:center;">
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
    <div class="apps-grid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px;">
      <button class="app-icon-item" onclick="window.switchSiswaTab('visimisi')">
        <div class="icon-box" style="background:#fef3c7; color:#d97706;">
          🎯
        </div>
        <span>Visi Misi</span>
      </button>

      <button class="app-icon-item" onclick="window.switchSiswaTab('gurutkj')">
        <div class="icon-box" style="background:#e0e7ff; color:#4f46e5;">
          👨‍🏫
        </div>
        <span>Guru TKJ</span>
      </button>

      <button class="app-icon-item" onclick="window.switchSiswaTab('totalsiswa')">
        <div class="icon-box" style="background:#dcfce7; color:#15803d;">
          👥
        </div>
        <span>Total Siswa</span>
      </button>

      <button class="app-icon-item" onclick="window.switchSiswaTab('kalender')">
        <div class="icon-box" style="background:#fee2e2; color:#dc2626;">
          📅
        </div>
        <span>Kalender</span>
      </button>

      <button class="app-icon-item" onclick="window.switchSiswaTab('galerisiswa')">
        <div class="icon-box" style="background:#f3e8ff; color:#9333ea;">
          🖼️
        </div>
        <span>Galeri Siswa</span>
      </button>

      <button class="app-icon-item" onclick="window.openSiswaModal('lainnya')">
        <div class="icon-box" style="background:#f8fafc; color:#64748b;">
          ⚙️
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
        ${newsList.map((item, idx) => {
          const yt = getYouTubeDetails(item.url);
          return `
            <div class="news-card-item" data-index="${idx}" onclick="window.playNewsVideoById('${item.id}', ${idx})" style="cursor:pointer;">
              <div class="news-thumb" style="position:relative; overflow:hidden; border-radius:12px; background:#0f172a; pointer-events:none;">
                ${yt.thumbnailUrl ? `
                  <img src="${yt.thumbnailUrl}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; border-radius:inherit;" onerror="this.style.display='none'" />
                ` : ''}
                <div class="news-play-btn" style="position:relative; z-index:2; box-shadow:0 4px 12px rgba(0,0,0,0.3); pointer-events:none;">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
              <div class="news-card-title" style="pointer-events:none;">${item.title}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderPelajaran(state) {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const activeDay = window.selectedSiswaDay || 'Senin';
  const schedules = state.schedules.filter(s => !s.hari || s.hari === activeDay);
  
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

function renderScan(state) {
  return `
    <div class="scan-screen-container">
      <div class="scanner-viewfinder">
        <div class="scanner-corner tl"></div>
        <div class="scanner-corner tr"></div>
        <div class="scanner-corner bl"></div>
        <div class="scanner-corner br"></div>
        <div class="scanner-laser"></div>
        <div class="scan-target-reticle">
          <svg width="68" height="68" fill="none" stroke="rgba(56, 189, 248, 0.75)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
        </div>
      </div>

      <h3 style="font-size:1.1rem; font-weight:800; color:#1e293b; margin-bottom:6px;">Pemindai Presensi QR Code</h3>
      <p style="font-size:0.8rem; color:#64748b; max-width:280px; margin-bottom:20px; line-height:1.5;">Arahkan kamera ke QR Code kelas yang ditampilkan guru untuk konfirmasi kehadiran otomatis.</p>

      <div style="display:flex; gap:10px; width:100%; max-width:280px;">
        <button class="btn-primary" style="flex:1;" onclick="window.simulateScanQR()">📸 Simulasi Pindai QR</button>
      </div>
    </div>
  `;
}

function renderNotifikasi(state) {
  const news = state.broadcastNews || [];
  return `
    <div style="background:white; padding:16px; border-bottom:1px solid #e2e8f0;">
      <h3 style="font-size:1.1rem; font-weight:700; color:#1e293b;">Notifikasi & Pengumuman</h3>
    </div>
    <div style="padding:16px;">
      ${news.length === 0 ? `
        <div class="content-card text-center" style="color:#64748b; padding:24px;">Belum ada pengumuman baru saat ini.</div>
      ` : news.map(item => `
        <div class="content-card">
          <span class="badge-tag badge-blue">Broadcast Admin</span>
          <h4 style="font-size:0.95rem; font-weight:700; margin-top:6px; color:#1e293b;">${item.title}</h4>
          <p style="font-size:0.75rem; color:#64748b; margin-top:4px;">Pengumuman video pembelajaran terbaru telah dipublikasikan untuk siswa TKJ.</p>
          <button style="margin-top:10px; background:#eff6ff; color:#2563eb; border:none; padding:6px 12px; border-radius:6px; font-size:0.75rem; font-weight:600; cursor:pointer;" onclick="window.playNewsVideoById('${item.id}')">▶ Tonton Video</button>
        </div>
      `).join('')}
    </div>
  `;
}

function renderAkun(state) {
  const user = state.currentUser.siswa;
  const biometric = state.biometricEnabled;

  return `
    <div style="padding:16px 16px 0;">
      <h2 style="font-size:1.3rem; font-weight:800; color:#1e293b; margin-bottom:12px;">Akun</h2>
    </div>

    <!-- Blue Profile Card matching Image 4 -->
    <div class="profile-card-blue">
      <div style="width:54px; height:54px; border-radius:50%; background:rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; flex-shrink:0; border:2px solid rgba(255,255,255,0.4);">
        <svg width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
      </div>
      <div>
        <h3 style="font-size:1.15rem; font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">${user.name}</h3>
        <p style="font-size:0.78rem; opacity:0.85; margin-top:2px;">NIS: ${user.nis}</p>
        <p style="font-size:0.75rem; opacity:0.85;">${user.class}</p>
      </div>
    </div>

    <!-- Menu List -->
    <div class="account-menu-list">
      <div class="account-menu-item" onclick="window.openSiswaModal('kts')">
        <div class="account-menu-left">
          <svg width="20" height="20" fill="none" stroke="#2563eb" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h3"/></svg>
          <span>Kartu Tanda Siswa (3D)</span>
        </div>
        <svg width="18" height="18" fill="none" stroke="#94a3b8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </div>

      <div class="account-menu-item" style="cursor:default;">
        <div class="account-menu-left">
          <svg width="20" height="20" fill="none" stroke="#0284c7" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457-.39-2.823-1.07-4"/></svg>
          <span>Login Biometrik</span>
        </div>
        <input type="checkbox" ${biometric ? 'checked' : ''} onchange="window.toggleBiometric(this.checked)" style="width:20px; height:20px; cursor:pointer;" />
      </div>

      <div class="account-menu-item" style="cursor:default;">
        <div class="account-menu-left">
          <span style="font-size:1.15rem;">${state.themeMode === 'dark' ? '🌙' : '☀️'}</span>
          <span>Tema Gelap (Dark Mode)</span>
        </div>
        <input type="checkbox" ${state.themeMode === 'dark' ? 'checked' : ''} onchange="window.toggleThemeMode(this.checked)" style="width:20px; height:20px; cursor:pointer;" />
      </div>

      <div class="account-menu-item" onclick="window.openSiswaModal('career')">
        <div class="account-menu-left" style="color:#0369a1;">
          <svg width="20" height="20" fill="none" stroke="#0369a1" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span>Career Profiling</span>
        </div>
        <svg width="18" height="18" fill="none" stroke="#94a3b8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </div>

      <div class="account-menu-item" onclick="window.logout()">
        <div class="account-menu-left danger">
          <svg width="20" height="20" fill="none" stroke="#ef4444" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          <span>Logout</span>
        </div>
        <svg width="18" height="18" fill="none" stroke="#ef4444" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </div>
    </div>
  `;
}

function renderVisiMisiView(state) {
  return `
    <div style="background:white; padding:16px 18px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0;">
      <div style="display:flex; align-items:center; gap:12px;">
        <button style="background:none; border:none; cursor:pointer;" onclick="window.switchSiswaTab('home')">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <h3 style="font-size:1.05rem; font-weight:700; color:#1e293b;">🎯 Visi & Misi TKJ SMKN 6</h3>
      </div>
    </div>
    <div style="padding:16px;">
      <div style="background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:white; padding:18px; border-radius:16px; margin-bottom:14px; box-shadow:0 6px 20px rgba(15,23,42,0.15);">
        <h4 style="font-size:0.9rem; font-weight:800; color:#38bdf8; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.5px;">Visi TKJ</h4>
        <p style="font-size:0.84rem; line-height:1.6; color:#f8fafc; margin:0;">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        </p>
      </div>

      <div style="background:white; border:1px solid #e2e8f0; padding:18px; border-radius:16px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <h4 style="font-size:0.9rem; font-weight:800; color:#0f172a; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px;">Misi Utama</h4>
        <ol style="font-size:0.82rem; color:#334155; margin:0 0 0 18px; padding:0; line-height:1.7;">
          <li style="margin-bottom:8px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</li>
          <li style="margin-bottom:8px;">Incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</li>
          <li style="margin-bottom:8px;">Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
          <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</li>
        </ol>
      </div>
    </div>
  `;
}

window.filterGuruQuery = '';
window.filterGuruList = function(q) {
  window.filterGuruQuery = q || '';
  store.notify();
};

window.filterSiswaQuery = '';
window.filterSiswaList = function(q) {
  window.filterSiswaQuery = q || '';
  store.notify();
};

function renderGuruTKJView(state) {
  const allTeachers = state.teachers || [];
  const q = (window.filterGuruQuery || '').trim().toLowerCase();
  
  const teachers = q ? allTeachers.filter(t => {
    const name = (t.name || t.teacherName || '').toLowerCase();
    const mapel = (t.mapel || t.subject || '').toLowerCase();
    const user = (t.username || '').toLowerCase();
    return name.includes(q) || mapel.includes(q) || user.includes(q);
  }) : allTeachers;

  return `
    <div style="background:white; padding:16px 18px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0;">
      <div style="display:flex; align-items:center; gap:12px;">
        <button style="background:none; border:none; cursor:pointer;" onclick="window.switchSiswaTab('home')">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <h3 style="font-size:1.05rem; font-weight:700; color:#1e293b;">👨‍🏫 Daftar Guru Pengajar TKJ</h3>
      </div>
      <span style="background:#e0e7ff; color:#4338ca; padding:3px 8px; border-radius:6px; font-size:0.7rem; font-weight:700;">${teachers.length} Guru</span>
    </div>
    <div style="padding:16px; display:flex; flex-direction:column; gap:10px;">
      <!-- Search Input Bar -->
      <div style="position:relative; margin-bottom:4px;">
        <input type="text" placeholder="🔍 Cari nama guru, mapel, atau username..." value="${window.filterGuruQuery || ''}" oninput="window.filterGuruList(this.value)" class="form-input" style="width:100%; border-radius:12px; font-size:0.82rem; padding:10px 14px;" />
      </div>

      ${teachers.length === 0 ? `
        <div style="text-align:center; padding:30px; color:#64748b; font-size:0.85rem;">Tidak ada guru yang cocok dengan pencarian "${window.filterGuruQuery}".</div>
      ` : teachers.map(t => `
        <div style="background:white; border:1px solid #e2e8f0; padding:14px 16px; border-radius:14px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
          <div>
            <h4 style="font-size:0.92rem; font-weight:700; color:#1e293b; margin:0;">${t.name || t.teacherName}</h4>
            <p style="font-size:0.78rem; color:#64748b; margin:3px 0 0 0;">Mata Pelajaran: <strong>${t.mapel || t.subject || 'Produktif TKJ'}</strong></p>
          </div>
          <span style="background:#e0e7ff; color:#4338ca; padding:4px 10px; border-radius:8px; font-size:0.74rem; font-weight:600;">${t.username || 'Guru'}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderTotalSiswaView(state) {
  const allStudents = state.students || [];

  const k10 = allStudents.filter(s => {
    const c = String(s.class || s.className || '').toLowerCase();
    return c.includes('10') || c.includes('x');
  });
  const k11 = allStudents.filter(s => {
    const c = String(s.class || s.className || '').toLowerCase();
    return c.includes('11') || c.includes('xi');
  });
  const k12 = allStudents.filter(s => {
    const c = String(s.class || s.className || '').toLowerCase();
    return c.includes('12') || c.includes('xii');
  });
  const totalCount = allStudents.length;

  return `
    <div style="background:white; padding:16px 18px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0;">
      <div style="display:flex; align-items:center; gap:12px;">
        <button style="background:none; border:none; cursor:pointer;" onclick="window.switchSiswaTab('home')">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <h3 style="font-size:1.05rem; font-weight:700; color:#1e293b;">👥 Rekap Total Siswa Berdasarkan Kelas</h3>
      </div>
    </div>
    <div style="padding:16px;">
      <!-- Grand Total Card -->
      <div style="background:linear-gradient(135deg, #0b2545 0%, #134074 100%); color:white; padding:20px; border-radius:16px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 6px 20px rgba(11,37,69,0.25);">
        <div>
          <span style="font-size:0.72rem; font-weight:700; letter-spacing:0.8px; color:#38bdf8; text-transform:uppercase;">TOTAL KESELURUHAN SISWA</span>
          <h2 style="font-size:2.1rem; font-weight:800; margin:4px 0 0 0; color:#ffffff;">${totalCount} <span style="font-size:1rem; font-weight:600; color:#93c5fd;">Siswa Aktif</span></h2>
        </div>
        <div style="width:56px; height:56px; border-radius:14px; background:rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; font-size:2rem;">🎓</div>
      </div>

      <!-- Breakdown Grid 3 Kelas -->
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px;">
        <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:16px; padding:16px 12px; text-align:center;">
          <span style="font-size:0.75rem; font-weight:800; color:#0284c7; text-transform:uppercase;">KELAS 10 (X)</span>
          <h3 style="font-size:1.6rem; font-weight:800; color:#0369a1; margin:6px 0 2px 0;">${k10.length}</h3>
          <span style="font-size:0.72rem; color:#64748b; font-weight:600;">Siswa</span>
        </div>

        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:16px; padding:16px 12px; text-align:center;">
          <span style="font-size:0.75rem; font-weight:800; color:#16a34a; text-transform:uppercase;">KELAS 11 (XI)</span>
          <h3 style="font-size:1.6rem; font-weight:800; color:#15803d; margin:6px 0 2px 0;">${k11.length}</h3>
          <span style="font-size:0.72rem; color:#64748b; font-weight:600;">Siswa</span>
        </div>

        <div style="background:#faf5ff; border:1px solid #e9d5ff; border-radius:16px; padding:16px 12px; text-align:center;">
          <span style="font-size:0.75rem; font-weight:800; color:#9333ea; text-transform:uppercase;">KELAS 12 (XII)</span>
          <h3 style="font-size:1.6rem; font-weight:800; color:#7e22ce; margin:6px 0 2px 0;">${k12.length}</h3>
          <span style="font-size:0.72rem; color:#64748b; font-weight:600;">Siswa</span>
        </div>
      </div>
    </div>
  `;
}

function generateMonthCalendarHtml(year, monthIndex) {
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  
  const today = new Date();
  const isCurrentMonth = (today.getFullYear() === year && today.getMonth() === monthIndex);
  const todayDate = today.getDate();

  const firstDayObj = new Date(year, monthIndex, 1);
  let startDay = firstDayObj.getDay() - 1; 
  if (startDay === -1) startDay = 6; 

  const totalDays = new Date(year, monthIndex + 1, 0).getDate();

  const events = {};
  if (monthNames[monthIndex] === 'September') {
    for (let d = 15; d <= 20; d++) {
      events[d] = { label: 'PTS Ganjil', color: '#0284c7', bg: '#e0f2fe' };
    }
  } else if (monthNames[monthIndex] === 'Oktober') {
    for (let d = 5; d <= 12; d++) {
      events[d] = { label: 'MTCNA TKJ', color: '#4338ca', bg: '#e0e7ff' };
    }
  } else if (monthNames[monthIndex] === 'November') {
    for (let d = 10; d <= 15; d++) {
      events[d] = { label: 'UKK TKJ', color: '#15803d', bg: '#dcfce7' };
    }
  } else if (monthNames[monthIndex] === 'Desember') {
    for (let d = 1; d <= 10; d++) {
      events[d] = { label: 'PAS Ganjil', color: '#b45309', bg: '#fef3c7' };
    }
  }

  let cellsHtml = '';
  for (let i = 0; i < startDay; i++) {
    cellsHtml += `<div style="height:36px;"></div>`;
  }
  for (let d = 1; d <= totalDays; d++) {
    const isToday = isCurrentMonth && (d === todayDate);
    const event = events[d];

    let dayBg = 'transparent';
    let dayColor = '#1e293b';
    let border = 'none';
    let badgeDot = '';

    if (isToday) {
      dayBg = 'linear-gradient(135deg, #0284c7, #0369a1)';
      dayColor = '#ffffff';
      border = '2px solid #38bdf8';
    } else if (event) {
      dayBg = event.bg;
      dayColor = event.color;
      badgeDot = `<span style="width:4px; height:4px; border-radius:50%; background:${event.color}; position:absolute; bottom:3px;"></span>`;
    }

    cellsHtml += `
      <div style="height:36px; display:flex; flex-direction:column; align-items:center; justify-content:center; border-radius:10px; background:${dayBg}; color:${dayColor}; font-weight:${isToday || event ? '800' : '500'}; font-size:0.8rem; border:${border}; position:relative; cursor:pointer;" title="${isToday ? 'Hari Ini' : (event ? event.label : '')}">
        <span>${d}</span>
        ${badgeDot}
      </div>
    `;
  }

  return `
    <div style="background:white; border:1px solid #e2e8f0; border-radius:16px; padding:14px; box-shadow:0 2px 8px rgba(0,0,0,0.04); margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid #f1f5f9;">
        <h4 style="font-size:0.95rem; font-weight:800; color:#0f172a; margin:0;">🗓️ ${monthNames[monthIndex]} ${year}</h4>
        <span style="font-size:0.7rem; font-weight:700; color:${isCurrentMonth ? '#0284c7' : '#64748b'}; background:${isCurrentMonth ? '#e0f2fe' : '#f1f5f9'}; padding:3px 8px; border-radius:6px;">
          ${isCurrentMonth ? 'Bulan Ini (Real-Time)' : 'Bulan Depan'}
        </span>
      </div>

      <div style="display:grid; grid-template-columns:repeat(7, 1fr); text-align:center; margin-bottom:6px;">
        ${dayNames.map(day => `<span style="font-size:0.7rem; font-weight:700; color:#94a3b8; padding-bottom:4px;">${day}</span>`).join('')}
      </div>

      <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:4px;">
        ${cellsHtml}
      </div>
    </div>
  `;
}

function renderKalenderView(state) {
  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth();

  const nextMonthDate = new Date(curYear, curMonth + 1, 1);
  const nextYear = nextMonthDate.getFullYear();
  const nextMonth = nextMonthDate.getMonth();

  const month1Html = generateMonthCalendarHtml(curYear, curMonth);
  const month2Html = generateMonthCalendarHtml(nextYear, nextMonth);

  return `
    <div style="background:white; padding:16px 18px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0;">
      <div style="display:flex; align-items:center; gap:12px;">
        <button style="background:none; border:none; cursor:pointer;" onclick="window.switchSiswaTab('home')">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <h3 style="font-size:1.05rem; font-weight:700; color:#1e293b;">📅 Kalender Akademik 2 Bulan Real-Time</h3>
      </div>
    </div>
    <div style="padding:16px;">
      <!-- Month 1: Current Month -->
      ${month1Html}

      <!-- Month 2: Next Month -->
      ${month2Html}

      <!-- Detailed Agenda List -->
      <div style="font-size:0.85rem; font-weight:700; color:#1e293b; margin:16px 0 10px 0;">Agenda & Catatan Penting:</div>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:white; border:1px solid #e2e8f0; border-left:4px solid #0284c7; padding:12px 14px; border-radius:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.75rem; font-weight:700; color:#0284c7;">15 - 20 September 2026</span>
            <span style="background:#e0f2fe; color:#0284c7; padding:3px 8px; border-radius:6px; font-size:0.7rem; font-weight:700;">PTS</span>
          </div>
          <h4 style="font-size:0.9rem; font-weight:700; color:#1e293b; margin:4px 0 2px 0;">Penilaian Tengah Semester (PTS) Ganjil</h4>
          <p style="font-size:0.75rem; color:#64748b; margin:0;">Ujian teori & praktikum seluruh mata pelajaran.</p>
        </div>

        <div style="background:white; border:1px solid #e2e8f0; border-left:4px solid #6366f1; padding:12px 14px; border-radius:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.75rem; font-weight:700; color:#6366f1;">05 - 12 Oktober 2026</span>
            <span style="background:#e0e7ff; color:#4338ca; padding:3px 8px; border-radius:6px; font-size:0.7rem; font-weight:700;">Sertifikasi</span>
          </div>
          <h4 style="font-size:0.9rem; font-weight:700; color:#1e293b; margin:4px 0 2px 0;">Sertifikasi Industri MikroTik MTCNA</h4>
          <p style="font-size:0.75rem; color:#64748b; margin:0;">Pelatihan dan sertifikasi jaringan internasional untuk kelas XI & XII TKJ.</p>
        <div style="background:white; border:1px solid #e2e8f0; border-left:4px solid #10b981; padding:12px 14px; border-radius:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.75rem; font-weight:700; color:#10b981;">10 - 15 November 2026</span>
            <span style="background:#dcfce7; color:#15803d; padding:3px 8px; border-radius:6px; font-size:0.7rem; font-weight:700;">UKK TKJ</span>
          </div>
          <h4 style="font-size:0.9rem; font-weight:700; color:#1e293b; margin:4px 0 2px 0;">Simulasi Uji Kompetensi Keahlian (UKK)</h4>
          <p style="font-size:0.75rem; color:#64748b; margin:0;">Uji praktikum Perakitan Server, Fiber Optic, dan Routing Cisco di Lab.</p>
        </div>

        <div style="background:white; border:1px solid #e2e8f0; border-left:4px solid #f59e0b; padding:12px 14px; border-radius:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.75rem; font-weight:700; color:#d97706;">01 - 10 Desember 2026</span>
            <span style="background:#fef3c7; color:#b45309; padding:3px 8px; border-radius:6px; font-size:0.7rem; font-weight:700;">PAS Ganjil</span>
          </div>
          <h4 style="font-size:0.9rem; font-weight:700; color:#1e293b; margin:4px 0 2px 0;">Penilaian Akhir Semester (PAS) Ganjil</h4>
          <p style="font-size:0.75rem; color:#64748b; margin:0;">Evaluasi komprehensif semester ganjil tahun ajaran 2026/2027.</p>
        </div>
      </div>
    </div>
  `;
}

function renderGaleriSiswaView(state) {
  return `
    <div style="background:white; padding:16px 18px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0;">
      <div style="display:flex; align-items:center; gap:12px;">
        <button style="background:none; border:none; cursor:pointer;" onclick="window.switchSiswaTab('home')">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <h3 style="font-size:1.05rem; font-weight:700; color:#1e293b;">🖼️ Galeri & Prestasi Siswa TKJ</h3>
      </div>
    </div>
    <div style="padding:16px; display:flex; flex-direction:column; gap:12px;">
      <div style="background:white; border:1px solid #e2e8f0; padding:16px; border-radius:16px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="background:#fef3c7; color:#b45309; font-weight:800; font-size:0.72rem; padding:3px 10px; border-radius:8px;">🏆 PRESTASI</span>
          <span style="font-size:0.75rem; color:#64748b;">LKS 2026</span>
        </div>
        <h4 style="font-size:0.95rem; font-weight:700; color:#0f172a; margin:0 0 6px 0;">🥇 Juara 1 LKS IT Network Systems Administration</h4>
        <p style="font-size:0.78rem; color:#475569; margin:0 0 8px 0;">Tim TKJ SMKN 6 berhasil meraih Medali Emas pada Lomba Kompetensi Siswa bidang Jaringan Komputer.</p>
        <span style="font-size:0.74rem; font-weight:600; color:#0284c7;">Oleh: Tim Siswa XI TKJ 1</span>
      </div>

      <div style="background:white; border:1px solid #e2e8f0; padding:16px; border-radius:16px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="background:#e0f2fe; color:#0369a1; font-weight:800; font-size:0.72rem; padding:3px 10px; border-radius:8px;">🛠️ PRAKTIKUM LAB</span>
          <span style="font-size:0.75rem; color:#64748b;">Lab TKJ 2</span>
        </div>
        <h4 style="font-size:0.95rem; font-weight:700; color:#0f172a; margin:0 0 6px 0;">🌐 Praktikum Fiber Optic Splicing & OTDR Test</h4>
        <p style="font-size:0.78rem; color:#475569; margin:0 0 8px 0;">Penyambungan kabel serat optik menggunakan Fusion Splicer dan pengukuran redaman sinyal.</p>
        <span style="font-size:0.74rem; font-weight:600; color:#0284c7;">Oleh: Kelompok 3 - 10 TKJ 1</span>
      </div>

      <div style="background:white; border:1px solid #e2e8f0; padding:16px; border-radius:16px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="background:#e0e7ff; color:#4338ca; font-weight:800; font-size:0.72rem; padding:3px 10px; border-radius:8px;">💻 PROJECT</span>
          <span style="font-size:0.75rem; color:#64748b;">Cloud Server</span>
        </div>
        <h4 style="font-size:0.95rem; font-weight:700; color:#0f172a; margin:0 0 6px 0;">🚀 Deployment Server Linux Debian & DNS Server</h4>
        <p style="font-size:0.78rem; color:#475569; margin:0 0 8px 0;">Konfigurasi Web Server Apache, MySQL Database, dan Virtual Host lokal sekolah.</p>
        <span style="font-size:0.74rem; font-weight:600; color:#0284c7;">Oleh: Siswa 10 TKJ 1</span>
      </div>
    </div>
  `;
}

function renderLibraryView(state) {
  return `
    <div style="background:white; padding:16px 18px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0;">
      <div style="display:flex; align-items:center; gap:12px;">
        <button style="background:none; border:none; cursor:pointer;" onclick="window.switchSiswaTab('home')">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <h3 style="font-size:1.05rem; font-weight:700; color:#1e293b;">📚 E-Library & Buku Digital TKJ</h3>
      </div>
    </div>
    <div style="padding:16px; display:flex; flex-direction:column; gap:12px;">
      <div style="background:white; border:1px solid #e2e8f0; padding:14px; border-radius:14px; display:flex; gap:14px; align-items:center; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
        <div style="width:48px; height:58px; border-radius:10px; background:linear-gradient(135deg, #0284c7, #0369a1); color:white; display:flex; align-items:center; justify-content:center; font-size:1.6rem; flex-shrink:0; box-shadow:0 4px 10px rgba(2,132,199,0.2);">📘</div>
        <div style="flex:1; min-width:0;">
          <h4 style="font-size:0.92rem; font-weight:700; color:#0f172a; margin:0 0 3px 0;">Jaringan Dasar & Cisco Routing</h4>
          <p style="font-size:0.76rem; color:#64748b; margin:0 0 8px 0;">Modul praktikum konfigurasi Mikrotik, Cisco Packet Tracer & VLAN.</p>
          <button style="background:#0284c7; color:white; border:none; padding:6px 12px; border-radius:8px; font-size:0.75rem; font-weight:700; cursor:pointer;" onclick="window.showToast('📖 Membuka E-Book Jaringan Dasar...', 'success')">Baca Buku Digital</button>
        </div>
      </div>

      <div style="background:white; border:1px solid #e2e8f0; padding:14px; border-radius:14px; display:flex; gap:14px; align-items:center; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
        <div style="width:48px; height:58px; border-radius:10px; background:linear-gradient(135deg, #10b981, #047857); color:white; display:flex; align-items:center; justify-content:center; font-size:1.6rem; flex-shrink:0; box-shadow:0 4px 10px rgba(16,185,129,0.2);">📗</div>
        <div style="flex:1; min-width:0;">
          <h4 style="font-size:0.92rem; font-weight:700; color:#0f172a; margin:0 0 3px 0;">Administrasi System & Server Linux</h4>
          <p style="font-size:0.76rem; color:#64748b; margin:0 0 8px 0;">Panduan lengkap instalasi Debian, DNS Server, Web Server Apache & Nginx.</p>
          <button style="background:#10b981; color:white; border:none; padding:6px 12px; border-radius:8px; font-size:0.75rem; font-weight:700; cursor:pointer;" onclick="window.showToast('📖 Membuka E-Book Server Linux...', 'success')">Baca Buku Digital</button>
        </div>
      </div>

      <div style="background:white; border:1px solid #e2e8f0; padding:14px; border-radius:14px; display:flex; gap:14px; align-items:center; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
        <div style="width:48px; height:58px; border-radius:10px; background:linear-gradient(135deg, #6366f1, #4338ca); color:white; display:flex; align-items:center; justify-content:center; font-size:1.6rem; flex-shrink:0; box-shadow:0 4px 10px rgba(99,102,241,0.2);">📙</div>
        <div style="flex:1; min-width:0;">
          <h4 style="font-size:0.92rem; font-weight:700; color:#0f172a; margin:0 0 3px 0;">Cyber Security & Network Defense</h4>
          <p style="font-size:0.76rem; color:#64748b; margin:0 0 8px 0;">Dasar-dasar keamanan jaringan, Firewall, Penetration Testing & Enkripsi.</p>
          <button style="background:#6366f1; color:white; border:none; padding:6px 12px; border-radius:8px; font-size:0.75rem; font-weight:700; cursor:pointer;" onclick="window.showToast('📖 Membuka E-Book Cyber Security...', 'success')">Baca Buku Digital</button>
        </div>
      </div>
    </div>
  `;
}
