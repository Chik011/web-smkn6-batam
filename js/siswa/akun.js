/* Siswa - Akun & Profil View Module */

export function renderAkun(state) {
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
