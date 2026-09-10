/* Admin View Renderer */

import { store } from './state.js';
import { uploadFileToCloudinary } from './firebase.js';

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
    case 'galeri':
      contentHtml = renderGaleriAdmin(state);
      break;
    case 'kalender':
      contentHtml = renderKalenderAdmin(state);
      break;
    case 'elibrary':
      contentHtml = renderElibraryAdmin(state);
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
  const students = state.students || [];
  const studentsCount = students.length;
  const count10 = students.filter(s => (s.class || '10').includes('10')).length;
  const count11 = students.filter(s => (s.class || '').includes('11')).length;
  const count12 = students.filter(s => (s.class || '').includes('12')).length;
  const videos = state.broadcastNews || [];

  return `
    <div class="admin-header">
      <span class="admin-header-title">Admin Panel</span>
      <h2>Home</h2>
    </div>

    <!-- Class Count Grid Cards -->
    <div class="stat-cards-grid">
      <div class="stat-card" onclick="window.simulateExportData('Kelas 10')" title="Klik untuk ekspor data">
        <div class="class-label">Kls 10</div>
        <div class="class-num">${count10}</div>
        <div class="class-sub">Export 📊</div>
      </div>
      <div class="stat-card" onclick="window.simulateExportData('Kelas 11')" title="Klik untuk ekspor data">
        <div class="class-label">Kls 11</div>
        <div class="class-num">${count11}</div>
        <div class="class-sub">Export 📊</div>
      </div>
      <div class="stat-card" onclick="window.simulateExportData('Kelas 12')" title="Klik untuk ekspor data">
        <div class="class-label">Kls 12</div>
        <div class="class-num">${count12}</div>
        <div class="class-sub">Export 📊</div>
      </div>
    </div>

    <!-- Total Seluruh Siswa Card -->
    <div class="total-siswa-card" onclick="window.simulateExportData('Semua Kelas')" title="Klik untuk ekspor seluruh siswa" style="cursor:pointer;">
      <p>Total Seluruh Siswa Terdaftar</p>
      <h3>${studentsCount}</h3>
      <span style="font-size:0.75rem; opacity:0.85;">📥 Klik untuk unduh rekap data</span>
    </div>

    <!-- Kelola Konten & Media Academic Hub (Admin Main Actions) -->
    <div class="content-card">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
        <span style="font-size:1.4rem;">🛠️</span>
        <div>
          <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin:0;">Kelola Galeri Siswa & Kalender Akademik</h4>
          <p style="font-size:0.72rem; color:#64748b; margin:2px 0 0 0;">Upload foto Galeri Siswa, kelola agenda Kalender, Edit Visi Misi & E-Library.</p>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px;">
        <button type="button" class="btn-primary" style="background:#f3e8ff; color:#9333ea; border:1px solid #e9d5ff; text-align:left; padding:12px; font-weight:700; font-size:0.78rem; cursor:pointer;" onclick="window.switchAdminTab('galeri')">
          🖼️ Kelola Galeri Siswa
        </button>

        <button type="button" class="btn-primary" style="background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; text-align:left; padding:12px; font-weight:700; font-size:0.78rem; cursor:pointer;" onclick="window.switchAdminTab('kalender')">
          📅 Kelola Kalender
        </button>

        <button type="button" class="btn-primary" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a; text-align:left; padding:12px; font-weight:700; font-size:0.78rem; cursor:pointer;" onclick="window.openAdminContentModal('visiMisi')">
          🎯 Edit Visi & Misi
        </button>

        <button type="button" class="btn-primary" style="background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd; text-align:left; padding:12px; font-weight:700; font-size:0.78rem; cursor:pointer;" onclick="window.switchAdminTab('elibrary')">
          📚 Kelola E-Library
        </button>
      </div>
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
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <h4 style="font-size:0.85rem; font-weight:700; color:#1e293b; margin:0;">Daftar Video (${videos.length})</h4>
        <span style="font-size:0.7rem; color:#64748b;">✋ Drag handle ☰ untuk geser urutan</span>
      </div>
      ${videos.map((v, idx) => `
        <div
          class="list-item-card video-drag-item"
          draggable="true"
          ondragstart="window.handleNewsDragStart(event, ${idx})"
          ondragover="window.handleNewsDragOver(event, ${idx})"
          ondragleave="window.handleNewsDragLeave(event)"
          ondrop="window.handleNewsDrop(event, ${idx})"
          ondragend="window.handleNewsDragEnd(event)"
          style="margin:0 0 8px;"
        >
          <div style="display:flex; align-items:center; gap:8px; flex:1; min-width:0;">
            <span class="drag-handle" title="Tarik untuk memindahkan urutan">☰</span>
            <span style="font-size:0.85rem; font-weight:600; color:#1e293b; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">
              ${v.title}
            </span>
          </div>
          <div class="item-actions">
            <button class="icon-btn-action move-up" onclick="window.moveNewsUp(${idx})" ${idx === 0 ? 'disabled' : ''} title="Pindah ke Atas">▲</button>
            <button class="icon-btn-action move-down" onclick="window.moveNewsDown(${idx})" ${idx === videos.length - 1 ? 'disabled' : ''} title="Pindah ke Bawah">▼</button>
            <button class="icon-btn-action play" onclick="window.playNewsVideoById('${v.id}')" title="Putar Video">▶</button>
            <button class="icon-btn-action edit" onclick="window.editNewsVideoModal('${v.id}')" title="Edit Video">✏️</button>
            <button class="icon-btn-action delete" onclick="window.deleteNews('${v.id}')" title="Hapus Video">🗑️</button>
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
            <button class="icon-btn-action edit" onclick="window.editTeacherModal('${t.id}')" title="Edit Guru">✏️</button>
            <button class="icon-btn-action delete" onclick="window.deleteTeacher('${t.id}', '${(t.name || '').replace(/'/g, "\\'")}')" title="Hapus Guru">🗑️</button>
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
      <h4 style="font-size:0.9rem; font-weight:700; color:#1e293b; margin-bottom:8px;">Daftar Mata Pelajaran (${mapelList.length})</h4>
      ${mapelList.map(m => `
        <div class="list-item-card" style="margin:0 0 8px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.88rem; font-weight:600; color:#1e293b;">📘 ${m.name}</span>
          <div class="item-actions">
            <button class="icon-btn-action edit" onclick="window.editMapelModal('${m.id}')" title="Edit Mapel">✏️</button>
            <button class="icon-btn-action delete" onclick="window.deleteMapel('${m.id}', '${(m.name || '').replace(/'/g, "\\'")}')" title="Hapus Mapel">🗑️</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderSiswa(state) {
  const subView = state.adminSubView.siswa || 'level';
  const mode = state.adminSubView.siswaViewMode || 'menu';

  let viewContent = '';
  if (subView === 'level') {
    viewContent = renderSiswaLevelView(state);
  } else if (subView === 'rooms') {
    viewContent = renderSiswaRoomsView(state);
  } else if (subView === 'daftar' || mode === 'daftar') {
    viewContent = renderSiswaDaftarView(state);
  } else if (subView === 'rekap' || mode === 'rekap') {
    viewContent = renderSiswaRekapView(state);
  } else if (subView === 'nilai' || mode === 'nilai') {
    viewContent = renderSiswaNilaiView(state);
  } else {
    viewContent = renderSiswaMenuView(state);
  }

  return `
    <div class="admin-header">
      <span class="admin-header-title">Admin Panel</span>
      <h2>Siswa</h2>
    </div>

    <div style="padding:16px;">
      ${viewContent}
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
        <button style="background:none; border:none; cursor:pointer; font-size:1.1rem; font-weight:700;" onclick="window.setAdminSiswaSubView('level')">←</button>
        <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin:0;">Ruangan Kelas ${targetLevel}</h4>
      </div>
      <button style="background:none; border:none; color:#0284c7; font-size:1.4rem; cursor:pointer; font-weight:700;" onclick="window.openAdminModal('tambahKelas')">+</button>
    </div>

    <div style="display:flex; flex-direction:column; gap:10px;">
      ${classes.length === 0 ? `
        <div class="content-card text-center" style="padding:20px; color:#94a3b8;">
          Belum ada ruangan kelas untuk Kelas ${targetLevel}.
        </div>
      ` : classes.map(c => {
        const studentCount = (state.students || []).filter(s => (s.class || '').trim().toLowerCase() === c.name.trim().toLowerCase()).length;
        return `
          <div class="content-card" style="margin:0; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="window.setAdminSiswaSubView('menu', ${targetLevel}, '${c.name}', 'menu')">
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="width:36px; height:36px; border-radius:8px; background:#e2e8f0; display:flex; align-items:center; justify-content:center;">🏫</div>
              <div>
                <h5 style="font-size:0.9rem; font-weight:700; color:#1e293b; margin:0;">${c.name}</h5>
                <p style="font-size:0.72rem; color:#64748b; margin:2px 0 0 0;">${studentCount} Peserta Didik Terdaftar</p>
              </div>
            </div>
            <span>›</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderSiswaMenuView(state) {
  const className = state.adminSubView.selectedClass || '10 TKJ 1';

  return `
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:16px;">
      <button style="background:none; border:none; cursor:pointer; font-size:1.1rem; font-weight:700;" onclick="window.setAdminSiswaSubView('rooms')">← Kembali</button>
      <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin:0;">Menu ${className}</h4>
    </div>

    <div style="display:flex; flex-direction:column; gap:10px;">
      <div class="content-card" style="margin:0; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="window.setAdminSiswaSubView('daftar', null, '${className}', 'daftar')">
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:1.2rem;">👥</span>
          <div>
            <span style="font-weight:700; color:#1e293b; font-size:0.88rem; display:block;">Daftar Siswa</span>
            <span style="font-size:0.72rem; color:#64748b;">Kelola, tambah, edit, dan hapus data siswa</span>
          </div>
        </div>
        <span>›</span>
      </div>

      <div class="content-card" style="margin:0; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="window.setAdminSiswaSubView('rekap', null, '${className}', 'rekap')">
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:1.2rem;">☑️</span>
          <div>
            <span style="font-weight:700; color:#1e293b; font-size:0.88rem; display:block;">Rekap Absensi</span>
            <span style="font-size:0.72rem; color:#64748b;">Lihat kehadiran Hadir/Sakit/Izin/Alpa</span>
          </div>
        </div>
        <span>›</span>
      </div>

      <div class="content-card" style="margin:0; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="window.setAdminSiswaSubView('nilai', null, '${className}', 'nilai')">
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:1.2rem;">📊</span>
          <div>
            <span style="font-weight:700; color:#1e293b; font-size:0.88rem; display:block;">Nilai Akademik</span>
            <span style="font-size:0.72rem; color:#64748b;">Lihat rekapitulasi nilai siswa per mapel</span>
          </div>
        </div>
        <span>›</span>
      </div>
    </div>
  `;
}

function renderSiswaDaftarView(state) {
  const className = state.adminSubView.selectedClass || '10 TKJ 1';
  const students = (state.students || []).filter(s => (s.class || '10 TKJ 1').trim().toLowerCase() === className.trim().toLowerCase());

  return `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <div style="display:flex; align-items:center; gap:8px;">
        <button style="background:none; border:none; cursor:pointer; font-size:1.1rem; font-weight:700;" onclick="window.setAdminSiswaSubView('menu', null, '${className}', 'menu')">←</button>
        <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin:0;">Daftar Siswa - ${className}</h4>
      </div>
      <button class="btn-add-primary" onclick="window.addStudentModal('${className}')">+ Tambah Siswa</button>
    </div>

    <div style="margin-bottom:12px;">
      <input type="text" class="form-input" placeholder="🔍 Cari nama atau NIS siswa..." oninput="window.handleSearchAdminSiswa(this.value, 'adminDaftarSiswaContainer')" />
    </div>

    <div id="adminDaftarSiswaContainer" style="display:flex; flex-direction:column; gap:8px;">
      ${students.length === 0 ? `
        <div class="content-card text-center" style="padding:20px; color:#94a3b8;">
          Belum ada siswa di kelas ${className}. Klik + Tambah Siswa untuk menambahkan.
        </div>
      ` : students.map((s, idx) => `
        <div class="list-item-card searchable-siswa-item" data-search="${(s.name + ' ' + (s.nis || '')).replace(/"/g, '&quot;')}" style="margin:0;">
          <div class="list-item-left">
            <div class="list-item-avatar" style="background:#e0f2fe; color:#0369a1; font-weight:700; font-size:0.8rem;">
              ${idx + 1}
            </div>
            <div>
              <h4 style="font-size:0.9rem; font-weight:700; color:#1e293b; margin:0;">${s.name}</h4>
              <p style="font-size:0.75rem; color:#64748b; margin:2px 0 0 0;">NIS: ${s.nis || '-'}</p>
            </div>
          </div>
          <div class="item-actions">
            <button class="icon-btn-action edit" onclick="window.editStudentModal('${s.id}')" title="Edit Siswa">✏️</button>
            <button class="icon-btn-action delete" onclick="window.deleteStudent('${s.id}', '${(s.name || '').replace(/'/g, "\\'")}')" title="Hapus Siswa">🗑️</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderSiswaRekapView(state) {
  const className = state.adminSubView.selectedClass || '10 TKJ 1';
  const students = (state.students || []).filter(s => (s.class || '10 TKJ 1').trim().toLowerCase() === className.trim().toLowerCase());
  const attendanceSessions = (state.attendance || []).filter(a => (a.class || '10 TKJ 1').trim().toLowerCase() === className.trim().toLowerCase());

  const studentStats = students.map(s => {
    let hadir = 0, sakit = 0, izin = 0, alpa = 0;
    attendanceSessions.forEach(sess => {
      if (sess.records) {
        const st = sess.records[s.id] || sess.records[s.nis];
        if (st === 'H' || st === 'Hadir') hadir++;
        else if (st === 'S' || st === 'Sakit') sakit++;
        else if (st === 'I' || st === 'Izin') izin++;
        else if (st === 'A' || st === 'Alpa' || st === 'Alpha') alpa++;
      }
    });
    return { ...s, hadir, sakit, izin, alpa };
  });

  return `
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
      <button style="background:none; border:none; cursor:pointer; font-size:1.1rem; font-weight:700;" onclick="window.setAdminSiswaSubView('menu', null, '${className}', 'menu')">←</button>
      <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin:0;">Rekap Absensi - ${className}</h4>
    </div>

    <div class="content-card" style="padding:12px; margin-bottom:12px; background:#f8fafc;">
      <div style="font-size:0.75rem; color:#64748b;">Total Sesi Presensi Tercatat: <b>${attendanceSessions.length} sesi</b></div>
    </div>

    <div style="margin-bottom:12px;">
      <input type="text" class="form-input" placeholder="🔍 Cari nama siswa di rekap absensi..." oninput="window.handleSearchAdminSiswa(this.value, 'adminRekapSiswaContainer')" />
    </div>

    <div id="adminRekapSiswaContainer" style="display:flex; flex-direction:column; gap:8px;">
      ${studentStats.length === 0 ? `
        <div class="content-card text-center" style="padding:20px; color:#94a3b8;">
          Belum ada data siswa di kelas ${className}.
        </div>
      ` : studentStats.map((s, idx) => `
        <div class="content-card searchable-siswa-item" data-search="${(s.name + ' ' + (s.nis || '')).replace(/"/g, '&quot;')}" style="margin:0; padding:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h5 style="font-size:0.88rem; font-weight:700; color:#1e293b; margin:0;">${idx + 1}. ${s.name}</h5>
              <p style="font-size:0.72rem; color:#64748b; margin:2px 0 0 0;">NIS: ${s.nis || '-'}</p>
            </div>
            <div style="display:flex; gap:6px;">
              <span style="background:#dcfce7; color:#166534; font-weight:700; font-size:0.72rem; padding:4px 8px; border-radius:6px;" title="Hadir">H: ${s.hadir}</span>
              <span style="background:#fef9c3; color:#854d0e; font-weight:700; font-size:0.72rem; padding:4px 8px; border-radius:6px;" title="Sakit">S: ${s.sakit}</span>
              <span style="background:#e0f2fe; color:#075985; font-weight:700; font-size:0.72rem; padding:4px 8px; border-radius:6px;" title="Izin">I: ${s.izin}</span>
              <span style="background:#fee2e2; color:#991b1b; font-weight:700; font-size:0.72rem; padding:4px 8px; border-radius:6px;" title="Alpa">A: ${s.alpa}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderSiswaNilaiView(state) {
  const className = state.adminSubView.selectedClass || '10 TKJ 1';
  const students = (state.students || []).filter(s => (s.class || '10 TKJ 1').trim().toLowerCase() === className.trim().toLowerCase());
  const grades = (state.grades || []).filter(g => (g.class || '10 TKJ 1').trim().toLowerCase() === className.trim().toLowerCase());

  const studentScores = students.map(s => {
    const sGrades = [];
    grades.forEach(g => {
      if (g.scores) {
        const val = g.scores[s.id] !== undefined ? g.scores[s.id] : g.scores[s.nis];
        if (val !== undefined) sGrades.push({ mapel: g.mapel, score: val });
      }
    });
    const avg = sGrades.length > 0 ? (sGrades.reduce((sum, item) => sum + Number(item.score || 0), 0) / sGrades.length).toFixed(1) : '-';
    return { ...s, gradesCount: sGrades.length, avg };
  });

  return `
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
      <button style="background:none; border:none; cursor:pointer; font-size:1.1rem; font-weight:700;" onclick="window.setAdminSiswaSubView('menu', null, '${className}', 'menu')">←</button>
      <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin:0;">Nilai Akademik - ${className}</h4>
    </div>

    <div style="margin-bottom:12px;">
      <input type="text" class="form-input" placeholder="🔍 Cari nama siswa di nilai akademik..." oninput="window.handleSearchAdminSiswa(this.value, 'adminNilaiSiswaContainer')" />
    </div>

    <div id="adminNilaiSiswaContainer" style="display:flex; flex-direction:column; gap:8px;">
      ${studentScores.length === 0 ? `
        <div class="content-card text-center" style="padding:20px; color:#94a3b8;">
          Belum ada data siswa di kelas ${className}.
        </div>
      ` : studentScores.map((s, idx) => `
        <div class="content-card searchable-siswa-item" data-search="${(s.name + ' ' + (s.nis || '')).replace(/"/g, '&quot;')}" style="margin:0; padding:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h5 style="font-size:0.88rem; font-weight:700; color:#1e293b; margin:0;">${idx + 1}. ${s.name}</h5>
              <p style="font-size:0.72rem; color:#64748b; margin:2px 0 0 0;">NIS: ${s.nis || '-'} | ${s.gradesCount} Nilai Tugas/Ujian</p>
            </div>
            <div style="background:#e0f2fe; color:#0284c7; font-weight:800; font-size:0.9rem; padding:6px 12px; border-radius:8px;">
              Rata: ${s.avg}
            </div>
          </div>
        </div>
      `).join('')}
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
        <button style="background:none; border:none; cursor:pointer; font-size:1.1rem; font-weight:700;" onclick="window.setAdminJadwalSubView('level')">←</button>
        <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin:0;">Jadwal Kelas ${targetLevel}</h4>
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
          <div style="display:flex; gap:6px;">
            <button class="icon-btn-action edit" onclick="window.editScheduleModal('${s.id}')" title="Edit Jadwal">✏️</button>
            <button class="icon-btn-action delete" onclick="window.deleteSchedule('${s.id}', '${(s.mapel || '').replace(/'/g, "\\'")}')" title="Hapus Jadwal">🗑️</button>
          </div>
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
    </div>

    <!-- Kelola Konten Academic Hub (Admin) -->
    <div class="content-card mt-4">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
        <span style="font-size:1.4rem;">🛠️</span>
        <div>
          <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin:0;">Kelola Konten Academic Hub (Admin)</h4>
          <p style="font-size:0.72rem; color:#64748b; margin:2px 0 0 0;">Edit Visi Misi, Tambah Gambar Galeri, Edit Kalender, & E-Library.</p>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px;">
        <button type="button" class="btn-primary" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a; text-align:left; padding:12px; font-weight:700; font-size:0.78rem;" onclick="window.openAdminContentModal('visiMisi')">
          🎯 Edit Visi & Misi
        </button>

        <button type="button" class="btn-primary" style="background:#f3e8ff; color:#9333ea; border:1px solid #e9d5ff; text-align:left; padding:12px; font-weight:700; font-size:0.78rem;" onclick="window.switchAdminTab('galeri')">
          🖼️ Kelola Galeri Siswa
        </button>

        <button type="button" class="btn-primary" style="background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; text-align:left; padding:12px; font-weight:700; font-size:0.78rem;" onclick="window.switchAdminTab('kalender')">
          📅 Kelola Kalender
        </button>

        <button type="button" class="btn-primary" style="background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd; text-align:left; padding:12px; font-weight:700; font-size:0.78rem;" onclick="window.switchAdminTab('elibrary')">
          📚 Kelola E-Library
        </button>
      </div>
    </div>

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

function renderGaleriAdmin(state) {
  const items = state.galeriItems || [];
  return `
    <div class="admin-header">
      <div style="display:flex; align-items:center; gap:10px;">
        <button type="button" style="background:rgba(255,255,255,0.2); border:none; color:white; padding:6px 12px; border-radius:8px; font-weight:700; cursor:pointer; font-size:0.85rem;" onclick="window.switchAdminTab('home')">← Kembali</button>
        <div>
          <span class="admin-header-title">Admin Panel</span>
          <h2 style="margin:0; font-size:1.25rem;">Kelola Galeri Siswa</h2>
        </div>
      </div>
    </div>

    <div class="content-card mt-4">
      <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin-bottom:12px;">🖼️ Tambah Foto Galeri Baru</h4>
      
      <form onsubmit="window.handleAddGaleriSubmit(event)">
        <div class="form-group">
          <label class="form-label">📁 Pilih File Gambar dari Perangkat (HP / Komputer)</label>
          <input type="file" id="gFileInput" accept="image/*" class="form-input" onchange="window.handleGaleriFileSelect(event)" style="padding:6px 10px;" />
          <div id="gUploadStatus" style="display:none; font-size:0.75rem; margin-top:4px;"></div>
        </div>

        <div class="form-group">
          <label class="form-label">Judul Foto / Kegiatan</label>
          <input type="text" id="gTitle" class="form-input" placeholder="Judul Foto / Kegiatan" required />
        </div>
        <div class="form-group">
          <label class="form-label">Kategori (Badge)</label>
          <input type="text" id="gCategory" class="form-input" placeholder="Kategori (contoh: 🏆 PRESTASI, 🛠️ PRAKTIKUM)" required />
        </div>
        <div class="form-group">
          <label class="form-label">URL Gambar / Link Foto</label>
          <input type="text" id="gUrl" class="form-input" placeholder="Otomatis terisi saat memilih file atau tempel link (https://...)" required />
          <img id="gPreviewImg" src="" style="display:none; width:100%; height:140px; object-fit:cover; border-radius:10px; margin-top:8px; border:1px solid #e2e8f0;" />
        </div>
        <div class="form-group">
          <label class="form-label">Keterangan Singkat</label>
          <input type="text" id="gSub" class="form-input" placeholder="Keterangan singkat kegiatan" />
        </div>
        <button type="submit" class="btn-primary" style="width:100%; font-weight:700; background:#9333ea; border:none; padding:12px; cursor:pointer;">+ Simpan Ke Galeri Siswa</button>
      </form>
    </div>

    <div style="padding:0 16px 24px;">
      <h4 style="font-size:0.9rem; font-weight:700; color:#1e293b; margin-bottom:10px;">Daftar Gambar Terdaftar (${items.length})</h4>
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${items.length === 0 ? `
          <div class="content-card text-center" style="padding:20px; color:#94a3b8;">Belum ada foto galeri terdaftar.</div>
        ` : items.map(g => `
          <div class="list-item-card" style="margin:0; display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:12px; overflow:hidden;">
              <img src="${g.imageUrl}" style="width:48px; height:48px; object-fit:cover; border-radius:8px; flex-shrink:0; border:1px solid #e2e8f0;" />
              <div style="min-width:0;">
                <span style="font-size:0.68rem; font-weight:800; color:#9333ea; background:#f3e8ff; padding:2px 6px; border-radius:4px; display:inline-block; margin-bottom:2px;">${g.category || 'GALERI'}</span>
                <h5 style="font-size:0.85rem; font-weight:700; color:#1e293b; margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${g.title}</h5>
                ${g.subtitle ? `<p style="font-size:0.72rem; color:#64748b; margin:2px 0 0 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${g.subtitle}</p>` : ''}
              </div>
            </div>
            <button type="button" class="icon-btn-action delete" onclick="if(confirm('Hapus foto galeri ini?')){ store.deleteGaleriItem('${g.id}'); window.showToast('Foto galeri dihapus', 'info'); }" title="Hapus Gambar">🗑️</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderKalenderAdmin(state) {
  const agendas = state.kalenderAgendas || [];
  return `
    <div class="admin-header">
      <div style="display:flex; align-items:center; gap:10px;">
        <button type="button" style="background:rgba(255,255,255,0.2); border:none; color:white; padding:6px 12px; border-radius:8px; font-weight:700; cursor:pointer; font-size:0.85rem;" onclick="window.switchAdminTab('home')">← Kembali</button>
        <div>
          <span class="admin-header-title">Admin Panel</span>
          <h2 style="margin:0; font-size:1.25rem;">Kelola Kalender Akademik</h2>
        </div>
      </div>
    </div>

    <div class="content-card mt-4">
      <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin-bottom:12px;">📅 Tambah Agenda Sekolah Baru</h4>
      <form onsubmit="window.handleAddAgendaSubmit(event)">
        <div class="form-group">
          <label class="form-label">Rentang Tanggal</label>
          <input type="text" id="aDate" class="form-input" placeholder="Contoh: 15 - 20 September 2026" required />
        </div>
        <div class="form-group">
          <label class="form-label">Tag Label / Jenis Agenda</label>
          <input type="text" id="aTag" class="form-input" placeholder="Contoh: PTS, Simulasi UKK, Libur" required />
        </div>
        <div class="form-group">
          <label class="form-label">Judul Agenda / Kegiatan</label>
          <input type="text" id="aTitle" class="form-input" placeholder="Judul Agenda / Kegiatan" required />
        </div>
        <div class="form-group">
          <label class="form-label">Deskripsi / Catatan Agenda</label>
          <textarea id="aDesc" class="form-input" rows="3" placeholder="Deskripsi singkat kegiatan"></textarea>
        </div>
        <button type="submit" class="btn-primary" style="width:100%; font-weight:700; background:#dc2626; border:none; padding:12px; cursor:pointer;">+ Tambah Agenda Kalender</button>
      </form>
    </div>

    <div style="padding:0 16px 24px;">
      <h4 style="font-size:0.9rem; font-weight:700; color:#1e293b; margin-bottom:10px;">Agenda Terdaftar (${agendas.length})</h4>
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${agendas.length === 0 ? `
          <div class="content-card text-center" style="padding:20px; color:#94a3b8;">Belum ada agenda kalender terdaftar.</div>
        ` : agendas.map(a => `
          <div class="list-item-card" style="margin:0; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                <span style="font-size:0.7rem; font-weight:700; color:#dc2626; background:#fee2e2; padding:2px 8px; border-radius:4px;">${a.date}</span>
                <span style="font-size:0.68rem; font-weight:700; color:#0284c7; background:#e0f2fe; padding:2px 6px; border-radius:4px;">${a.tag}</span>
              </div>
              <h5 style="font-size:0.88rem; font-weight:700; color:#1e293b; margin:0;">${a.title}</h5>
              ${a.desc ? `<p style="font-size:0.73rem; color:#64748b; margin:2px 0 0 0;">${a.desc}</p>` : ''}
            </div>
            <button type="button" class="icon-btn-action delete" onclick="if(confirm('Hapus agenda kalender ini?')){ store.deleteKalenderAgenda('${a.id}'); window.showToast('Agenda dihapus', 'info'); }" title="Hapus Agenda">🗑️</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderElibraryAdmin(state) {
  const books = state.elibraryBooks || [];
  return `
    <div class="admin-header">
      <div style="display:flex; align-items:center; gap:10px;">
        <button type="button" style="background:rgba(255,255,255,0.2); border:none; color:white; padding:6px 12px; border-radius:8px; font-weight:700; cursor:pointer; font-size:0.85rem;" onclick="window.switchAdminTab('home')">← Kembali</button>
        <div>
          <span class="admin-header-title">Admin Panel</span>
          <h2 style="margin:0; font-size:1.25rem;">Kelola E-Library</h2>
        </div>
      </div>
    </div>

    <div class="content-card mt-4">
      <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin-bottom:12px;">📚 Tambah Buku Digital Baru</h4>
      <form onsubmit="window.handleAddBookSubmit(event)">
        <div class="form-group">
          <label class="form-label">Judul Buku Digital</label>
          <input type="text" id="bTitle" class="form-input" placeholder="Judul Buku Digital" required />
        </div>
        <div class="form-group">
          <label class="form-label">Kategori / Topik</label>
          <input type="text" id="bCat" class="form-input" placeholder="Contoh: Jaringan Komputer, Keamanan Siber, Server" required />
        </div>
        <div class="form-group">
          <label class="form-label">Deskripsi Singkat Buku</label>
          <textarea id="bDesc" class="form-input" rows="3" placeholder="Deskripsi singkat isi buku digital" required></textarea>
        </div>
        <button type="submit" class="btn-primary" style="width:100%; font-weight:700; background:#0369a1; border:none; padding:12px; cursor:pointer;">+ Tambah Buku Digital</button>
      </form>
    </div>

    <div style="padding:0 16px 24px;">
      <h4 style="font-size:0.9rem; font-weight:700; color:#1e293b; margin-bottom:10px;">Daftar Buku Digital (${books.length})</h4>
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${books.length === 0 ? `
          <div class="content-card text-center" style="padding:20px; color:#94a3b8;">Belum ada buku digital terdaftar.</div>
        ` : books.map(b => `
          <div class="list-item-card" style="margin:0; display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="width:40px; height:40px; border-radius:8px; background:#e0f2fe; color:#0369a1; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0;">
                ${b.icon || '📘'}
              </div>
              <div>
                <span style="font-size:0.68rem; font-weight:700; color:#0369a1; background:#e0f2fe; padding:2px 6px; border-radius:4px;">${b.category || 'BUKU'}</span>
                <h5 style="font-size:0.88rem; font-weight:700; color:#1e293b; margin:2px 0 0 0;">${b.title}</h5>
                ${b.desc ? `<p style="font-size:0.72rem; color:#64748b; margin:2px 0 0 0;">${b.desc}</p>` : ''}
              </div>
            </div>
            <button type="button" class="icon-btn-action delete" onclick="if(confirm('Hapus buku digital ini?')){ store.deleteElibraryBook('${b.id}'); window.showToast('Buku dihapus', 'info'); }" title="Hapus Buku">🗑️</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

window.openAdminContentModal = function(type) {
  const overlay = document.getElementById('globalModal');
  const card = document.getElementById('modalCardContent');
  const state = store.state;

  if (type === 'visiMisi') {
    const vm = state.visiMisi || {};
    card.innerHTML = `
      <div class="modal-title">🎯 Edit Visi & Misi TKJ</div>
      <form onsubmit="window.handleSaveVisiMisi(event)">
        <div class="form-group">
          <label class="form-label">Visi TKJ</label>
          <textarea id="editVisiText" class="form-input" rows="3" required>${vm.visi || ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Misi (1 Per Baris)</label>
          <textarea id="editMisiText" class="form-input" rows="4" required>${(vm.misi || []).join('\n')}</textarea>
        </div>
        <div style="display:flex; gap:10px; margin-top:14px;">
          <button type="button" class="btn-primary" style="flex:1; background:#64748b;" onclick="window.closeModal()">Batal</button>
          <button type="submit" class="btn-primary" style="flex:1;">Simpan Visi & Misi</button>
        </div>
      </form>
    `;
  } else if (type === 'galeri') {
    const items = state.galeriItems || [];
    card.innerHTML = `
      <div class="modal-title">🖼️ Kelola Galeri Siswa</div>
      <form onsubmit="window.handleAddGaleriSubmit(event)" style="margin-bottom:16px;">
        <div style="font-size:0.82rem; font-weight:700; color:#1e293b; margin-bottom:6px;">+ Tambah Foto Galeri Baru</div>
        <div class="form-group">
          <label class="form-label">📁 Pilih File Gambar dari Perangkat</label>
          <input type="file" id="gFileInput" accept="image/*" class="form-input" onchange="window.handleGaleriFileSelect(event)" style="padding:6px 10px;" />
          <div id="gUploadStatus" style="display:none; font-size:0.75rem; margin-top:4px;"></div>
        </div>

        <div class="form-group">
          <label class="form-label">Judul Foto / Kegiatan</label>
          <input type="text" id="gTitle" class="form-input" placeholder="Judul Foto / Kegiatan" required />
        </div>
        <div class="form-group">
          <label class="form-label">Kategori (Badge)</label>
          <input type="text" id="gCategory" class="form-input" placeholder="Kategori (contoh: 🏆 PRESTASI, 🛠️ PRAKTIKUM)" required />
        </div>
        <div class="form-group">
          <label class="form-label">URL Gambar / Link Foto</label>
          <input type="text" id="gUrl" class="form-input" placeholder="Otomatis terisi saat memilih file atau tempel link (https://...)" required />
          <img id="gPreviewImg" src="" style="display:none; width:100%; height:120px; object-fit:cover; border-radius:10px; margin-top:8px; border:1px solid #e2e8f0;" />
        </div>
        <div class="form-group">
          <label class="form-label">Keterangan Singkat</label>
          <input type="text" id="gSub" class="form-input" placeholder="Keterangan singkat" />
        </div>
        <button type="submit" class="btn-primary" style="width:100%; font-weight:700;">+ Simpan Ke Galeri Siswa</button>
      </form>

      <div style="font-size:0.82rem; font-weight:700; color:#1e293b; margin-bottom:8px;">Daftar Gambar (${items.length}):</div>
      <div style="max-height:200px; overflow-y:auto; display:flex; flex-direction:column; gap:8px;">
        ${items.map(g => `
          <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; padding:8px 12px; border-radius:8px;">
            <div style="display:flex; align-items:center; gap:8px; overflow:hidden;">
              <img src="${g.imageUrl}" style="width:36px; height:36px; object-fit:cover; border-radius:6px; flex-shrink:0;" />
              <span style="font-size:0.8rem; font-weight:600; color:#1e293b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${g.title}</span>
            </div>
            <button type="button" class="icon-btn-action delete" onclick="store.deleteGaleriItem('${g.id}'); window.showToast('Gambar dihapus', 'info');">🗑️</button>
          </div>
        `).join('')}
      </div>
      <button type="button" class="btn-primary" style="width:100%; margin-top:14px; background:#64748b;" onclick="window.closeModal()">Selesai</button>
    `;
  } else if (type === 'kalender') {
    const agendas = state.kalenderAgendas || [];
    card.innerHTML = `
      <div class="modal-title">📅 Kelola Kalender & Agenda</div>
      <form onsubmit="window.handleAddAgendaSubmit(event)" style="margin-bottom:16px;">
        <div style="font-size:0.82rem; font-weight:700; color:#1e293b; margin-bottom:8px;">+ Tambah Agenda Sekolah Baru</div>
        <div class="form-group">
          <input type="text" id="aDate" class="form-input" placeholder="Rentang Tanggal (misal: 15 - 20 September 2026)" required />
        </div>
        <div class="form-group">
          <input type="text" id="aTag" class="form-input" placeholder="Tag Label (misal: PTS, UKK, PAS)" required />
        </div>
        <div class="form-group">
          <input type="text" id="aTitle" class="form-input" placeholder="Judul Agenda / Kegiatan" required />
        </div>
        <div class="form-group">
          <textarea id="aDesc" class="form-input" rows="2" placeholder="Deskripsi / Catatan Lorem Ipsum"></textarea>
        </div>
        <button type="submit" class="btn-primary" style="width:100%;">+ Tambah Agenda Kalender</button>
      </form>

      <div style="font-size:0.82rem; font-weight:700; color:#1e293b; margin-bottom:8px;">Agenda Terdaftar (${agendas.length}):</div>
      <div style="max-height:200px; overflow-y:auto; display:flex; flex-direction:column; gap:8px;">
        ${agendas.map(a => `
          <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; padding:8px 12px; border-radius:8px;">
            <div>
              <span style="font-size:0.7rem; font-weight:700; color:#0284c7;">${a.date} (${a.tag})</span>
              <div style="font-size:0.8rem; font-weight:600; color:#1e293b;">${a.title}</div>
            </div>
            <button type="button" class="icon-btn-action delete" onclick="store.deleteKalenderAgenda('${a.id}'); window.showToast('Agenda dihapus', 'info');">🗑️</button>
          </div>
        `).join('')}
      </div>
      <button type="button" class="btn-primary" style="width:100%; margin-top:14px; background:#64748b;" onclick="window.closeModal()">Selesai</button>
    `;
  } else if (type === 'elibrary') {
    const books = state.elibraryBooks || [];
    card.innerHTML = `
      <div class="modal-title">📚 Kelola E-Library & Buku Digital</div>
      <form onsubmit="window.handleAddBookSubmit(event)" style="margin-bottom:16px;">
        <div style="font-size:0.82rem; font-weight:700; color:#1e293b; margin-bottom:8px;">+ Tambah Buku Digital Baru</div>
        <div class="form-group">
          <input type="text" id="bTitle" class="form-input" placeholder="Judul Buku Digital" required />
        </div>
        <div class="form-group">
          <input type="text" id="bCat" class="form-input" placeholder="Kategori / Topik" required />
        </div>
        <div class="form-group">
          <input type="text" id="bDesc" class="form-input" placeholder="Deskripsi Singkat Buku" required />
        </div>
        <button type="submit" class="btn-primary" style="width:100%;">+ Tambah Buku Digital</button>
      </form>

      <div style="font-size:0.82rem; font-weight:700; color:#1e293b; margin-bottom:8px;">Buku Digital (${books.length}):</div>
      <div style="max-height:200px; overflow-y:auto; display:flex; flex-direction:column; gap:8px;">
        ${books.map(b => `
          <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; padding:8px 12px; border-radius:8px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span>${b.icon || '📘'}</span>
              <span style="font-size:0.8rem; font-weight:600; color:#1e293b;">${b.title}</span>
            </div>
            <button type="button" class="icon-btn-action delete" onclick="store.deleteElibraryBook('${b.id}'); window.showToast('Buku dihapus', 'info');">🗑️</button>
          </div>
        `).join('')}
      </div>
      <button type="button" class="btn-primary" style="width:100%; margin-top:14px; background:#64748b;" onclick="window.closeModal()">Selesai</button>
    `;
  }

  overlay.classList.add('open');
};

window.handleSaveVisiMisi = function(e) {
  e.preventDefault();
  const visi = document.getElementById('editVisiText').value.trim();
  const misiRaw = document.getElementById('editMisiText').value.trim();
  const misi = misiRaw.split('\n').map(m => m.trim()).filter(Boolean);
  store.updateVisiMisi(visi, misi);
  window.showToast('🎯 Visi & Misi berhasil diperbarui!', 'success');
  window.closeModal();
};

window.handleAddGaleriSubmit = function(e) {
  e.preventDefault();
  const form = e.target;
  const title = document.getElementById('gTitle')?.value.trim();
  const category = document.getElementById('gCategory')?.value.trim();
  const imageUrl = document.getElementById('gUrl')?.value.trim();
  const subtitle = document.getElementById('gSub')?.value.trim();

  if (!title || !category || !imageUrl) {
    window.showToast('Mohon lengkapi Judul, Kategori, dan File/URL Gambar!', 'error');
    return;
  }

  store.addGaleriItem({ title, category, imageUrl, subtitle });
  window.showToast('🖼️ Foto galeri berhasil ditambahkan!', 'success');

  if (form) form.reset();
  const previewImg = document.getElementById('gPreviewImg');
  if (previewImg) previewImg.style.display = 'none';
  const statusEl = document.getElementById('gUploadStatus');
  if (statusEl) statusEl.style.display = 'none';
  window.closeModal();
};

window.handleAddAgendaSubmit = function(e) {
  e.preventDefault();
  const form = e.target;
  const date = document.getElementById('aDate')?.value.trim();
  const tag = document.getElementById('aTag')?.value.trim();
  const title = document.getElementById('aTitle')?.value.trim();
  const desc = document.getElementById('aDesc')?.value.trim();

  if (!date || !tag || !title) {
    window.showToast('Mohon lengkapi Tanggal, Tag Label, dan Judul Agenda!', 'error');
    return;
  }

  store.addKalenderAgenda({ date, tag, title, desc });
  window.showToast('📅 Agenda kalender berhasil ditambahkan!', 'success');

  if (form) form.reset();
  window.closeModal();
};

window.handleAddBookSubmit = function(e) {
  e.preventDefault();
  const form = e.target;
  const title = document.getElementById('bTitle')?.value.trim();
  const category = document.getElementById('bCat')?.value.trim();
  const desc = document.getElementById('bDesc')?.value.trim();

  if (!title || !category) {
    window.showToast('Mohon lengkapi Judul Buku dan Kategori!', 'error');
    return;
  }

  store.addElibraryBook({ title, category, desc });
  window.showToast('📚 Buku digital berhasil ditambahkan!', 'success');

  if (form) form.reset();
  window.closeModal();
};

window.handleGaleriFileSelect = function(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const statusEl = document.getElementById('gUploadStatus');
  const urlInput = document.getElementById('gUrl');
  const previewImg = document.getElementById('gPreviewImg');

  const reader = new FileReader();
  reader.onload = function(evt) {
    const rawDataUrl = evt.target.result;
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxDim = 800;
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);

      if (urlInput) urlInput.value = compressedDataUrl;
      if (previewImg) {
        previewImg.src = compressedDataUrl;
        previewImg.style.display = 'block';
      }
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.style.color = '#10b981';
        statusEl.textContent = '✅ Gambar berhasil dimuat dan dioptimasi!';
      }
      if (typeof window.showToast === 'function') {
        window.showToast('🖼️ Gambar berhasil dioptimasi!', 'success');
      }
    };
    img.src = rawDataUrl;
  };
  reader.readAsDataURL(file);
};

window.handleCloudinaryFileSelect = window.handleGaleriFileSelect;

window.handleSearchAdminSiswa = function(val, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const query = (val || '').toLowerCase().trim();
  const items = container.querySelectorAll('.searchable-siswa-item');
  items.forEach(card => {
    const searchData = (card.getAttribute('data-search') || card.textContent).toLowerCase();
    const matches = searchData.includes(query);
    card.style.display = matches ? (card.classList.contains('list-item-card') ? 'flex' : 'block') : 'none';
  });
};


