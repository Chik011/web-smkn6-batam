/* Guru — Nilai Tab */

export function renderNilai(state) {
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
