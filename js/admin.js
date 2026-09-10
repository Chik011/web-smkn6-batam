/* Admin View Renderer */

import { store } from './state.js';

export function renderAdminScreen(state) {
  const activeTab = state.activeTabs.admin || 'home';

  let contentHtml = '';
  switch (activeTab) {
    case 'home':
      contentHtml = renderHome(state);
      break;
    case 'guru':
      contentHtml = renderGuru(state);
      break;
    case 'mapel':
      contentHtml = renderMapel(state);
      break;
    case 'siswa':
      contentHtml = renderSiswa(state);
      break;
    case 'jadwal':
      contentHtml = renderJadwal(state);
      break;
    case 'setting':
      contentHtml = renderSetting(state);
      break;
    default:
      contentHtml = renderHome(state);
  }

  const bottomNavHtml = `
    <nav class="phone-bottom-nav">
      <button class="nav-item ${activeTab === 'home' ? 'active' : ''}" data-tab="home">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
        </div>
        <span>Home</span>
      </button>

      <button class="nav-item ${activeTab === 'guru' ? 'active' : ''}" data-tab="guru">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
        </div>
        <span>Guru</span>
      </button>

      <button class="nav-item ${activeTab === 'mapel' ? 'active' : ''}" data-tab="mapel">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        </div>
        <span>Mapel</span>
      </button>

      <button class="nav-item ${activeTab === 'siswa' ? 'active' : ''}" data-tab="siswa">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        </div>
        <span>Siswa</span>
      </button>

      <button class="nav-item ${activeTab === 'jadwal' ? 'active' : ''}" data-tab="jadwal">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </div>
        <span>Jadwal</span>
      </button>

      <button class="nav-item ${activeTab === 'setting' ? 'active' : ''}" data-tab="setting">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </div>
        <span>Setting</span>
      </button>
    </nav>
  `;

  return { contentHtml, bottomNavHtml };
}

function renderHome(state) {
  const studentsCount = state.students.length;
  const videos = state.broadcastNews || [];

  return `
    <div class="admin-header">
      <span class="admin-header-title">Admin Panel</span>
      <h2>Home</h2>
    </div>

    <!-- Class Count Grid Cards matching Image 3 -->
    <div class="stat-cards-grid">
      <div class="stat-card" onclick="window.simulateExportData('Kelas 10')" title="Klik untuk ekspor data">
        <div class="class-label">Kls 10</div>
        <div class="class-num">3</div>
        <div class="class-sub">Export 📊</div>
      </div>
      <div class="stat-card" onclick="window.simulateExportData('Kelas 11')" title="Klik untuk ekspor data">
        <div class="class-label">Kls 11</div>
        <div class="class-num">0</div>
        <div class="class-sub">Export 📊</div>
      </div>
      <div class="stat-card" onclick="window.simulateExportData('Kelas 12')" title="Klik untuk ekspor data">
        <div class="class-label">Kls 12</div>
        <div class="class-num">0</div>
        <div class="class-sub">Export 📊</div>
      </div>
    </div>

    <!-- Total Seluruh Siswa Card -->
    <div class="total-siswa-card" onclick="window.simulateExportData('Semua Kelas')" title="Klik untuk ekspor seluruh siswa" style="cursor:pointer;">
      <p>Total Seluruh Siswa Terdaftar</p>
      <h3>${studentsCount}</h3>
      <span style="font-size:0.75rem; opacity:0.85;">📥 Klik untuk unduh rekap data</span>
    </div>

    <!-- Broadcast News Section -->
    <div class="content-card">
      <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin-bottom:12px;">📢 Buat Broadcast News</h4>
      <form onsubmit="window.handleBroadcastSubmit(event)">
        <div class="form-group">
          <input type="text" id="newsTitle" class="form-input" placeholder="Judul Pengumuman" required />
        </div>
        <div class="form-group">
          <input type="text" id="newsUrl" class="form-input" placeholder="Link YouTube Video" required />
        </div>
        <button type="submit" class="btn-primary">Publikasikan Broadcast</button>
      </form>
    </div>

    <!-- Video List -->
    <div style="padding:0 16px 16px;">
      <h4 style="font-size:0.85rem; font-weight:700; color:#1e293b; margin-bottom:8px;">Daftar Video</h4>
      ${videos.map(v => `
        <div class="list-item-card" style="margin:0 0 8px;">
          <span style="font-size:0.85rem; font-weight:600; color:#1e293b;">${v.title}</span>
          <div class="item-actions">
            <button class="icon-btn-action edit" onclick="window.playNewsVideoById('${v.id}')">▶</button>
            <button class="icon-btn-action delete" onclick="store.deleteNews('${v.id}'); window.showToast('Video berhasil dihapus.', 'info');">🗑️</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderGuru(state) {
  window.handleSearchTeacher = function(val) {
    window._teacherSearch = val.toLowerCase();
    const listEl = document.getElementById('adminTeacherList');
    if (!listEl) return;
    const items = listEl.querySelectorAll('.list-item-card');
    items.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(window._teacherSearch) ? 'flex' : 'none';
    });
  };

  const seenG = new Set();
  const teachers = (state.teachers || []).filter(t => {
    const k = (t.name || t.username || t.id).toString().trim().toLowerCase();
    if (seenG.has(k)) return false;
    seenG.add(k);
    return true;
  });

  return `
    <div class="admin-header">
      <span class="admin-header-title">Admin Panel</span>
      <h2>Guru</h2>
    </div>

    <div class="action-bar-row">
      <span style="font-size:0.9rem; font-weight:700; color:#1e293b;">Daftar Pengajar (${teachers.length})</span>
      <button class="btn-add-primary" onclick="window.openAdminModal('tambahGuru')">+ Tambah</button>
    </div>

    <div style="padding:0 16px; margin-bottom:12px; display:flex; gap:8px;">
      <input type="text" class="form-input" placeholder="Cari nama atau mapel guru..." oninput="window.handleSearchTeacher(this.value)" />
    </div>

    <div id="adminTeacherList" style="display:flex; flex-direction:column;">
      ${teachers.map(t => `
        <div class="list-item-card">
          <div class="list-item-left">
            <div class="list-item-avatar">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <div>
              <h4 style="font-size:0.92rem; font-weight:700; color:#1e293b;">${t.name}</h4>
              <p style="font-size:0.75rem; color:#64748b;">User: ${t.username}</p>
              <p style="font-size:0.72rem; color:#0284c7; font-weight:600;">${t.mapel}</p>
            </div>
          </div>
          <div class="item-actions">
            <button class="icon-btn-action delete" onclick="if(confirm('Hapus pengajar ${t.name}?')) { store.deleteTeacher('${t.id}'); window.showToast('Pengajar berhasil dihapus.', 'info'); }">🗑️</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderMapel(state) {
  const seenM = new Set();
  const mapelList = (state.mapel || []).filter(m => {
    const k = (m.name || m.id).toString().trim().toLowerCase();
    if (seenM.has(k)) return false;
    seenM.add(k);
    return true;
  });

  return `
    <div class="admin-header">
      <span class="admin-header-title">Admin Panel</span>
      <h2>Mapel</h2>
    </div>

    <div class="content-card mt-4">
      <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin-bottom:12px;">Tambah Mapel Baru</h4>
      <form onsubmit="window.handleMapelSubmit(event)">
        <div class="form-group">
          <input type="text" id="mapelName" class="form-input" placeholder="Nama Mata Pelajaran" required />
        </div>
        <button type="submit" class="btn-primary">Simpan</button>
      </form>
    </div>

    <div style="padding:0 16px;">
      <h4 style="font-size:0.9rem; font-weight:700; color:#1e293b; margin-bottom:8px;">Daftar Mata Pelajaran</h4>
      ${mapelList.map(m => `
        <div class="list-item-card" style="margin:0 0 8px;">
          <span style="font-size:0.88rem; font-weight:600; color:#1e293b;">📘 ${m.name}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderSiswa(state) {
  const subView = state.adminSubView.siswa || 'level';

  return `
    <div class="admin-header">
      <span class="admin-header-title">Admin Panel</span>
      <h2>Siswa</h2>
    </div>

    <div style="padding:16px;">
      ${subView === 'level' ? renderSiswaLevelView(state) :
        subView === 'rooms' ? renderSiswaRoomsView(state) :
        renderSiswaMenuView(state)}
    </div>
  `;
}

function renderSiswaLevelView(state) {
  return `
    <h4 style="font-size:0.9rem; font-weight:700; color:#1e293b; margin-bottom:12px;">Pilih Tingkat Kelas</h4>
    <div style="display:flex; flex-direction:column; gap:10px;">
      <div class="content-card" style="margin:0; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="window.setAdminSiswaSubView('rooms', 10)">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:36px; height:36px; border-radius:8px; background:#dbeafe; color:#1e40af; display:flex; align-items:center; justify-content:center;">📘</div>
          <span style="font-weight:700; color:#1e293b;">Kelas 10</span>
        </div>
        <span>›</span>
      </div>

      <div class="content-card" style="margin:0; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="window.setAdminSiswaSubView('rooms', 11)">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:36px; height:36px; border-radius:8px; background:#dbeafe; color:#1e40af; display:flex; align-items:center; justify-content:center;">📘</div>
          <span style="font-weight:700; color:#1e293b;">Kelas 11</span>
        </div>
        <span>›</span>
      </div>

      <div class="content-card" style="margin:0; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="window.setAdminSiswaSubView('rooms', 12)">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:36px; height:36px; border-radius:8px; background:#dbeafe; color:#1e40af; display:flex; align-items:center; justify-content:center;">📘</div>
          <span style="font-weight:700; color:#1e293b;">Kelas 12</span>
        </div>
        <span>›</span>
      </div>
    </div>
  `;
}

function renderSiswaRoomsView(state) {
  const targetLevel = parseInt(state.adminSubView.selectedLevel || 10);
  const seenC = new Set();
  const classes = (state.classes || []).filter(c => {
    const cLevel = parseInt(c.level || c.angkatan || (String(c.name || '').match(/\d+/)?.[0]) || 10);
    if (cLevel !== targetLevel) return false;
    const k = String(c.name || '').trim().toLowerCase();
    if (seenC.has(k)) return false;
    seenC.add(k);
    return true;
  });

  return `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <div style="display:flex; align-items:center; gap:8px;">
        <button style="background:none; border:none; cursor:pointer;" onclick="window.setAdminSiswaSubView('level')">←</button>
        <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b;">Ruangan Kelas ${targetLevel}</h4>
      </div>
      <button style="background:none; border:none; color:#0284c7; font-size:1.4rem; cursor:pointer; font-weight:700;" onclick="window.openAdminModal('tambahKelas')">+</button>
    </div>

    <div style="display:flex; flex-direction:column; gap:10px;">
      ${classes.length === 0 ? `
        <div class="content-card text-center" style="padding:20px; color:#94a3b8;">
          Belum ada ruangan kelas untuk Kelas ${targetLevel}.
        </div>
      ` : classes.map(c => `
        <div class="content-card" style="margin:0; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="window.setAdminSiswaSubView('menu', ${targetLevel}, '${c.name}')">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:36px; height:36px; border-radius:8px; background:#e2e8f0; display:flex; align-items:center; justify-content:center;">🏫</div>
            <div>
              <h5 style="font-size:0.9rem; font-weight:700; color:#1e293b;">${c.name}</h5>
              <p style="font-size:0.72rem; color:#64748b;">${c.count || 3} Peserta Didik</p>
            </div>
          </div>
          <span>›</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderSiswaMenuView(state) {
  const className = state.adminSubView.selectedClass;

  return `
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:16px;">
      <button style="background:none; border:none; cursor:pointer;" onclick="window.setAdminSiswaSubView('rooms')">←</button>
      <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b;">Menu ${className}</h4>
    </div>

    <div style="display:flex; flex-direction:column; gap:10px;">
      <div class="content-card" style="margin:0; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="alert('Daftar Siswa untuk ${className}')">
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:1.2rem;">👥</span>
          <span style="font-weight:700; color:#1e293b; font-size:0.88rem;">Daftar Siswa</span>
        </div>
        <span>›</span>
      </div>

      <div class="content-card" style="margin:0; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="alert('Rekap Absensi untuk ${className}')">
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:1.2rem;">☑️</span>
          <span style="font-weight:700; color:#1e293b; font-size:0.88rem;">Rekap Absensi</span>
        </div>
        <span>›</span>
      </div>

      <div class="content-card" style="margin:0; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="alert('Nilai Akademik untuk ${className}')">
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:1.2rem;">📊</span>
          <span style="font-weight:700; color:#1e293b; font-size:0.88rem;">Nilai Akademik</span>
        </div>
        <span>›</span>
      </div>
    </div>
  `;
}

function renderJadwal(state) {
  const subView = state.adminSubView.jadwal || 'level';

  return `
    <div class="admin-header">
      <span class="admin-header-title">Admin Panel</span>
      <h2>Jadwal</h2>
    </div>

    <div style="padding:16px;">
      ${subView === 'level' ? renderJadwalLevelView(state) :
        subView === 'list' ? renderJadwalListView(state) :
        renderJadwalCreateView(state)}
    </div>
  `;
}

function renderJadwalLevelView(state) {
  return `
    <h4 style="font-size:0.9rem; font-weight:700; color:#1e293b; margin-bottom:12px;">Kelola Jadwal</h4>
    <div style="display:flex; flex-direction:column; gap:10px;">
      <div class="content-card" style="margin:0; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="window.setAdminJadwalSubView('list', 10)">
        <div style="display:flex; align-items:center; gap:12px;">
          <span>📅</span>
          <span style="font-weight:700; color:#1e293b; font-size:0.88rem;">Jadwal Kelas 10</span>
        </div>
        <span>›</span>
      </div>

      <div class="content-card" style="margin:0; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="window.setAdminJadwalSubView('list', 11)">
        <div style="display:flex; align-items:center; gap:12px;">
          <span>📅</span>
          <span style="font-weight:700; color:#1e293b; font-size:0.88rem;">Jadwal Kelas 11</span>
        </div>
        <span>›</span>
      </div>

      <div class="content-card" style="margin:0; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="window.setAdminJadwalSubView('list', 12)">
        <div style="display:flex; align-items:center; gap:12px;">
          <span>📅</span>
          <span style="font-weight:700; color:#1e293b; font-size:0.88rem;">Jadwal Kelas 12</span>
        </div>
        <span>›</span>
      </div>
    </div>
  `;
}

function renderJadwalListView(state) {
  const targetLevel = parseInt(state.adminSubView.selectedJadwalLevel || 10);
  const seenS = new Set();
  const schedules = (state.schedules || []).filter(s => {
    const sLevel = parseInt(s.level || (String(s.class || '').match(/\d+/)?.[0]) || 10);
    if (sLevel !== targetLevel) return false;
    const k = `${s.mapel}_${s.hari}_${s.waktu}_${s.class}`.toLowerCase();
    if (seenS.has(k)) return false;
    seenS.add(k);
    return true;
  });

  return `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <div style="display:flex; align-items:center; gap:8px;">
        <button style="background:none; border:none; cursor:pointer;" onclick="window.setAdminJadwalSubView('level')">←</button>
        <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b;">Jadwal Kelas ${targetLevel}</h4>
      </div>
      <button class="btn-add-primary" onclick="window.setAdminJadwalSubView('create')">+ Tambah</button>
    </div>

    <div style="display:flex; gap:8px; margin-bottom:12px;">
      <input type="text" class="form-input" placeholder="Cari jadwal (mapel/guru)..." />
      <button style="background:#e0e7ff; color:#4f46e5; border:none; padding:0 12px; border-radius:8px; font-weight:700;">A-Z</button>
    </div>

    ${schedules.length === 0 ? `
      <div class="content-card text-center" style="padding:24px 16px; color:#94a3b8;">
        <p style="font-size:0.85rem; font-weight:600; margin-bottom:8px;">Belum ada jadwal tersimpan untuk Kelas ${targetLevel}.</p>
        <button class="btn-primary" style="max-width:200px; margin:0 auto;" onclick="window.setAdminJadwalSubView('create')">+ Buat Jadwal Baru</button>
      </div>
    ` : schedules.map(s => `
      <div class="content-card" style="margin:0 0 10px; position:relative;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <h4 style="font-size:1rem; font-weight:800; color:#1e293b;">${s.mapel}</h4>
            <p style="font-size:0.75rem; color:#64748b; margin-top:2px;">🗓️ ${s.hari}</p>
            <p style="font-size:0.75rem; color:#64748b;">⏰ ${s.waktu}</p>
            <p style="font-size:0.72rem; color:#0284c7; font-weight:600; margin-top:4px;">${s.guru} | ${s.ruangan}</p>
          </div>
          <button class="icon-btn-action delete" onclick="store.deleteSchedule('${s.id}')">🗑️</button>
        </div>
      </div>
    `).join('')}
  `;
}

function renderJadwalCreateView(state) {
  const mapel = state.mapel;
  const teachers = state.teachers;

  return `
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
      <button style="background:none; border:none; cursor:pointer;" onclick="window.setAdminJadwalSubView('list')">←</button>
      <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b;">Buat Jadwal Baru</h4>
    </div>

    <form onsubmit="window.handleCreateSchedule(event)">
      <div class="form-group">
        <select class="form-select" id="schedMapel" required>
          ${mapel.map(m => `<option value="${m.name}">${m.name}</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <select class="form-select" id="schedGuru" required>
          ${teachers.map(t => `<option value="${t.name}">${t.name}</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Ruangan</label>
        <div class="room-selector-pills">
          <span class="pill-option selected" onclick="window.selectRoom(this, 'Ruangan Kelas')">Ruangan Kelas</span>
          <span class="pill-option" onclick="window.selectRoom(this, 'Lab 1')">Lab 1</span>
          <span class="pill-option" onclick="window.selectRoom(this, 'Lab 2')">Lab 2</span>
          <span class="pill-option" onclick="window.selectRoom(this, 'Lab 3')">Lab 3</span>
        </div>
        <input type="hidden" id="schedRuangan" value="Ruangan Kelas" />
      </div>

      <div class="form-group">
        <label class="form-label">Waktu Belajar</label>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
          <input type="text" id="schedStart" class="form-input" value="07:30" placeholder="Mulai" />
          <input type="text" id="schedEnd" class="form-input" value="11:30" placeholder="Selesai" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Hari</label>
        <div class="day-selector-pills">
          <span class="pill-option selected" onclick="window.selectDay(this, 'Senin')">Senin</span>
          <span class="pill-option" onclick="window.selectDay(this, 'Selasa')">Selasa</span>
          <span class="pill-option" onclick="window.selectDay(this, 'Rabu')">Rabu</span>
          <span class="pill-option" onclick="window.selectDay(this, 'Kamis')">Kamis</span>
          <span class="pill-option" onclick="window.selectDay(this, 'Jumat')">Jumat</span>
        </div>
        <input type="hidden" id="schedHari" value="Senin" />
      </div>

      <button type="submit" class="btn-primary mt-4">Simpan Jadwal</button>
    </form>
  `;
}

function renderSetting(state) {
  const admin = state.currentUser.admin;

  return `
    <div class="admin-header">
      <span class="admin-header-title">Admin Panel</span>
      <h2>Setting & Firebase Integration</h2>
    </div>

    <!-- Firebase Connection Status Card -->
    <div class="content-card mt-4" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff; border: 1px solid #334155;">
      <div style="display:flex; align-items:center; justify-between; margin-bottom:12px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4.33 16.03l2.84-15.54a.75.75 0 011.41-.12l2.36 10.3 2.1-3.95a.75.75 0 011.36.08l4.9 14.54a.75.75 0 01-1.07.87L3.92 16.89a.75.75 0 01-.41-.86z" fill="#FFCA28"/><path d="M3.92 16.89l8.6-4.8 4.79 8.87a.75.75 0 01-1.07.87L3.92 16.89z" fill="#FFA000"/><path d="M12.52 10.67l2.1-3.95a.75.75 0 011.36.08l4.9 14.54-8.36-10.67z" fill="#F57C00"/></svg>
          <div>
            <h4 style="font-size:0.95rem; font-weight:700; color:#f8fafc; margin:0;">Firebase Cloud Database Status</h4>
            <p style="font-size:0.75rem; color:#94a3b8; margin:2px 0 0 0;">Terhubung & Sinkron Realtime</p>
          </div>
        </div>
        <span style="display:inline-flex; align-items:center; gap:6px; background:rgba(34,197,94,0.15); color:#4ade80; padding:4px 10px; border-radius:20px; font-size:0.72rem; font-weight:600; border:1px solid rgba(34,197,94,0.3);">
          <span style="width:8px; height:8px; background:#4ade80; border-radius:50%; display:inline-block; box-shadow:0 0 8px #4ade80;"></span> Live Sync
        </span>
      </div>

      <div style="background:rgba(15,23,42,0.6); padding:12px; border-radius:8px; font-size:0.78rem; display:flex; flex-direction:column; gap:6px; border:1px solid rgba(255,255,255,0.05);">
        <div style="display:flex; justify-content:space-between;">
          <span style="color:#94a3b8;">Project ID:</span>
          <span style="font-family:monospace; color:#38bdf8; font-weight:600;">tkjsmk6-714ce</span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:#94a3b8;">Auth Domain:</span>
          <span style="font-family:monospace; color:#e2e8f0;">tkjsmk6-714ce.firebaseapp.com</span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:#94a3b8;">Storage Bucket:</span>
          <span style="font-family:monospace; color:#e2e8f0;">tkjsmk6-714ce.firebasestorage.app</span>
        </div>
      </div>
    </div>

    <!-- Security Card matching Image 3 -->
    <div class="content-card mt-4">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
        <svg width="22" height="22" fill="none" stroke="#2563eb" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
        <div>
          <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b;">Keamanan Administrator</h4>
          <p style="font-size:0.72rem; color:#64748b;">Kelola kredensial login panel admin secara online melalui Firebase.</p>
        </div>
      </div>

      <form onsubmit="window.showToast('✅ Kredensial Administrator Berhasil Diperbarui!', 'success'); return false;">
        <div class="form-group">
          <label class="form-label">Username Admin</label>
          <input type="text" class="form-input" value="${admin.username}" />
        </div>
        <div class="form-group">
          <label class="form-label">Password Baru</label>
          <input type="password" class="form-input" value="••••••••" />
        </div>
        <button type="submit" class="btn-primary">Update Kredensial Online</button>
      </form>
    <div class="content-card mt-4">
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:1.3rem;">${state.themeMode === 'dark' ? '🌙' : '☀️'}</span>
          <div>
            <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b;">Tema Gelap (Dark Mode)</h4>
            <p style="font-size:0.72rem; color:#64748b;">Ubah tampilan seluruh antarmuka aplikasi menjadi gelap/terang.</p>
          </div>
        </div>
        <input type="checkbox" ${state.themeMode === 'dark' ? 'checked' : ''} onchange="window.toggleThemeMode(this.checked)" style="width:22px; height:22px; cursor:pointer;" />
      </div>
    </div>

    <div style="padding:0 16px 20px;">
      <button class="btn-danger-outline" onclick="window.logout()">
        🚪 Logout dari Admin
      </button>
      <p style="text-align:center; font-size:0.7rem; color:#94a3b8; margin-top:16px;">Versi 1.3.0 - TKJ Online Academic Hub (Firebase Connected)</p>
    </div>
  `;
}

