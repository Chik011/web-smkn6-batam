/* Siswa - Notifikasi View Module */

export function renderNotifikasi(state) {
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
          <button style="margin-top:10px; background:#eff6ff; color:#2563eb; border:none; padding:6px 12px; border-radius:6px; font-size:0.75rem; font-weight:600; cursor:pointer;" onclick="window.playNewsVideo('${item.title}', '${item.url}')">▶ Tonton Video</button>
        </div>
      `).join('')}
    </div>
  `;
}
