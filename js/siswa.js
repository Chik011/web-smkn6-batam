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
    case 'videotkj':
      contentHtml = renderVidioTKJView(state);
      break;
    case 'pelajaran':
      contentHtml = renderPelajaran(state);
      break;
    case 'nilai':
      contentHtml = renderNilaiView(state);
      break;
    case 'nilaidetail':
      contentHtml = renderNilaiDetailView(state);
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

      <button class="app-icon-item" onclick="window.switchSiswaTab('nilai')">
        <div class="icon-box" style="background:#fef9c3; color:#ca8a04;">
          📊
        </div>
        <span>Nilai Saya</span>
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
        <button style="background:none; border:none; color:#0284c7; font-weight:700; font-size:0.78rem; cursor:pointer; display:flex; align-items:center; gap:4px;" onclick="window.switchSiswaTab('videotkj')">
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
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:70vh; padding:32px 24px; text-align:center;">
      <div style="width:120px; height:120px; border-radius:28px; background:linear-gradient(135deg, #e0f2fe, #bfdbfe); display:flex; align-items:center; justify-content:center; margin-bottom:24px; box-shadow:0 8px 24px rgba(2,132,199,0.15);">
        <svg width="60" height="60" fill="none" stroke="#0284c7" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
      </div>
      <div style="background:linear-gradient(135deg, #fbbf24, #f59e0b); color:white; padding:4px 16px; border-radius:20px; font-size:0.7rem; font-weight:800; letter-spacing:1px; text-transform:uppercase; margin-bottom:16px;">Segera Hadir</div>
      <h2 style="font-size:1.4rem; font-weight:800; color:#0f172a; margin-bottom:10px; line-height:1.3;">Fitur Sedang<br>Dikembangkan</h2>
      <p style="font-size:0.84rem; color:#64748b; max-width:260px; line-height:1.65; margin-bottom:28px;">Fitur Scan QR untuk presensi otomatis sedang dalam tahap pengembangan. Silakan tunggu pembaruan selanjutnya.</p>
      <div style="display:flex; gap:12px; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:14px 20px; max-width:280px; width:100%;">
        <div style="width:40px; height:40px; border-radius:10px; background:#e0f2fe; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <svg width="20" height="20" fill="none" stroke="#0284c7" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <p style="font-size:0.76rem; color:#475569; line-height:1.5; margin:0; text-align:left;">Presensi sementara dilakukan secara manual melalui guru pengampu kelas.</p>
      </div>
      <button style="margin-top:24px; background:#0f172a; color:white; border:none; padding:12px 28px; border-radius:12px; font-size:0.85rem; font-weight:700; cursor:pointer;" onclick="window.switchSiswaTab('home')">← Kembali ke Beranda</button>
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
      <div class="account-menu-item" onclick="window.openSiswaModal('settingProfil')">
        <div class="account-menu-left" style="color:#0284c7;">
          <svg width="20" height="20" fill="none" stroke="#0284c7" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span>Pengaturan Profil Siswa</span>
        </div>
        <svg width="18" height="18" fill="none" stroke="#94a3b8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </div>

      <div class="account-menu-item" onclick="window.openSiswaModal('kts')">
        <div class="account-menu-left">
          <svg width="20" height="20" fill="none" stroke="#2563eb" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h3"/></svg>
          <span>Kartu Tanda Siswa (3D)</span>
        </div>
        <svg width="18" height="18" fill="none" stroke="#94a3b8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </div>

      <div class="account-menu-item" style="cursor:default;">
        <div class="account-menu-left">
          <span style="font-size:1.15rem;">${state.themeMode === 'dark' ? '🌙' : '☀️'}</span>
          <span>Tema Gelap (Dark Mode)</span>
        </div>
        <input type="checkbox" ${state.themeMode === 'dark' ? 'checked' : ''} onchange="window.toggleThemeMode(this.checked)" style="width:20px; height:20px; cursor:pointer;" />
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
  const data = state.visiMisi || {
    visi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    misi: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
      "Incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
      "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore."
    ]
  };

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
          "${data.visi}"
        </p>
      </div>

      <div style="background:white; border:1px solid #e2e8f0; padding:18px; border-radius:16px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <h4 style="font-size:0.9rem; font-weight:800; color:#0f172a; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px;">Misi Utama</h4>
        <ol style="font-size:0.82rem; color:#334155; margin:0 0 0 18px; padding:0; line-height:1.7;">
          ${(data.misi || []).map((m, idx) => `<li style="margin-bottom:${idx === data.misi.length - 1 ? '0' : '8px'};">${m}</li>`).join('')}
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
      <div style="height:36px; display:flex; flex-direction:column; align-items:center; justify-content:center; border-radius:10px; background:${dayBg}; color:${dayColor}; font-weight:${isToday || event ? '800' : '500'}; font-size:0.8rem; border:${border}; position:relative; cursor:pointer; transition:transform 0.15s ease;" onclick="window.showCalendarDateDetail('${monthNames[monthIndex]}', ${d}, ${year})" title="${isToday ? 'Hari Ini (Klik untuk detail)' : (event ? event.label + ' (Klik untuk detail)' : 'Klik untuk melihat agenda')}">
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

window.showCalendarDateDetail = function(monthName, day, year) {
  const overlay = document.getElementById('globalModal');
  const card = document.getElementById('modalCardContent');
  if (!overlay || !card) return;

  const dateStr = `${day} ${monthName} ${year}`;
  
  let eventTag = '🗓️ AGENDA SCHEDULER';
  let eventTitle = `Lorem Ipsum Dolor Sit Amet`;
  let eventColor = '#0284c7';
  let eventBg = '#e0f2fe';
  let eventDesc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';

  if (monthName === 'September' && day >= 15 && day <= 20) {
    eventTag = '🏆 PTS GANJIL';
    eventTitle = `Lorem Ipsum Dolor Sit Amet`;
    eventColor = '#0284c7';
    eventBg = '#e0f2fe';
    eventDesc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  } else if (monthName === 'Oktober' && day >= 5 && day <= 12) {
    eventTag = '📜 SERTIFIKASI MTCNA';
    eventTitle = `Lorem Ipsum Consectetur Adipiscing`;
    eventColor = '#6366f1';
    eventBg = '#e0e7ff';
    eventDesc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.';
  } else if (monthName === 'November' && day >= 10 && day <= 15) {
    eventTag = '💻 SIMULASI UKK TKJ';
    eventTitle = `Lorem Ipsum Eiusmod Tempor`;
    eventColor = '#10b981';
    eventBg = '#dcfce7';
    eventDesc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  } else if (monthName === 'Desember' && day >= 1 && day <= 10) {
    eventTag = '📝 PAS GANJIL';
    eventTitle = `Lorem Ipsum Labore Et Dolore`;
    eventColor = '#f59e0b';
    eventBg = '#fef3c7';
    eventDesc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.';
  }

  card.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
      <span style="background:${eventBg}; color:${eventColor}; font-weight:800; font-size:0.75rem; padding:4px 10px; border-radius:8px;">
        ${eventTag}
      </span>
      <span style="font-size:0.75rem; color:#0284c7; font-weight:700;">📅 ${dateStr}</span>
    </div>
    <h3 style="font-size:1.1rem; font-weight:800; color:#0f172a; margin:0 0 8px 0; line-height:1.35;">${eventTitle}</h3>
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-left:4px solid ${eventColor}; padding:12px 14px; border-radius:12px; margin-bottom:16px;">
      <div style="font-size:0.72rem; font-weight:700; color:#64748b; margin-bottom:4px; text-transform:uppercase;">Deskripsi Acara (Lorem Ipsum):</div>
      <p style="font-size:0.8rem; color:#334155; line-height:1.55; margin:0;">
        ${eventDesc}
      </p>
    </div>
    <button class="btn-primary" style="width:100%; font-weight:700;" onclick="window.closeModal()">Tutup Detail Acara</button>
  `;
  overlay.classList.add('open');
};

function renderKalenderView(state) {
  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth();

  const nextMonthDate = new Date(curYear, curMonth + 1, 1);
  const nextYear = nextMonthDate.getFullYear();
  const nextMonth = nextMonthDate.getMonth();

  const month1Html = generateMonthCalendarHtml(curYear, curMonth);
  const month2Html = generateMonthCalendarHtml(nextYear, nextMonth);

  const agendas = state.kalenderAgendas || [
    { id: '1', date: '15 - 20 September 2026', tag: 'PTS', title: 'Lorem Ipsum Dolor Sit Amet', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', color: '#0284c7', bg: '#e0f2fe', mName: 'September', dNum: 15 },
    { id: '2', date: '05 - 12 Oktober 2026', tag: 'Sertifikasi', title: 'Lorem Ipsum Consectetur Adipiscing', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.', color: '#6366f1', bg: '#e0e7ff', mName: 'Oktober', dNum: 5 },
    { id: '3', date: '10 - 15 November 2026', tag: 'UKK TKJ', title: 'Lorem Ipsum Eiusmod Tempor', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.', color: '#10b981', bg: '#dcfce7', mName: 'November', dNum: 10 },
    { id: '4', date: '01 - 10 Desember 2026', tag: 'PAS Ganjil', title: 'Lorem Ipsum Labore Et Dolore', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa.', color: '#f59e0b', bg: '#fef3c7', mName: 'Desember', dNum: 1 }
  ];

  return `
    <div style="background:white; padding:16px 18px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0;">
      <div style="display:flex; align-items:center; gap:12px;">
        <button style="background:none; border:none; cursor:pointer;" onclick="window.switchSiswaTab('home')">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <h3 style="font-size:1.05rem; font-weight:700; color:#1e293b;">📅 Kalender Akademik Real-Time</h3>
      </div>
    </div>
    <div style="padding:16px;">
      <!-- Month 1: Current Month -->
      ${month1Html}

      <!-- Month 2: Next Month -->
      ${month2Html}

      <!-- Detailed Agenda List -->
      <div style="font-size:0.85rem; font-weight:700; color:#1e293b; margin:16px 0 10px 0;">Agenda & Catatan Penting (Klik untuk detail):</div>
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${agendas.map(a => `
          <div style="background:white; border:1px solid #e2e8f0; border-left:4px solid ${a.color || '#0284c7'}; padding:12px 14px; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.03); cursor:pointer;" onclick="window.showCalendarDateDetail('${a.mName || 'September'}', ${a.dNum || 15}, 2026)">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:0.75rem; font-weight:700; color:${a.color || '#0284c7'};">${a.date}</span>
              <span style="background:${a.bg || '#e0f2fe'}; color:${a.color || '#0284c7'}; padding:3px 8px; border-radius:6px; font-size:0.7rem; font-weight:700;">${a.tag}</span>
            </div>
            <h4 style="font-size:0.9rem; font-weight:700; color:#1e293b; margin:4px 0 2px 0;">${a.title}</h4>
            <p style="font-size:0.75rem; color:#64748b; margin:0; line-height:1.4;">${a.desc || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderGaleriSiswaView(state) {
  const items = (state.galeriItems && state.galeriItems.length > 0) ? state.galeriItems : [
    { id: '1', title: 'Juara 1 LKS Network Administration', category: '🏆 PRESTASI', tagColor: '#b45309', tagBg: '#fef3c7', imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80', subtitle: 'Tim Siswa TKJ SMKN 6 Batam berhasil meraih Medali Emas LKS.' },
    { id: '2', title: 'Praktikum Fiber Optic Splicing', category: '🛠️ PRAKTIKUM', tagColor: '#0369a1', tagBg: '#e0f2fe', imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80', subtitle: 'Penyambungan kabel serat optik menggunakan Fusion Splicer.' },
    { id: '3', title: 'Deployment Server Linux Debian', category: '💻 PROJECT', tagColor: '#4338ca', tagBg: '#e0e7ff', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', subtitle: 'Konfigurasi Web Server, DNS, dan Virtual Host Debian Server.' },
    { id: '4', title: 'Konfigurasi Mikrotik RouterOS', category: '🌐 JARINGAN', tagColor: '#15803d', tagBg: '#dcfce7', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80', subtitle: 'Simulasi routing, VLAN, dan Bandwidth Management Mikrotik.' },
    { id: '5', title: 'Workshop Cyber Security & Defense', category: '⚡ WORKSHOP', tagColor: '#9333ea', tagBg: '#faf5ff', imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', subtitle: 'Pelatihan dasar keamanan jaringan, firewall & pencegahan serangan.' },
    { id: '6', title: 'Perakitan & Trouble-shooting PC Lab', category: '🖥️ HARDWARE', tagColor: '#0d9488', tagBg: '#ccfbf1', imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80', subtitle: 'Praktikum perakitan komputer hardware dan instalasi sistem.' }
  ];

  return `
    <div style="background:white; padding:14px 18px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; position:sticky; top:0; z-index:10;">
      <div style="display:flex; align-items:center; gap:12px;">
        <button style="background:none; border:none; cursor:pointer;" onclick="window.switchSiswaTab('home')">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <h3 style="font-size:1.05rem; font-weight:700; color:#1e293b; margin:0;">🖼️ Galeri & Prestasi Siswa TKJ</h3>
      </div>
      <span style="background:#f1f5f9; color:#0284c7; padding:4px 10px; border-radius:20px; font-size:0.72rem; font-weight:700;">${items.length} Foto</span>
    </div>

    <div style="padding:14px 16px 24px;">
      <div class="galeri-siswa-grid">
        ${items.map((item, idx) => `
          <div class="galeri-card-item" onclick="window.openGaleriDetailModal('${item.id || idx}')">
            <div class="galeri-card-img-wrapper">
              <img src="${item.imageUrl}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'" />
              <span class="galeri-card-badge" style="background:${item.tagBg || '#fef3c7'}; color:${item.tagColor || '#b45309'};">
                ${item.category || '🖼️ GALERI'}
              </span>
            </div>
            <div class="galeri-card-body">
              <div>
                <h4 class="galeri-card-title">${item.title}</h4>
                <p class="galeri-card-desc">${item.subtitle || 'Dokumentasi kegiatan siswa TKJ SMKN 6.'}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

window.openGaleriDetailModal = function(idOrIdx) {
  const overlay = document.getElementById('globalModal');
  const card = document.getElementById('modalCardContent');
  if (!overlay || !card) return;

  const items = (window.store && window.store.state && window.store.state.galeriItems && window.store.state.galeriItems.length > 0)
    ? window.store.state.galeriItems
    : [
      { id: '1', title: 'Juara 1 LKS Network Administration', category: '🏆 PRESTASI', tagColor: '#b45309', tagBg: '#fef3c7', imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80', subtitle: 'Tim Siswa TKJ SMKN 6 Batam berhasil meraih Medali Emas LKS.' },
      { id: '2', title: 'Praktikum Fiber Optic Splicing', category: '🛠️ PRAKTIKUM', tagColor: '#0369a1', tagBg: '#e0f2fe', imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80', subtitle: 'Penyambungan kabel serat optik menggunakan Fusion Splicer.' },
      { id: '3', title: 'Deployment Server Linux Debian', category: '💻 PROJECT', tagColor: '#4338ca', tagBg: '#e0e7ff', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', subtitle: 'Konfigurasi Web Server, DNS, dan Virtual Host Debian Server.' },
      { id: '4', title: 'Konfigurasi Mikrotik RouterOS', category: '🌐 JARINGAN', tagColor: '#15803d', tagBg: '#dcfce7', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80', subtitle: 'Simulasi routing, VLAN, dan Bandwidth Management Mikrotik.' },
      { id: '5', title: 'Workshop Cyber Security & Defense', category: '⚡ WORKSHOP', tagColor: '#9333ea', tagBg: '#faf5ff', imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', subtitle: 'Pelatihan dasar keamanan jaringan, firewall & pencegahan serangan.' },
      { id: '6', title: 'Perakitan & Trouble-shooting PC Lab', category: '🖥️ HARDWARE', tagColor: '#0d9488', tagBg: '#ccfbf1', imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80', subtitle: 'Praktikum perakitan komputer hardware dan instalasi sistem.' }
    ];

  let item = items.find(g => String(g.id) === String(idOrIdx));
  if (!item && !isNaN(parseInt(idOrIdx, 10))) {
    item = items[parseInt(idOrIdx, 10)];
  }
  if (!item) item = items[0];

  card.innerHTML = `
    <div style="border-radius:12px; overflow:hidden; margin:-16px -16px 12px -16px; background:#0f172a; max-height:260px; position:relative;">
      <img src="${item.imageUrl}" style="width:100%; height:220px; object-fit:cover; display:block;" onerror="this.src='https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'" />
      <span style="position:absolute; top:12px; left:12px; background:${item.tagBg || '#fef3c7'}; color:${item.tagColor || '#b45309'}; font-weight:800; font-size:0.7rem; padding:4px 10px; border-radius:8px; backdrop-filter:blur(8px);">
        ${item.category || '🖼️ GALERI'}
      </span>
    </div>
    <h3 style="font-size:1.05rem; font-weight:800; color:#0f172a; margin:0 0 6px 0;">${item.title}</h3>
    <p style="font-size:0.8rem; color:#475569; line-height:1.5; margin:0 0 16px 0;">${item.subtitle || 'Dokumentasi kegiatan dan prestasi siswa TKJ SMKN 6 Batam.'}</p>
    <button class="btn-primary" style="width:100%; font-weight:700;" onclick="window.closeModal()">Tutup Detail</button>
  `;
  overlay.classList.add('open');
};

window.librarySearchQuery = window.librarySearchQuery || '';
window.filterLibrary = function(q) {
  window.librarySearchQuery = q || '';
  store.notify();
};

function renderLibraryView(state) {
  const allBooks = (state.elibraryBooks && state.elibraryBooks.length > 0) ? state.elibraryBooks : [
    { id: '1', title: 'Jaringan Dasar & Cisco Routing', category: 'Modular TKJ', desc: 'Modul praktikum konfigurasi Mikrotik, Cisco Packet Tracer & VLAN.', color: '#0284c7', icon: '📘', coverColor: 'linear-gradient(135deg, #0284c7, #0369a1)' },
    { id: '2', title: 'Administrasi System & Server Linux', category: 'Server & Cloud', desc: 'Panduan lengkap instalasi Debian, DNS Server, Web Server Apache & Nginx.', color: '#10b981', icon: '📗', coverColor: 'linear-gradient(135deg, #10b981, #047857)' },
    { id: '3', title: 'Cyber Security & Network Defense', category: 'Security', desc: 'Dasar-dasar keamanan jaringan, Firewall, Penetration Testing & Enkripsi.', color: '#6366f1', icon: '📙', coverColor: 'linear-gradient(135deg, #6366f1, #4338ca)' },
    { id: '4', title: 'Desain Grafis & Multimedia', category: 'Multimedia', desc: 'Panduan dasar desain grafis, CorelDraw, Photoshop untuk pembelajaran TKJ.', color: '#f59e0b', icon: '📒', coverColor: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { id: '5', title: 'Pemrograman Web & Database', category: 'Coding', desc: 'HTML, CSS, JavaScript, PHP, MySQL untuk pembuatan aplikasi web modern.', color: '#ec4899', icon: '📓', coverColor: 'linear-gradient(135deg, #ec4899, #db2777)' },
    { id: '6', title: 'Troubleshooting & Diagnosa Jaringan', category: 'Teknis', desc: 'Panduan troubleshooting masalah jaringan, kabel, dan perangkat keras.', color: '#14b8a6', icon: '📔', coverColor: 'linear-gradient(135deg, #14b8a6, #0d9488)' }
  ];

  const q = (window.librarySearchQuery || '').trim().toLowerCase();
  const books = q ? allBooks.filter(b =>
    (b.title || '').toLowerCase().includes(q) ||
    (b.category || '').toLowerCase().includes(q) ||
    (b.desc || '').toLowerCase().includes(q)
  ) : allBooks;

  return `
    <div style="background:white; padding:14px 18px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; position:sticky; top:0; z-index:10;">
      <div style="display:flex; align-items:center; gap:12px;">
        <button style="background:none; border:none; cursor:pointer;" onclick="window.switchSiswaTab('home')">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <h3 style="font-size:1.05rem; font-weight:700; color:#1e293b;">📚 E-Library TKJ</h3>
      </div>
      <span style="background:#e0f2fe; color:#0284c7; padding:3px 8px; border-radius:6px; font-size:0.7rem; font-weight:700;">${allBooks.length} Buku</span>
    </div>

    <div style="padding:12px 16px 4px;">
      <div style="position:relative;">
        <svg style="position:absolute; left:12px; top:50%; transform:translateY(-50%); pointer-events:none;" width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input type="text" placeholder="Cari buku, kategori, atau deskripsi..." value="${window.librarySearchQuery || ''}" oninput="window.filterLibrary(this.value)" style="width:100%; border:1px solid #e2e8f0; border-radius:12px; padding:9px 12px 9px 36px; font-size:0.82rem; outline:none; background:#f8fafc; box-sizing:border-box;" />
      </div>
    </div>

    <div style="padding:12px 16px 24px;">
      ${books.length === 0 ? `
        <div style="text-align:center; padding:40px 20px; color:#64748b;">
          <div style="font-size:2.5rem; margin-bottom:8px;">📭</div>
          <p style="font-size:0.85rem; font-weight:600;">Buku tidak ditemukan untuk "${q}"</p>
        </div>
      ` : `
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:14px;">
        ${books.map(b => `
          <div style="background:white; border:1px solid #e2e8f0; border-radius:16px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05); transition:transform 0.2s ease; cursor:pointer;" onclick="window.openLibraryBook('${b.id}', encodeURIComponent('${b.id}'), '${b.url || ''}')">
            <!-- Book Cover -->
            <div style="height:120px; background:${b.coverColor || ('linear-gradient(135deg,' + (b.color || '#0284c7') + ', #0f172a)')}; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; padding:12px;">
              <div style="font-size:2.4rem; margin-bottom:4px;">${b.icon || '📘'}</div>
              <div style="position:absolute; top:8px; right:8px; background:rgba(255,255,255,0.2); backdrop-filter:blur(6px); padding:2px 8px; border-radius:8px; font-size:0.6rem; font-weight:700; color:white;">${b.category || 'Umum'}</div>
            </div>
            <!-- Book Info -->
            <div style="padding:10px 12px;">
              <h4 style="font-size:0.8rem; font-weight:700; color:#0f172a; margin:0 0 4px 0; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${b.title}</h4>
              <p style="font-size:0.68rem; color:#64748b; margin:0 0 8px 0; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${b.desc}</p>
              <button style="width:100%; background:${b.color || '#0284c7'}; color:white; border:none; padding:6px; border-radius:8px; font-size:0.7rem; font-weight:700; cursor:pointer;">${b.url ? '📖 Buka PDF' : '📖 Baca'}</button>
            </div>
          </div>
        `).join('')}
      </div>
      `}
    </div>
  `;
}

function renderVidioTKJView(state) {
  const newsList = state.broadcastNews || [];

  return `
    <div style="background:white; padding:16px 18px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0;">
      <div style="display:flex; align-items:center; gap:12px;">
        <button style="background:none; border:none; cursor:pointer;" onclick="window.switchSiswaTab('home')">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <h3 style="font-size:1.05rem; font-weight:700; color:#1e293b;">🎬 Vidio & Learning TKJ SMKN 6</h3>
      </div>
      <span style="background:#fee2e2; color:#dc2626; padding:3px 8px; border-radius:6px; font-size:0.7rem; font-weight:700;">${newsList.length} Video</span>
    </div>

    <div style="padding:16px; display:flex; flex-direction:column; gap:14px;">
      ${newsList.length === 0 ? `
        <div style="text-align:center; padding:36px 20px; color:#64748b; font-size:0.85rem;">Belum ada video pembelajaran TKJ yang diunggah.</div>
      ` : newsList.map((item, idx) => {
        const yt = getYouTubeDetails(item.url);
        return `
          <div style="background:white; border:1px solid #e2e8f0; border-radius:16px; overflow:hidden; box-shadow:0 3px 10px rgba(0,0,0,0.04);">
            <div style="position:relative; width:100%; height:170px; background:#0f172a; cursor:pointer;" onclick="window.playNewsVideoById('${item.id}', ${idx})">
              ${yt.thumbnailUrl ? `
                <img src="${yt.thumbnailUrl}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'" />
              ` : ''}
              <div style="position:absolute; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center;">
                <div style="width:52px; height:52px; border-radius:50%; background:#dc2626; color:white; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 18px rgba(220,38,38,0.4);">
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            </div>
            <div style="padding:14px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <h4 style="font-size:0.92rem; font-weight:700; color:#0f172a; margin:0 0 4px 0;">${item.title}</h4>
                <p style="font-size:0.75rem; color:#64748b; margin:0;">Pembelajaran TKJ SMKN 6 Batam</p>
              </div>
              <button style="background:#dc2626; color:white; border:none; padding:8px 14px; border-radius:10px; font-size:0.75rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px;" onclick="window.playNewsVideoById('${item.id}', ${idx})">
                ▶ Tonton
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ── Nilai Siswa ──────────────────────────────────────────────────────────────

window.selectedNilaiMapel = window.selectedNilaiMapel || null;

window.openNilaiDetail = function(mapelId, mapelName) {
  window.selectedNilaiMapel = { id: mapelId, name: mapelName };
  window.switchSiswaTab('nilaidetail');
};

function renderNilaiView(state) {
  const user = state.currentUser.siswa;
  const grades = state.grades || [];
  const mapelList = state.mapel || [];

  // Group grades by mapel for this student
  const groupedByMapel = {};
  grades.forEach(g => {
    if (!g.studentId || String(g.studentId) !== String(user.id || '1')) return;
    const key = g.mapel || g.subject || 'Umum';
    if (!groupedByMapel[key]) groupedByMapel[key] = [];
    groupedByMapel[key].push(g);
  });

  // Fall back to mapel list if no real grade data
  const displayMapel = Object.keys(groupedByMapel).length > 0
    ? Object.keys(groupedByMapel)
    : (mapelList.length > 0
        ? mapelList.map(m => m.name || m)
        : ['Matematika', 'Jaringan Dasar', 'Administrasi Infrastruktur', 'Pemrograman Web', 'Bahasa Indonesia', 'Bahasa Inggris']);

  const mapelColors = ['#0284c7','#10b981','#6366f1','#f59e0b','#ec4899','#14b8a6','#ef4444','#8b5cf6'];

  return `
    <div style="background:white; padding:14px 18px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; position:sticky; top:0; z-index:10;">
      <div style="display:flex; align-items:center; gap:12px;">
        <button style="background:none; border:none; cursor:pointer;" onclick="window.switchSiswaTab('home')">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <h3 style="font-size:1.05rem; font-weight:700; color:#1e293b;">📊 Nilai Saya</h3>
      </div>
      <span style="background:#fef9c3; color:#ca8a04; padding:3px 8px; border-radius:6px; font-size:0.7rem; font-weight:700;">${displayMapel.length} Mapel</span>
    </div>

    <div style="padding:14px 16px;">
      <div style="background:linear-gradient(135deg, #0b2545, #134074); border-radius:16px; padding:16px 18px; margin-bottom:16px; color:white; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <p style="font-size:0.7rem; opacity:0.75; margin:0 0 4px;">Siswa</p>
          <h4 style="font-size:1.05rem; font-weight:800; margin:0 0 2px;">${user.name}</h4>
          <p style="font-size:0.75rem; opacity:0.85; margin:0;">${user.class} • NIS: ${user.nis}</p>
        </div>
        <div style="width:48px; height:48px; border-radius:14px; background:rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:1.8rem;">🎓</div>
      </div>

      <p style="font-size:0.8rem; color:#64748b; margin:0 0 14px; font-weight:600;">Pilih mata pelajaran untuk melihat nilai per pertemuan:</p>

      <div style="display:flex; flex-direction:column; gap:10px;">
        ${displayMapel.map((mapelName, idx) => {
          const items = groupedByMapel[mapelName] || [];
          const avgNilai = items.length > 0
            ? Math.round(items.reduce((s, g) => s + (parseFloat(g.nilai || g.score || 0)), 0) / items.length)
            : null;
          const color = mapelColors[idx % mapelColors.length];
          const grade = avgNilai === null ? '-' : avgNilai >= 90 ? 'A' : avgNilai >= 80 ? 'B' : avgNilai >= 70 ? 'C' : avgNilai >= 60 ? 'D' : 'E';
          const gradeColor = avgNilai === null ? '#94a3b8' : avgNilai >= 80 ? '#16a34a' : avgNilai >= 70 ? '#0284c7' : avgNilai >= 60 ? '#f59e0b' : '#dc2626';

          return `
            <div style="background:white; border:1px solid #e2e8f0; border-left:4px solid ${color}; border-radius:14px; padding:14px 16px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.03);" onclick="window.openNilaiDetail('${idx}', '${mapelName.replace(/'/g, "\\'")}')">
              <div style="display:flex; align-items:center; gap:12px; min-width:0; flex:1;">
                <div style="width:40px; height:40px; border-radius:10px; background:${color}15; color:${color}; display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0;">📚</div>
                <div style="min-width:0;">
                  <h4 style="font-size:0.88rem; font-weight:700; color:#1e293b; margin:0 0 3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${mapelName}</h4>
                  <p style="font-size:0.72rem; color:#64748b; margin:0;">${items.length > 0 ? items.length + ' pertemuan' : 'Tap untuk detail nilai'}</p>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:10px; flex-shrink:0;">
                ${avgNilai !== null ? `<div style="text-align:right;"><div style="font-size:1.1rem; font-weight:800; color:${gradeColor};">${avgNilai}</div><div style="font-size:0.65rem; font-weight:700; color:${gradeColor};">Grade ${grade}</div></div>` : ''}
                <svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderNilaiDetailView(state) {
  const selected = window.selectedNilaiMapel || { id: '0', name: 'Mata Pelajaran' };
  const user = state.currentUser.siswa;
  const allGrades = state.grades || [];

  const mapelGrades = allGrades.filter(g =>
    (String(g.studentId) === String(user.id || '1')) &&
    ((g.mapel || g.subject || '') === selected.name)
  );

  // Fallback sample data if no real data
  const pertemuanList = mapelGrades.length > 0 ? mapelGrades : [
    { pertemuan: 1, topik: 'Pengenalan Materi', nilai: 85, keterangan: 'Tugas Harian' },
    { pertemuan: 2, topik: 'Praktikum Dasar', nilai: 90, keterangan: 'Praktikum' },
    { pertemuan: 3, topik: 'Kuis Tengah', nilai: 78, keterangan: 'Kuis' },
    { pertemuan: 4, topik: 'Proyek Individu', nilai: 88, keterangan: 'Proyek' },
    { pertemuan: 5, topik: 'UTS / PTS', nilai: 82, keterangan: 'Ujian' }
  ];

  const avgNilai = Math.round(pertemuanList.reduce((s, p) => s + parseFloat(p.nilai || p.score || 0), 0) / pertemuanList.length);
  const grade = avgNilai >= 90 ? 'A' : avgNilai >= 80 ? 'B' : avgNilai >= 70 ? 'C' : avgNilai >= 60 ? 'D' : 'E';
  const gradeColor = avgNilai >= 80 ? '#16a34a' : avgNilai >= 70 ? '#0284c7' : avgNilai >= 60 ? '#f59e0b' : '#dc2626';

  return `
    <div style="background:white; padding:14px 18px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; position:sticky; top:0; z-index:10;">
      <div style="display:flex; align-items:center; gap:12px;">
        <button style="background:none; border:none; cursor:pointer;" onclick="window.switchSiswaTab('nilai')">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <h3 style="font-size:1rem; font-weight:700; color:#1e293b; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">📚 ${selected.name}</h3>
      </div>
    </div>

    <div style="padding:14px 16px;">
      <div style="background:linear-gradient(135deg, #0b2545, #134074); border-radius:16px; padding:18px; margin-bottom:16px; color:white; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <p style="font-size:0.7rem; opacity:0.75; margin:0 0 4px 0;">Rata-rata Nilai</p>
          <div style="font-size:2.5rem; font-weight:900; line-height:1; margin-bottom:4px;">${avgNilai}</div>
          <div style="display:inline-block; background:${gradeColor}; color:white; padding:2px 10px; border-radius:8px; font-size:0.72rem; font-weight:800;">Grade ${grade}</div>
        </div>
        <div>
          <p style="font-size:0.7rem; opacity:0.75; margin:0 0 8px 0; text-align:right;">${pertemuanList.length} Pertemuan</p>
          <div style="width:56px; height:56px; border-radius:14px; background:rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:1.8rem;">🏆</div>
        </div>
      </div>

      <p style="font-size:0.8rem; font-weight:700; color:#1e293b; margin:0 0 12px;">Rincian Nilai Per Pertemuan:</p>

      <div style="display:flex; flex-direction:column; gap:8px;">
        ${pertemuanList.map((p, idx) => {
          const nilaiNum = parseFloat(p.nilai || p.score || 0);
          const nilaiColor = nilaiNum >= 80 ? '#16a34a' : nilaiNum >= 70 ? '#0284c7' : nilaiNum >= 60 ? '#f59e0b' : '#dc2626';
          const nilaiBg = nilaiNum >= 80 ? '#f0fdf4' : nilaiNum >= 70 ? '#f0f9ff' : nilaiNum >= 60 ? '#fffbeb' : '#fef2f2';
          const pertemuanNum = p.pertemuan || p.session || (idx + 1);
          const topik = p.topik || p.topic || p.keterangan || p.note || 'Penilaian';
          const ket = (p.keterangan || p.type || '');
          return `
            <div style="background:white; border:1px solid #e2e8f0; border-radius:12px; padding:12px 14px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 1px 4px rgba(0,0,0,0.03);">
              <div style="display:flex; align-items:center; gap:12px;">
                <div style="width:36px; height:36px; border-radius:10px; background:#e0f2fe; color:#0284c7; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:800; flex-shrink:0;">P${pertemuanNum}</div>
                <div>
                  <h4 style="font-size:0.85rem; font-weight:700; color:#1e293b; margin:0 0 2px;">${topik}</h4>
                  ${ket ? `<span style="font-size:0.68rem; color:#64748b; background:#f1f5f9; padding:1px 6px; border-radius:4px;">${ket}</span>` : ''}
                </div>
              </div>
              <div style="background:${nilaiBg}; border:1px solid ${nilaiColor}50; padding:6px 12px; border-radius:10px; text-align:center; flex-shrink:0; min-width:48px;">
                <div style="font-size:1.2rem; font-weight:800; color:${nilaiColor}; line-height:1;">${nilaiNum || '-'}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

window.openMasukanForm = function() {
  window.open('https://docs.google.com/forms/d/e/1FAIpQLScKiNYSRVesZ1kejenWmbHtmZ7YRk1vD9YJQ-Ul0MOGaRuWTA/viewform?usp=publish-editor', '_blank', 'noopener,noreferrer');
};

window.openLibraryBook = function(id, title, url) {
  if (url && url !== 'undefined' && url !== '') {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    if (window.showToast) window.showToast('📖 Membuka: ' + title, 'success');
  }
};
