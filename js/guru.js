/* Guru View Renderer */

import { store } from './state.js';
import { getYouTubeDetails } from './firebase.js';

export function renderGuruScreen(state) {
  const activeTab = state.activeTabs.guru || 'beranda';

  let contentHtml = '';
  switch (activeTab) {
    case 'beranda':
      contentHtml = renderBeranda(state);
      break;
    case 'absensi':
      contentHtml = renderAbsensi(state);
      break;
    case 'nilai':
      contentHtml = renderNilai(state);
      break;
    case 'profil':
      contentHtml = renderProfil(state);
      break;
    default:
      contentHtml = renderBeranda(state);
  }

  const bottomNavHtml = `
    <nav class="phone-bottom-nav">
      <button class="nav-item ${activeTab === 'beranda' ? 'active' : ''}" data-tab="beranda">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 00-1 1m-6 0h6"/></svg>
        </div>
        <span>Beranda</span>
      </button>

      <button class="nav-item ${activeTab === 'absensi' ? 'active' : ''}" data-tab="absensi">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <span>Absensi</span>
      </button>

      <button class="nav-item ${activeTab === 'nilai' ? 'active' : ''}" data-tab="nilai">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        </div>
        <span>Nilai</span>
      </button>

      <button class="nav-item ${activeTab === 'profil' ? 'active' : ''}" data-tab="profil">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </div>
        <span>Profil</span>
      </button>
    </nav>
  `;

  return { contentHtml, bottomNavHtml };
}

function renderBeranda(state) {
  const teacher = state.currentUser.guru;
  const newsList = state.broadcastNews || [];

  return `
    <div class="guru-header">
      <p style="font-size:0.75rem; opacity:0.85;">Selamat Datang,</p>
      <h2>${teacher.name}</h2>
      <p>Dashboard Pengajar Terpadu</p>
    </div>

    <div style="padding:16px;">
      <!-- Teaching Stats Cards -->
      <div class="stat-cards-grid" style="padding:0 0 14px;">
        <div class="stat-card" onclick="window.showToast('Jam Mengajar: 18 Jam / Minggu', 'info')">
          <div class="class-label">Jam Ajar</div>
          <div class="class-num">18</div>
          <div class="class-sub">Jam / Minggu</div>
        </div>
        <div class="stat-card" onclick="window.showToast('Tingkat Kehadiran Kelas Rata-rata 96%', 'info')">
          <div class="class-label">Kehadiran</div>
          <div class="class-num" style="color:#10b981;">96%</div>
          <div class="class-sub">Rata-rata</div>
        </div>
        <div class="stat-card" onclick="window.showToast('Total Siswa diampu: ' + store.state.students.length, 'info')">
          <div class="class-label">Siswa Aktif</div>
          <div class="class-num">${state.students.length}</div>
          <div class="class-sub">10 TKJ 1</div>
        </div>
      </div>

      <div class="section-title" style="margin:0 0 10px;">Jadwal Mengajar Hari Ini</div>
      <div class="content-card" style="padding:16px; border:1px solid #d4e3f0; background:linear-gradient(135deg, #f8fbff, #eef6fc);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <span class="badge-tag badge-blue">Aktif Sekarang</span>
            <h4 style="font-size:1.05rem; font-weight:800; color:#0b345e; margin-top:6px;">Matematika (MTK)</h4>
            <p style="font-size:0.78rem; color:#475569; margin-top:3px;">Kelas: 10 TKJ 1 • Ruang Lab Jaringan</p>
            <p style="font-size:0.78rem; color:#0284c7; font-weight:700; margin-top:6px;">⏰ 07:30 - 11:30 WIB</p>
          </div>
          <button class="btn-primary" style="width:auto; padding:8px 14px; font-size:0.75rem;" onclick="window.setGuruSubTab('absensi', 'input'); store.setRoleTab('guru', 'absensi');">
            Buka Absensi ➔
          </button>
        </div>
      </div>

      <!-- TKJ News Section for Guru -->
      <div style="margin-top:20px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <div class="section-title" style="margin:0;">TKJ News & Pengumuman</div>
          <span style="font-size:0.75rem; color:#0284c7; font-weight:700;">${newsList.length} Video</span>
        </div>
        ${newsList.length === 0 ? `
          <div class="content-card text-center" style="color:#64748b; padding:20px 14px;">
            <p style="font-size:0.8rem; margin:0;">Belum ada berita TKJ disiarkan.</p>
          </div>
        ` : `
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
        `}
      </div>

      <div class="section-title" style="margin:16px 0 10px;">Mata Pelajaran Diampu</div>
      <div class="content-card" style="display:flex; align-items:center; gap:14px; padding:14px 18px;">
        <div style="width:42px; height:42px; border-radius:12px; background:#dbeafe; color:#1e40af; display:flex; align-items:center; justify-content:center; font-size:1.3rem;">
          📘
        </div>
        <div style="flex:1;">
          <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b;">${teacher.mapel}</h4>
          <p style="font-size:0.75rem; color:#64748b;">Pengajar Utama • Kurikulum Merdeka</p>
        </div>
        <span class="badge-tag badge-green">Aktif</span>
      </div>
    </div>
  `;
}

function renderAbsensi(state) {
  const teacher = state.currentUser.guru;
  const subTab = state.guruSubTab.absensi || 'input';

  return `
    <div class="guru-header">
      <p style="font-size:0.75rem; opacity:0.85;">Selamat Datang,</p>
      <h2>${teacher.name}</h2>
      <p>Absensi Siswa</p>
    </div>

    <!-- Sub Tab Switcher -->
    <div class="sub-tab-bar">
      <button class="sub-tab-btn ${subTab === 'input' ? 'active' : ''}" onclick="window.setGuruSubTab('absensi', 'input')">Input Absensi</button>
      <button class="sub-tab-btn ${subTab === 'riwayat' ? 'active' : ''}" onclick="window.setGuruSubTab('absensi', 'riwayat')">Riwayat</button>
    </div>

    <div style="padding:16px;">
      ${subTab === 'input' ? renderInputAbsensi(state) : renderRiwayatAbsensi(state)}
    </div>
  `;
}

function renderInputAbsensi(state) {
  const students = state.students;
  // Local temporary attendance states
  window.tempAbsensi = window.tempAbsensi || { 1: 'H', 2: 'H', 3: 'H' };

  let countH = 0, countS = 0, countI = 0, countA = 0;
  students.forEach(s => {
    const st = window.tempAbsensi[s.id] || 'H';
    if (st === 'H') countH++;
    else if (st === 'S') countS++;
    else if (st === 'I') countI++;
    else if (st === 'A') countA++;
  });

  return `
    <div style="background:white; border-radius:14px; padding:18px; margin-bottom:14px; border:1px solid #e2e8f0; box-shadow:0 4px 12px rgba(15,23,42,0.04);">
      <h4 style="font-size:0.95rem; font-weight:800; color:#1e293b; margin-bottom:12px;">Input Kehadiran Siswa</h4>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">Tanggal</label>
          <input type="date" class="form-input" id="absensiDate" value="${new Date().toISOString().split('T')[0]}" />
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">Pertemuan</label>
          <select class="form-select" id="absensiPertemuan">
            <option value="1">Pertemuan 1</option>
            <option value="2">Pertemuan 2</option>
            <option value="3">Pertemuan 3</option>
            <option value="4">Pertemuan 4</option>
            <option value="5">Pertemuan 5</option>
          </select>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">Mata Pelajaran</label>
          <select class="form-select" id="absensiMapel">
            ${(state.mapel && state.mapel.length > 0) ? state.mapel.map(m => `<option value="${m.name}">${m.name}</option>`).join('') : '<option value="MTK">MTK</option>'}
          </select>
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">Kelas</label>
          <select class="form-select" id="absensiKelas">
            ${(state.classes && state.classes.length > 0) ? state.classes.map(c => `<option value="${c.name}">${c.name}</option>`).join('') : '<option value="10 TKJ 1">10 TKJ 1</option>'}
          </select>
        </div>
      </div>

      <!-- Action header with Batch Mark Present -->
      <div class="attendance-action-header">
        <span style="font-size:0.85rem; font-weight:700; color:#1e293b;">Daftar Siswa (${students.length})</span>
        <button type="button" class="btn-batch-attend" onclick="window.markAllStudentsPresent()">
          <span>✨ Tandai Semua Hadir</span>
        </button>
      </div>

      <!-- Realtime Attendance Summary Counter -->
      <div class="attendance-counter-pills">
        <div class="counter-item h">Hadir: <span class="counter-num">${countH}</span></div>
        <div class="counter-item s">Sakit: <span class="counter-num">${countS}</span></div>
        <div class="counter-item i">Izin: <span class="counter-num">${countI}</span></div>
        <div class="counter-item a">Alpa: <span class="counter-num">${countA}</span></div>
      </div>

      <!-- Student List for Attendance -->
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${students.map(s => {
          const currentStatus = window.tempAbsensi[s.id] || 'H';
          return `
            <div class="student-list-item">
              <div>
                <div class="student-info-name">${s.name}</div>
                <div class="student-info-nis">NIS: ${s.nis}</div>
              </div>
              <div class="attendance-badges">
                <button class="badge-btn status-H ${currentStatus === 'H' ? 'active' : ''}" onclick="window.setStudentStatus(${s.id}, 'H')">H</button>
                <button class="badge-btn status-S ${currentStatus === 'S' ? 'active' : ''}" onclick="window.setStudentStatus(${s.id}, 'S')">S</button>
                <button class="badge-btn status-I ${currentStatus === 'I' ? 'active' : ''}" onclick="window.setStudentStatus(${s.id}, 'I')">I</button>
                <button class="badge-btn status-A ${currentStatus === 'A' ? 'active' : ''}" onclick="window.setStudentStatus(${s.id}, 'A')">A</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <button class="btn-primary mt-4" onclick="window.submitAbsensiForm()">
        💾 Simpan Absensi Kelas
      </button>
    </div>
  `;
}

function renderRiwayatAbsensi(state) {
  const attendance = state.attendance || [];
  const studentsMap = {};
  state.students.forEach(s => studentsMap[s.id] = s.name);

  const mapelList = state.mapel || [];
  const classList = state.classes || [];

  return `
    <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin-bottom:12px;">Riwayat Absensi (Sesi Pertemuan)</h4>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
      <select class="form-select" id="riwayatFilterMapel">
        <option value="">Semua Mapel</option>
        ${mapelList.map(m => `<option value="${m.name}">${m.name}</option>`).join('')}
      </select>
      <select class="form-select" id="riwayatFilterKelas">
        <option value="">Semua Kelas</option>
        ${classList.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
      </select>
    </div>

    <button class="blue-rekap-btn" onclick="window.simulateExportData('10 TKJ 1')">
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
      Tampilkan Rekap Kehadiran Siswa
    </button>

    <div class="section-title" style="margin:16px 0 10px;">Daftar Sesi Pertemuan</div>

    ${attendance.length === 0 ? `
      <p style="font-size:0.82rem; color:#94a3b8; text-align:center; padding:20px;">Belum ada sesi absensi tersimpan.</p>
    ` : attendance.map(item => `
      <div class="pertemuan-card">
        <div class="pertemuan-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
          <div style="display:flex; flex-direction:column; gap:2px;">
            <span style="font-size:0.85rem; font-weight:700; color:#0b345e;">📅 ${item.date || '2026-09-10'} • ${item.mapel || 'Mapel'} (${item.class || 'Kelas'})</span>
            <span style="font-size:0.75rem; font-weight:600; color:#0284c7;">Pertemuan Ke-${item.pertemuan || 1}</span>
          </div>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </div>
        <div class="pertemuan-body">
          ${!item.records || Object.keys(item.records).length === 0 ? `
            <p style="font-size:0.75rem; color:#94a3b8;">Belum ada record data siswa.</p>
          ` : Object.entries(item.records).map(([studentId, status]) => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px dashed #f1f5f9;">
              <span style="font-size:0.85rem; font-weight:600; color:#334155;">${studentsMap[studentId] || `Siswa (${studentId})`}</span>
              <span class="badge-tag ${status === 'H' ? 'badge-green' : 'badge-blue'}">${status === 'H' ? 'Hadir' : status === 'S' ? 'Sakit' : status === 'I' ? 'Izin' : 'Alpa'}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}
  `;
}

function renderNilai(state) {
  const teacher = state.currentUser.guru;
  const subTab = state.guruSubTab.nilai || 'pertemuan';

  return `
    <div class="guru-header">
      <p style="font-size:0.75rem; opacity:0.85;">Selamat Datang,</p>
      <h2>${teacher.name}</h2>
      <p>Nilai</p>
    </div>

    <div style="padding:16px;">
      <h3 style="font-size:1.05rem; font-weight:800; color:#1e293b; margin-bottom:12px;">Nilai Akademik</h3>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
        <select class="form-select"><option>MTK</option></select>
        <select class="form-select"><option>10 TKJ 1</option></select>
      </div>

      <div style="display:flex; gap:10px; margin-bottom:14px;">
        <button class="btn-primary" style="${subTab === 'rekap' ? 'background:#1e40af;' : ''}" onclick="window.setGuruSubTab('nilai', '${subTab === 'rekap' ? 'pertemuan' : 'rekap'}')">
          ${subTab === 'rekap' ? '📊 Lihat Riwayat' : '📈 Lihat Rekap'}
        </button>
      </div>

      ${subTab === 'pertemuan' ? renderPerPertemuanNilai(state) : renderRekapNilai(state)}
    </div>
  `;
}

function renderPerPertemuanNilai(state) {
  const students = state.students;
  const gradesList = state.grades || [];

  return `
    <div style="display:flex; gap:8px; margin-bottom:12px;">
      <input type="text" class="form-input" placeholder="Cari nama siswa..." />
      <button style="background:#e0e7ff; color:#4f46e5; border:none; padding:0 12px; border-radius:8px; font-weight:700; cursor:pointer;">A-Z</button>
    </div>

    ${gradesList.map(g => `
      <div class="pertemuan-card">
        <div class="pertemuan-header">
          <span>📘 Pertemuan ${g.pertemuan}</span>
          <span style="font-size:0.75rem; color:#2563eb; font-weight:600;">Edit Nilai</span>
        </div>
        <div class="pertemuan-body">
          ${students.map(s => {
            const score = g.scores[s.id] || 0;
            return `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #f1f5f9;">
                <div>
                  <div style="font-size:0.85rem; font-weight:700; color:#1e293b;">${s.name}</div>
                  <div style="font-size:0.72rem; color:#64748b;">NIS: ${s.nis}</div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="score-badge">${score}</span>
                  <button style="background:none; border:none; color:#2563eb; cursor:pointer;" onclick="window.editScore(${g.pertemuan}, ${s.id}, ${score})">✏️</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('')}
  `;
}

function renderRekapNilai(state) {
  const students = state.students;

  // Compute average per student
  const averages = {
    1: 75.5,
    2: 85.0,
    3: 75.0
  };

  return `
    <div class="content-card">
      <h4 style="font-size:0.95rem; font-weight:700; color:#1e293b; margin-bottom:12px;">Rekap Rata-rata Nilai</h4>
      ${students.map(s => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #f1f5f9;">
          <div>
            <div style="font-size:0.88rem; font-weight:700; color:#1e293b;">${s.name}</div>
            <div style="font-size:0.75rem; color:#64748b;">NIS: ${s.nis}</div>
          </div>
          <div>
            <span style="font-size:0.7rem; color:#64748b; font-weight:600;">Rata-rata: </span>
            <span style="font-size:1rem; font-weight:800; color:#0284c7;">${averages[s.id] || '75.0'}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderProfil(state) {
  const teacher = state.currentUser.guru;
  return `
    <div class="guru-header">
      <h2>Profil Guru</h2>
    </div>
    <div style="padding:16px;">
      <div class="content-card text-center" style="padding:24px;">
        <div style="width:64px; height:64px; border-radius:50%; background:#dbeafe; color:#1e40af; display:flex; align-items:center; justify-content:center; font-size:1.8rem; margin:0 auto 12px;">
          👨‍🏫
        </div>
        <h3 style="font-size:1.2rem; font-weight:800; color:#1e293b;">${teacher.name}</h3>
        <p style="font-size:0.8rem; color:#64748b; margin-top:2px;">User: @${teacher.username}</p>
        <p style="font-size:0.8rem; color:#0284c7; font-weight:600; margin-top:4px;">Mapel: ${teacher.mapel}</p>

        <div style="margin-top:16px; padding:12px; background:rgba(241,245,249,0.5); border-radius:10px; display:flex; justify-content:space-between; align-items:center; border:1px solid #e2e8f0;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:1.1rem;">${state.themeMode === 'dark' ? '🌙' : '☀️'}</span>
            <span style="font-size:0.85rem; font-weight:600; color:#1e293b;">Tema Gelap (Dark Mode)</span>
          </div>
          <input type="checkbox" ${state.themeMode === 'dark' ? 'checked' : ''} onchange="window.toggleThemeMode(this.checked)" style="width:20px; height:20px; cursor:pointer;" />
        </div>

        <button class="btn-danger-outline mt-4" onclick="window.logout()">
          🚪 Logout dari Guru
        </button>
      </div>
    </div>
  `;
}
