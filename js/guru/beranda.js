/* Guru — Beranda Tab */
import { store } from '../state.js';

export function renderBeranda(state) {
  const teacher = state.currentUser.guru;
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
