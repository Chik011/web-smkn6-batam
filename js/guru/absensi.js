/* Guru — Absensi Tab */

export function renderAbsensi(state) {
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
  const selectedClass = window.guruSelectedClass || ((state.classes && state.classes.length > 0) ? state.classes[0].name : '10 TKJ 1');
  window.guruSelectedClass = selectedClass;

  const isDummy = (s) => {
    if (!s) return true;
    const name = String(s.name || s.nama || s.studentName || '').toLowerCase();
    const nis = String(s.nis || s.nisn || s.studentId || s.id || '').trim();
    const dummyNames = ['ahmad', 'budi', 'citra', 'rizki', 'dewi', 'santoso'];
    const dummyNis = ['2024001', '2024002', '2024003'];
    if (dummyNis.includes(nis)) return true;
    for (const dn of dummyNames) {
      if (name.includes(dn)) return true;
    }
    return false;
  };

  const allStudents = state.students || [];
  const rawFiltered = allStudents.filter(s => {
    if (isDummy(s)) return false;
    if (!s.class && !s.className) return true;
    const cName = String(s.class || s.className || '').trim().toLowerCase();
    const targetClass = String(selectedClass).trim().toLowerCase();
    return cName === targetClass;
  });

  // Strict deduplication by NIS or Name
  const seen = new Map();
  rawFiltered.forEach(s => {
    const key = (s.nis || s.name || s.id).toString().trim().toLowerCase();
    if (!seen.has(key)) {
      seen.set(key, s);
    }
  });
  const students = Array.from(seen.values());

  window.tempAbsensi = window.tempAbsensi || {};

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
          <select class="form-select" id="absensiKelas" onchange="window.guruSelectedClass = this.value; window.renderApp && window.renderApp();">
            ${(state.classes && state.classes.length > 0) ? state.classes.map(c => `<option value="${c.name}" ${c.name === selectedClass ? 'selected' : ''}>${c.name}</option>`).join('') : `<option value="${selectedClass}">${selectedClass}</option>`}
          </select>
        </div>
      </div>

      <!-- Action header with Batch Mark Present -->
      <div class="attendance-action-header">
        <span style="font-size:0.85rem; font-weight:700; color:#1e293b;">Daftar Siswa Kelas ${selectedClass} (${students.length})</span>
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
        ${students.length === 0 ? `
          <p style="font-size:0.82rem; color:#94a3b8; text-align:center; padding:16px 0;">Tidak ada data siswa untuk kelas ${selectedClass}.</p>
        ` : students.map(s => {
          const currentStatus = window.tempAbsensi[s.id] || 'H';
          return `
            <div class="student-list-item">
              <div>
                <div class="student-info-name">${s.name}</div>
                <div class="student-info-nis">NIS: ${s.nis}</div>
              </div>
              <div class="attendance-badges">
                <button class="badge-btn status-H ${currentStatus === 'H' ? 'active' : ''}" onclick="window.setStudentStatus('${s.id}', 'H')">H</button>
                <button class="badge-btn status-S ${currentStatus === 'S' ? 'active' : ''}" onclick="window.setStudentStatus('${s.id}', 'S')">S</button>
                <button class="badge-btn status-I ${currentStatus === 'I' ? 'active' : ''}" onclick="window.setStudentStatus('${s.id}', 'I')">I</button>
                <button class="badge-btn status-A ${currentStatus === 'A' ? 'active' : ''}" onclick="window.setStudentStatus('${s.id}', 'A')">A</button>
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
