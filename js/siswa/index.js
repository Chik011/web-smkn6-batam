/* Siswa Module Index Orchestrator */

import { renderHome } from './home.js';
import { renderPelajaran } from './pelajaran.js';
import { renderScan } from './scan.js';
import { renderNotifikasi } from './notifikasi.js';
import { renderAkun } from './akun.js';

export { renderHome, renderPelajaran, renderScan, renderNotifikasi, renderAkun };

export function renderSiswaScreen(state) {
  const activeTab = state.activeTabs.siswa || 'home';

  let contentHtml = '';
  switch (activeTab) {
    case 'home':
      contentHtml = renderHome(state);
      break;
    case 'pelajaran':
      contentHtml = renderPelajaran(state);
      break;
    case 'scan':
    case 'galeri':
    case 'galerisiswa':
      contentHtml = renderGaleriSiswaView(state);
      break;
    case 'notifikasi':
      contentHtml = renderNotifikasi(state);
      break;
    case 'akun':
      contentHtml = renderAkun(state);
      break;
    default:
      contentHtml = renderHome(state);
  }

  const bottomNavHtml = `
    <nav class="phone-bottom-nav">
      <button class="nav-item ${activeTab === 'home' ? 'active' : ''}" data-tab="home">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 00-1 1m-6 0h6"/></svg>
        </div>
        <span>Home</span>
      </button>

      <button class="nav-item ${activeTab === 'pelajaran' ? 'active' : ''}" data-tab="pelajaran">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        </div>
        <span>Pelajaran</span>
      </button>

      <button class="nav-item ${activeTab === 'galerisiswa' || activeTab === 'galeri' || activeTab === 'scan' ? 'active' : ''}" data-tab="galerisiswa">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </div>
        <span>Galeri</span>
      </button>

      <button class="nav-item ${activeTab === 'notifikasi' ? 'active' : ''}" data-tab="notifikasi">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        </div>
        <span>Notifikasi</span>
      </button>

      <button class="nav-item ${activeTab === 'akun' ? 'active' : ''}" data-tab="akun">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </div>
        <span>Akun</span>
      </button>

      <button class="nav-item nav-logout-btn" type="button" onclick="window.logout()" title="Logout">
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        </div>
        <span>Logout</span>
      </button>
    </nav>
  `;

  return { contentHtml, bottomNavHtml };
}
