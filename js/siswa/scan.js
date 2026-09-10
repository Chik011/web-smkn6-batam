/* Siswa - Scan View Module */

export function renderScan(state) {
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
