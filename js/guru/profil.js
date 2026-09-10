/* Guru — Profil Tab */

export function renderProfil(state) {
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

        <button class="btn-danger-outline mt-4" onclick="window.logout()">
          🚪 Logout dari Guru
        </button>
      </div>
    </div>
  `;
}
