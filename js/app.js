/* App Main Orchestrator & Global Handlers */

import { store } from './state.js';
import { getYouTubeDetails } from './firebase.js';
import { renderSiswaScreen } from './siswa.js';
import { renderGuruScreen } from './guru.js';
import { renderAdminScreen } from './admin.js';

function getFormattedTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds} WIB`;
}

function getShortTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getFormattedDate() {
  const now = new Date();
  return now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

function updateLiveClocks() {
  const timeStr = getFormattedTime();
  const dateStr = getFormattedDate();
  const shortTime = getShortTime();

  document.querySelectorAll('.live-time-text').forEach(el => {
    if (el.textContent !== timeStr) el.textContent = timeStr;
  });

  document.querySelectorAll('.today-label').forEach(el => {
    if (el.textContent !== dateStr) el.textContent = dateStr;
  });

  document.querySelectorAll('.phone-status-time').forEach(el => {
    if (el.textContent !== shortTime) el.textContent = shortTime;
  });
}

if (!window._clockIntervalStarted) {
  window._clockIntervalStarted = true;
  setInterval(updateLiveClocks, 1000);
}

function syncTabFromHash() {
  const role = document.body.dataset.role || store.state.activeRole;
  const hash = window.location.hash.replace('#', '').trim();
  if (role && hash) {
    const validTabs = {
      siswa: ['home', 'pelajaran', 'scan', 'notifikasi', 'akun', 'visimisi', 'gurutkj', 'totalsiswa', 'kalender', 'galerisiswa', 'library', 'elibrary', 'videotkj'],
      guru: ['beranda', 'absensi', 'nilai', 'profil'],
      admin: ['home', 'guru', 'mapel', 'siswa', 'jadwal', 'setting']
    };
    if (validTabs[role] && validTabs[role].includes(hash)) {
      if (store.state.activeTabs[role] !== hash) {
        store.state.activeTabs[role] = hash;
      }
    }
  }
}

if (!window._hashListenerAttached) {
  window._hashListenerAttached = true;
  window.addEventListener('hashchange', () => {
    syncTabFromHash();
    renderApp();
  });
}

function getFooterHtml() {
  return `
    <footer class="app-global-footer">
      <div class="footer-glow-bg"></div>
      <div class="footer-content">
        
        <div class="footer-top-brand">
          <div class="footer-logo-wrapper">
            <img src="img/Logo_SMKN6.png" alt="Logo SMKN 6 Batam" class="footer-logo" />
            <span class="footer-logo-glow"></span>
          </div>
          <div class="footer-brand-info">
            <h4 class="footer-title">SMK NEGERI 6 BATAM</h4>
            <p class="footer-subtitle">Teknik Komputer & Jaringan (TKJ) • Hub Akademik</p>
          </div>
        </div>

        <div class="footer-social-section">
          <div class="footer-social-cards">
            <a href="https://www.instagram.com/tkj_smkn_6/" target="_blank" rel="noopener noreferrer" class="social-card social-ig">
              <div class="social-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </div>
              <div class="social-details">
                <span class="social-name">Instagram</span>
                <span class="social-handle">@tkj_smkn_6</span>
              </div>
              <svg class="social-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>

            <a href="https://www.youtube.com/@tkjteknikkomputerdanjaring7669" target="_blank" rel="noopener noreferrer" class="social-card social-yt">
              <div class="social-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </div>
              <div class="social-details">
                <span class="social-name">YouTube</span>
                <span class="social-handle">TKJ SMKN 6 Batam</span>
              </div>
              <svg class="social-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>

            <a href="#" class="social-card social-tt" onclick="event.preventDefault()">
              <div class="social-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </div>
              <div class="social-details">
                <span class="social-name">TikTok</span>
                <span class="social-handle">@tkj_smkn_6</span>
              </div>
              <svg class="social-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>

            <a href="#" class="social-card social-wa" onclick="event.preventDefault()">
              <div class="social-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </div>
              <div class="social-details">
                <span class="social-name">WhatsApp</span>
                <span class="social-handle">Layanan Informasi</span>
              </div>
              <svg class="social-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-bottom-info">
            <p>© 2026 SMK Negeri 6 Batam</p>
            <p class="footer-location">📍 Jl. Kabil, Batam Kota, Kepulauan Riau</p>
          </div>
        </div>

      </div>
    </footer>
  `;
}

function renderApp() {
  const state = store.state;
  const appEl = document.getElementById('app');
  if (!appEl) return;

  if (!state.isLoggedIn) {
    delete document.body.dataset.role;
    if (!document.querySelector('.login-page')) {
      appEl.innerHTML = renderLoginPage();
    }
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPath !== 'index.html' && currentPath !== '') {
      try {
        history.replaceState(null, '', './index.html');
      } catch (e) {}
    }
    return;
  }

  let role = document.body.dataset.role || state.activeRole || 'siswa';
  document.body.dataset.role = role;
  syncTabFromHash();

  const activeTab = state.activeTabs[role] || (role === 'guru' ? 'beranda' : 'home');
  const targetUrl = `./${role}.html#${activeTab}`;
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPath !== `${role}.html` || window.location.hash !== '#' + activeTab) {
    try {
      history.replaceState(null, '', targetUrl);
    } catch (e) {}
  }

  let screenResult = { contentHtml: '', bottomNavHtml: '' };
  if (role === 'siswa') screenResult = renderSiswaScreen(state);
  else if (role === 'guru') screenResult = renderGuruScreen(state);
  else if (role === 'admin') screenResult = renderAdminScreen(state);

  const headerExists = document.querySelector('.desktop-header-block');
  let phoneScreen = document.getElementById('phoneScreen');
  const activeKey = `${role}-${activeTab}`;

  if (!headerExists || !phoneScreen) {
    const desktopBarHtml = `
      <header class="desktop-header-block">
        <div class="desktop-top-row">
          <div class="desktop-brand">
            <img src="img/Logo_SMKN6.png" alt="Logo SMKN 6 Batam" class="logo-icon" />
            <div class="desktop-title">
              <h1>SMKN 6 <span>Academic Hub</span></h1>
              <p>Sistem informasi akademik terpadu</p>
            </div>
          </div>

          <div class="desktop-meta">
            <div class="live-status" title="Waktu Nyata WIB"><span class="status-dot"></span> <span class="live-time-text">${getFormattedTime()}</span></div>
            <div class="today-label">${getFormattedDate()}</div>
          </div>
        </div>

        <div class="desktop-nav-row" id="desktopNavRow">
          ${screenResult.bottomNavHtml}
        </div>
      </header>
    `;

    const appHtml = `
      ${desktopBarHtml}

      <main class="desktop-layout">
        <div class="phone-frame">
          <div class="phone-screen" id="phoneScreen" data-active-key="${activeKey}">
            <div class="tab-content-anim">
              ${screenResult.contentHtml}
              ${getFooterHtml()}
            </div>
          </div>
        </div>
      </main>
    `;

    appEl.innerHTML = appHtml;
    phoneScreen = document.getElementById('phoneScreen');
    if (phoneScreen) {
      phoneScreen.dataset.lastContent = screenResult.contentHtml;
    }
    bindBottomNavEvents(role);
  } else {
    const navRow = document.getElementById('desktopNavRow');
    if (navRow && navRow.dataset.lastNav !== screenResult.bottomNavHtml) {
      navRow.dataset.lastNav = screenResult.bottomNavHtml;
      navRow.innerHTML = screenResult.bottomNavHtml;
      bindBottomNavEvents(role);
    }

    const contentChanged = phoneScreen.dataset.lastContent !== screenResult.contentHtml;
    const tabChanged = phoneScreen.dataset.activeKey !== activeKey;

    if (contentChanged || tabChanged) {
      phoneScreen.dataset.lastContent = screenResult.contentHtml;
      phoneScreen.dataset.activeKey = activeKey;

      if (tabChanged) {
        phoneScreen.innerHTML = `
          <div class="tab-content-anim">
            ${screenResult.contentHtml}
            ${getFooterHtml()}
          </div>
        `;
      } else {
        phoneScreen.innerHTML = `
          <div class="tab-content-anim">
            ${screenResult.contentHtml}
            ${getFooterHtml()}
          </div>
        `;
      }
    }
  }
}

function renderLoginPage() {
  return `
    <div style="display:flex; flex-direction:column; min-height:100vh;">
      <main class="login-page" style="flex:1;">
        <section class="login-showcase">
          <img src="img/Logo_SMKN6.png" alt="Logo SMKN 6 Batam" class="login-brand-mark" />
          <p class="login-eyebrow">SMK NEGERI 6</p>
          <h1>Semua aktivitas sekolah, satu ruang.</h1>
          <div class="login-feature-list">
            <span><b>01</b> Portal siswa</span>
            <span><b>02</b> Ruang kerja guru</span>
            <span><b>03</b> Panel administrasi</span>
          </div>
        </section>

        <section class="login-card-wrap">
          <div class="login-card">
            <div class="login-card-heading">
              <span class="login-lock-icon">↗</span>
              <p class="login-eyebrow">SMKN 6 Batam</p>
              <h2>Selamat datang kembali</h2>
              <p>Masuk untuk melanjutkan aktivitasmu.</p>
            </div>
            <form class="login-form" id="mainLoginForm" onsubmit="window.handleLogin(event)">
              <label class="form-label" for="loginRole">Masuk sebagai</label>
              <select class="form-select" id="loginRole">
                <option value="siswa">Siswa</option>
                <option value="guru">Guru</option>
                <option value="admin">Admin</option>
              </select>
              <label class="form-label" for="loginUsername">Username</label>
              <input class="form-input" id="loginUsername" type="text" placeholder="Masukkan username" required />
              <label class="form-label" for="loginPassword">Password</label>
              <input class="form-input" id="loginPassword" type="password" placeholder="Masukkan password" required />
              <p class="login-error" id="loginError"></p>
              <button class="btn-primary login-submit" type="submit">Masuk ke Dashboard <span>→</span></button>
            </form>

            <div class="login-quick-roles">
              <span class="quick-role-label">⚡ Akses Cepat Akun Demo (1-Klik):</span>
              <div class="quick-role-chips">
                <button type="button" class="quick-chip" onclick="window.quickFillLogin('siswa')">🎓 Siswa</button>
                <button type="button" class="quick-chip" onclick="window.quickFillLogin('guru')">👨‍🏫 Guru</button>
                <button type="button" class="quick-chip" onclick="window.quickFillLogin('admin')">🛡️ Admin</button>
              </div>
            </div>
          </div>
        </section>
      </main>
      ${getFooterHtml()}
    </div>
  `;
}

function bindBottomNavEvents(role) {
  const navBtns = document.querySelectorAll('.phone-bottom-nav .nav-item');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab) {
        window.switchRoleTab(role, tab);
      }
    });
  });
}

// Global Window Helpers for Interactive Inline Click Triggers
window.showToast = function(message, type = 'success') {
  let container = document.getElementById('globalToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'globalToastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✅',
    info: 'ℹ️',
    warning: '⚠️',
    danger: '❌'
  };

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || '🔔'}</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-leave');
    setTimeout(() => {
      toast.remove();
    }, 320);
  }, 3200);
};

window.quickFillLogin = function(role) {
  const roleSelect = document.getElementById('loginRole');
  const userInp = document.getElementById('loginUsername');
  const passInp = document.getElementById('loginPassword');
  if (!roleSelect || !userInp || !passInp) return;

  const state = store.state;
  let demoUser = 'siswa';
  let demoPass = 'siswa123';

  if (role === 'siswa') {
    const firstSiswa = (state.students && state.students.length > 0) ? state.students[0] : null;
    demoUser = firstSiswa ? (firstSiswa.name || firstSiswa.nis || 'tes2') : 'tes2';
    demoPass = 'siswa123';
  } else if (role === 'guru') {
    const firstGuru = (state.teachers && state.teachers.length > 0) ? state.teachers[0] : null;
    demoUser = firstGuru ? (firstGuru.username || firstGuru.name || 'guru') : 'guru';
    demoPass = 'guru123';
  } else if (role === 'admin') {
    demoUser = 'admin';
    demoPass = 'admin123';
  }

  roleSelect.value = role;
  userInp.value = demoUser;
  passInp.value = demoPass;
  
  [userInp, passInp].forEach(inp => {
    inp.style.transition = 'all 0.3s ease';
    inp.style.borderColor = '#0284c7';
    inp.style.boxShadow = '0 0 0 4px rgba(2, 132, 199, 0.2)';
    setTimeout(() => {
      inp.style.borderColor = '';
      inp.style.boxShadow = '';
    }, 600);
  });

  window.showToast(`Akun Firebase ${role.toUpperCase()} (${demoUser}) dimuat!`, 'info');
};

window.switchRole = function(role) {
  store.setRole(role);
};

window.handleLogin = function(event) {
  event.preventDefault();
  const form = document.getElementById('mainLoginForm') || event.target;
  const role = document.getElementById('loginRole').value;
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const error = document.getElementById('loginError');

  const state = store.state;
  let isValid = false;
  let loggedName = username;

  if (role === 'siswa') {
    const found = (state.students || []).find(s => 
      (s.name && s.name.toLowerCase() === username.toLowerCase()) || 
      (s.nis && String(s.nis) === username) ||
      (s.id && String(s.id) === username) ||
      username.toLowerCase() === 'siswa' ||
      username.toLowerCase() === 'tes' ||
      username.toLowerCase() === 'tes2'
    );
    if (found || username.length > 0) {
      isValid = true;
      if (found) {
        loggedName = found.name || username;
        state.currentUser.siswa.name = loggedName;
        state.currentUser.siswa.nis = found.nis || '123456789';
        state.currentUser.siswa.class = found.class || '10 TKJ 1';
      }
    }
  } else if (role === 'guru') {
    const found = (state.teachers || []).find(t => 
      (t.username && t.username.toLowerCase() === username.toLowerCase()) || 
      (t.name && t.name.toLowerCase() === username.toLowerCase()) ||
      username.toLowerCase() === 'guru'
    );
    if (found || username.length > 0) {
      isValid = true;
      if (found) {
        loggedName = found.name || found.username || username;
        state.currentUser.guru.name = loggedName;
        state.currentUser.guru.username = found.username || username;
        state.currentUser.guru.mapel = found.mapel || 'MTK';
      }
    }
  } else if (role === 'admin') {
    isValid = true;
  }

  if (!isValid) {
    if (error) error.textContent = 'Username belum terdaftar di Firebase.';
    form.classList.remove('shake');
    void form.offsetWidth; // trigger reflow
    form.classList.add('shake');
    window.showToast('Username tidak ditemukan di Firebase!', 'danger');
    return;
  }

  window.showToast(`Berhasil masuk sebagai ${role.toUpperCase()} (${loggedName})!`, 'success');
  setTimeout(() => {
    store.login(role, loggedName);
    document.body.dataset.role = role;
    const defaultTab = (role === 'guru') ? 'beranda' : 'home';
    try {
      history.replaceState(null, '', `./${role}.html#${defaultTab}`);
    } catch (e) {}
    renderApp();
  }, 450);
};

window.confirmLogout = function() {
  const pageRole = document.body.getAttribute('data-role') || 'siswa';
  let username = 'Pengguna';

  if (pageRole === 'siswa' && store.state.currentUser.siswa) {
    username = store.state.currentUser.siswa.name || store.state.currentUser.siswa.nis || 'Siswa';
  } else if (pageRole === 'guru' && store.state.currentUser.guru) {
    username = store.state.currentUser.guru.name || store.state.currentUser.guru.username || 'Guru';
  } else if (pageRole === 'admin' && store.state.currentUser.admin) {
    username = store.state.currentUser.admin.username || 'Admin';
  }

  const overlay = document.getElementById('globalModal');
  const card = document.getElementById('modalCardContent');
  if (!overlay || !card) return;

  card.innerHTML = `
    <div style="text-align: center; padding: 6px 2px;">
      <div style="width: 56px; height: 56px; border-radius: 50%; background: #fee2e2; color: #ef4444; display: inline-flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 14px; box-shadow: 0 4px 14px rgba(239, 68, 68, 0.2);">
        🚪
      </div>
      <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">Konfirmasi Logout</h3>
      <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 22px;">
        Apakah anda mau keluar dari akun ini <strong>"${username}"</strong>?
      </p>
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button type="button" style="flex: 1; padding: 11px 16px; border-radius: 12px; border: 1px solid #cbd5e1; background: #f8fafc; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.2s;" onclick="window.closeModal()">Tidak</button>
        <button type="button" style="flex: 1; padding: 11px 16px; border-radius: 12px; background: #ef4444; color: white; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s;" onclick="window.closeModal(); window.performLogout();">Iya</button>
      </div>
    </div>
  `;
  overlay.classList.add('open');
};

window.performLogout = function() {
  window.showToast('Anda telah keluar dari sesi.', 'info');
  setTimeout(() => {
    store.logout();
    delete document.body.dataset.role;
    try {
      history.replaceState(null, '', './index.html');
    } catch (e) {}
    renderApp();
  }, 400);
};

window.logout = function(skipConfirm) {
  if (skipConfirm === true) {
    window.performLogout();
  } else {
    window.confirmLogout();
  }
};

window.toggleViewMode = function() {
  const newMode = store.state.activeViewMode === 'phone' ? 'grid' : 'phone';
  store.setViewMode(newMode);
};

window.switchRoleTab = function(role, tab) {
  if (role && tab) {
    if (window.location.hash !== '#' + tab) {
      history.replaceState(null, '', '#' + tab);
    }
    store.setRoleTab(role, tab);
  }
};

window.switchSiswaTab = function(tab) {
  window.switchRoleTab('siswa', tab);
};

window.switchGuruTab = function(tab) {
  window.switchRoleTab('guru', tab);
};

window.switchAdminTab = function(tab) {
  window.switchRoleTab('admin', tab);
};

window.setGuruSubTab = function(category, tab) {
  store.state.guruSubTab[category] = tab;
  store.saveState();
};

window.setStudentStatus = function(studentId, status) {
  window.tempAbsensi = window.tempAbsensi || {};
  window.tempAbsensi[studentId] = status;
  renderApp();
};

window.markAllStudentsPresent = function() {
  window.tempAbsensi = window.tempAbsensi || {};
  store.state.students.forEach(s => {
    window.tempAbsensi[s.id] = 'H';
  });
  window.showToast('Semua siswa ditandai Hadir (H)!', 'success');
  renderApp();
};

window.submitAbsensiForm = function() {
  const dateInput = document.getElementById('absensiDate');
  const todayStr = new Date().toISOString().split('T')[0];
  const date = dateInput?.value || todayStr;
  const pertemuan = document.getElementById('absensiPertemuan')?.value || '1';
  const mapel = document.getElementById('absensiMapel')?.value || 'MTK';
  const className = document.getElementById('absensiKelas')?.value || '10 TKJ 1';

  window.tempAbsensi = window.tempAbsensi || {};
  const records = { ...window.tempAbsensi };
  (store.state.students || []).forEach(s => {
    if (!records[s.id]) {
      records[s.id] = 'A';
    }
  });

  store.saveAttendance(date, pertemuan, mapel, className, records);
  window.showToast(`✅ Data Absensi (${mapel} - ${className}) Pertemuan ${pertemuan} Berhasil Disimpan ke Firebase!`, 'success');
};

window.editScore = function(pertemuan, studentId, currentScore) {
  const newScore = prompt(`Masukkan nilai baru untuk Pertemuan ${pertemuan}:`, currentScore);
  if (newScore !== null && !isNaN(newScore)) {
    const gradesObj = store.state.grades.find(g => g.pertemuan === pertemuan) || { scores: {} };
    gradesObj.scores[studentId] = parseInt(newScore);
    store.saveGrades(pertemuan, 'MTK', '10 TKJ 1', gradesObj.scores);
    window.showToast(`Nilai berhasil diperbarui jadi ${newScore}!`, 'success');
  }
};

window.simulateExportData = function(className = '10 TKJ 1') {
  window.showToast(`Menyiapkan data unduhan untuk kelas ${className}...`, 'info');
  setTimeout(() => {
    window.showToast(`✅ File rekap_${className}.xlsx berhasil diekspor!`, 'success');
  }, 900);
};

window.setAdminSiswaSubView = function(view, level = null, className = null, mode = null) {
  store.state.adminSubView.siswa = view;
  if (level !== null && level !== undefined) store.state.adminSubView.selectedLevel = level;
  if (className) store.state.adminSubView.selectedClass = className;
  store.state.adminSubView.siswaViewMode = mode || (['daftar', 'rekap', 'nilai'].includes(view) ? view : 'menu');
  store.saveState();
};

window.setAdminJadwalSubView = function(view, level = null) {
  store.state.adminSubView.jadwal = view;
  if (level) store.state.adminSubView.selectedJadwalLevel = level;
  store.saveState();
};

window.handleBroadcastSubmit = function(e) {
  e.preventDefault();
  const title = document.getElementById('newsTitle').value;
  const url = document.getElementById('newsUrl').value;
  store.addBroadcastNews(title, url);
  window.showToast('📢 Pengumuman video berhasil dipublikasikan!', 'success');
  document.getElementById('newsTitle').value = '';
  document.getElementById('newsUrl').value = '';
};

window.handleMapelSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('mapelName').value;
  store.addMapel(name);
  window.showToast('📘 Mata Pelajaran Baru Berhasil Ditambahkan!', 'success');
  document.getElementById('mapelName').value = '';
};

window.selectRoom = function(el, room) {
  document.querySelectorAll('.room-selector-pills .pill-option').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('schedRuangan').value = room;
};

window.selectDay = function(el, day) {
  document.querySelectorAll('.day-selector-pills .pill-option').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('schedHari').value = day;
};

window.handleCreateSchedule = function(e) {
  e.preventDefault();
  const mapel = document.getElementById('schedMapel').value;
  const guru = document.getElementById('schedGuru').value;
  const ruangan = document.getElementById('schedRuangan').value;
  const start = document.getElementById('schedStart').value;
  const end = document.getElementById('schedEnd').value;
  const hari = document.getElementById('schedHari').value;

  store.addSchedule({
    mapel,
    guru,
    ruangan,
    waktu: `${start} - ${end}`,
    hari,
    level: store.state.adminSubView.selectedJadwalLevel || 10,
    class: '10 TKJ 1'
  });

  window.showToast('📅 Jadwal Pelajaran Baru Berhasil Disimpan!', 'success');
  window.setAdminJadwalSubView('list');
};

window.toggleFlipCard = function() {
  const inner = document.getElementById('ktsFlipInner');
  if (inner) {
    inner.classList.toggle('flipped');
  }
};

window.simulateScanQR = function() {
  window.showToast('📡 Memindai QR Code presensi...', 'info');
  setTimeout(() => {
    window.showToast('✅ Presensi berhasil! Kehadiran Anda hari ini telah dicatat.', 'success');
  }, 1000);
};

// Modal Windows Handler
window.openSiswaModal = function(type) {
  const overlay = document.getElementById('globalModal');
  const card = document.getElementById('modalCardContent');

  if (type === 'visimisi') {
    card.innerHTML = `
      <div class="modal-title text-center" style="margin-bottom:6px; font-weight:800; font-size:1.15rem; color:#0f172a;">🎯 Visi & Misi TKJ SMKN 6</div>
      <p style="font-size:0.75rem; text-align:center; color:#64748b; margin-bottom:14px;">Kompetensi Keahlian Teknik Komputer & Jaringan</p>
      
      <div style="background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:white; padding:14px; border-radius:12px; margin-bottom:12px; box-shadow:0 4px 12px rgba(15,23,42,0.15);">
        <h4 style="font-size:0.85rem; font-weight:800; color:#38bdf8; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px;">Visi TKJ</h4>
        <p style="font-size:0.78rem; line-height:1.5; color:#f8fafc; margin:0;">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        </p>
      </div>

      <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:14px; border-radius:12px;">
        <h4 style="font-size:0.85rem; font-weight:800; color:#0f172a; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px;">Misi Utama</h4>
        <ol style="font-size:0.76rem; color:#334155; margin:0 0 0 16px; padding:0; line-height:1.6;">
          <li style="margin-bottom:6px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
          <li style="margin-bottom:6px;">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
          <li style="margin-bottom:6px;">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</li>
          <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</li>
        </ol>
      </div>
      <button class="btn-primary mt-4" style="width:100%; font-weight:700;" onclick="window.closeModal()">Tutup Visi Misi</button>
    `;
  } else if (type === 'guruList') {
    const teachers = store.state.teachers || [];
    card.innerHTML = `
      <div class="modal-title" style="font-weight:800; font-size:1.1rem; color:#0f172a;">👨‍🏫 Daftar Guru Pengajar TKJ</div>
      <p style="font-size:0.78rem; color:#64748b; margin-bottom:12px;">Total ${teachers.length} Guru Aktif Terdaftar di Firebase:</p>
      
      <div style="max-height:280px; overflow-y:auto; display:flex; flex-direction:column; gap:8px; padding-right:4px;">
        ${teachers.length === 0 ? `
          <div style="text-align:center; padding:20px; color:#64748b; font-size:0.8rem;">Belum ada data guru terdaftar.</div>
        ` : teachers.map(t => `
          <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:10px 12px; border-radius:10px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h4 style="font-size:0.88rem; font-weight:700; color:#1e293b; margin:0;">${t.name || t.teacherName}</h4>
              <p style="font-size:0.73rem; color:#64748b; margin:2px 0 0 0;">Pengajar: ${t.mapel || t.subject || 'Produktif TKJ'}</p>
            </div>
            <span style="background:#e0e7ff; color:#4338ca; padding:3px 8px; border-radius:6px; font-size:0.7rem; font-weight:600;">${t.username || 'Guru'}</span>
          </div>
        `).join('')}
      </div>
      <button class="btn-primary mt-4" style="width:100%; font-weight:700;" onclick="window.closeModal()">Tutup Daftar Guru</button>
    `;
  } else if (type === 'totalSiswa') {
    const students = store.state.students || [];
    const k10 = students.filter(s => {
      const c = String(s.class || s.className || '').toLowerCase();
      return c.includes('10') || c.includes('x');
    });
    const k11 = students.filter(s => {
      const c = String(s.class || s.className || '').toLowerCase();
      return c.includes('11') || c.includes('xi');
    });
    const k12 = students.filter(s => {
      const c = String(s.class || s.className || '').toLowerCase();
      return c.includes('12') || c.includes('xii');
    });
    const totalCount = students.length;

    card.innerHTML = `
      <div class="modal-title" style="font-weight:800; font-size:1.15rem; color:#0f172a; margin-bottom:4px;">👥 Rekap Total Siswa Berdasarkan Kelas</div>
      <p style="font-size:0.78rem; color:#64748b; margin-bottom:14px;">Rincian jumlah siswa per-tingkat kelas X, XI, dan XII:</p>

      <!-- Grand Total Card -->
      <div style="background:linear-gradient(135deg, #0b2545 0%, #134074 100%); color:white; padding:16px 18px; border-radius:16px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 6px 20px rgba(11,37,69,0.25);">
        <div>
          <span style="font-size:0.7rem; font-weight:700; letter-spacing:0.8px; color:#38bdf8; text-transform:uppercase;">TOTAL KESELURUHAN SISWA</span>
          <h2 style="font-size:1.8rem; font-weight:800; margin:2px 0 0 0; color:#ffffff;">${totalCount} <span style="font-size:0.95rem; font-weight:600; color:#93c5fd;">Siswa Aktif</span></h2>
        </div>
        <div style="width:48px; height:48px; border-radius:14px; background:rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; font-size:1.6rem;">🎓</div>
      </div>

      <!-- Breakdown Grid 3 Kelas -->
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:14px;">
        <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:12px; padding:10px; text-align:center;">
          <span style="font-size:0.68rem; font-weight:800; color:#0284c7; text-transform:uppercase;">KELAS 10 (X)</span>
          <h3 style="font-size:1.25rem; font-weight:800; color:#0369a1; margin:4px 0 0 0;">${k10.length}</h3>
          <span style="font-size:0.65rem; color:#64748b;">Siswa</span>
        </div>

        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:10px; text-align:center;">
          <span style="font-size:0.68rem; font-weight:800; color:#16a34a; text-transform:uppercase;">KELAS 11 (XI)</span>
          <h3 style="font-size:1.25rem; font-weight:800; color:#15803d; margin:4px 0 0 0;">${k11.length}</h3>
          <span style="font-size:0.65rem; color:#64748b;">Siswa</span>
        </div>

        <div style="background:#faf5ff; border:1px solid #e9d5ff; border-radius:12px; padding:10px; text-align:center;">
          <span style="font-size:0.68rem; font-weight:800; color:#9333ea; text-transform:uppercase;">KELAS 12 (XII)</span>
          <h3 style="font-size:1.25rem; font-weight:800; color:#7e22ce; margin:4px 0 0 0;">${k12.length}</h3>
          <span style="font-size:0.65rem; color:#64748b;">Siswa</span>
        </div>
      </div>

      <!-- Student List by Class -->
      <div style="font-size:0.8rem; font-weight:700; color:#1e293b; margin-bottom:8px;">Daftar Siswa Terdaftar:</div>
      <div style="max-height:220px; overflow-y:auto; display:flex; flex-direction:column; gap:8px; padding-right:4px;">
        ${students.length === 0 ? `
          <div style="text-align:center; padding:20px; color:#64748b; font-size:0.8rem;">Belum ada data siswa terdaftar.</div>
        ` : students.map(s => `
          <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:10px 12px; border-radius:10px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h4 style="font-size:0.86rem; font-weight:700; color:#1e293b; margin:0;">${s.name || s.studentName}</h4>
              <p style="font-size:0.73rem; color:#64748b; margin:2px 0 0 0;">NIS: ${s.nis || s.studentId || '-'}</p>
            </div>
            <span style="background:#e0f2fe; color:#0369a1; padding:4px 10px; border-radius:8px; font-size:0.72rem; font-weight:700;">${s.class || s.className || '10 TKJ 1'}</span>
          </div>
        `).join('')}
      </div>
      <button class="btn-primary mt-4" style="width:100%; font-weight:700;" onclick="window.closeModal()">Tutup Rekap Siswa</button>
    `;
  } else if (type === 'survey') {
    card.innerHTML = `
      <div class="modal-title">📋 Survey Evaluasi Pembelajaran</div>
      <p style="font-size:0.8rem; color:#64748b; margin-bottom:12px;">Beri penilaian untuk meningkatkan kualitas fasilitas & materi sekolah:</p>
      <div class="form-group">
        <label class="form-label">Kepuasan Fasilitas Lab Komputer</label>
        <select class="form-select">
          <option>Sangat Memuaskan ⭐⭐⭐⭐⭐</option>
          <option>Puas & Lengkap ⭐⭐⭐⭐</option>
          <option>Cukup ⭐⭐⭐</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Koneksi Jaringan Internet Sekolah</label>
        <select class="form-select">
          <option>Cepat & Stabil 🚀</option>
          <option>Cukup Baik 📶</option>
          <option>Perlu Ditingkatkan ⚠️</option>
        </select>
      </div>
      <button class="btn-primary" onclick="window.showToast('Terima kasih! Survey berhasil terkirim.', 'success'); window.closeModal();">Kirim Feedback Survey</button>
    `;
  } else if (type === 'kts') {
    const user = store.state.currentUser.siswa;
    card.innerHTML = `
      <div class="modal-title text-center" style="margin-bottom:8px;">🪪 Kartu Tanda Siswa Digital</div>
      <p style="font-size:0.75rem; text-align:center; color:#64748b; margin-bottom:14px;">Klik kartu untuk melihat tampak depan / belakang:</p>

      <div class="flip-card-scene" onclick="window.toggleFlipCard()">
        <div class="flip-card-inner" id="ktsFlipInner">
          <!-- Tampak Depan -->
          <div class="flip-card-front">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <span style="font-size:0.65rem; letter-spacing:1px; opacity:0.85; font-weight:700;">KARTU PELAJAR DIGITAL</span>
                <h4 style="font-size:0.95rem; font-weight:800; margin-top:2px;">SMK NEGERI 6</h4>
              </div>
              <div style="background:rgba(255,255,255,0.22); padding:3px 8px; border-radius:6px; font-size:0.68rem; font-weight:700;">AKTIF</div>
            </div>
            <div style="display:flex; align-items:center; gap:14px; margin:8px 0;">
              <div style="width:52px; height:52px; border-radius:50%; background:white; color:#072a4f; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1.3rem; box-shadow:0 4px 10px rgba(0,0,0,0.15);">
                ${user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style="font-size:1.05rem; font-weight:800; text-transform:uppercase;">${user.name}</h3>
                <p style="font-size:0.75rem; opacity:0.9;">NIS: ${user.nis}</p>
                <p style="font-size:0.75rem; opacity:0.9;">Kelas: ${user.class}</p>
              </div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:flex-end;">
              <span style="font-size:0.66rem; opacity:0.75;">SMK Bisa • SMK Hebat</span>
              <div style="background:white; padding:3px 8px; border-radius:6px; color:black; font-family:monospace; font-size:0.7rem; font-weight:700;">|||| ||||| ||||</div>
            </div>
          </div>

          <!-- Tampak Belakang -->
          <div class="flip-card-back">
            <div>
              <h4 style="font-size:0.82rem; font-weight:700; color:#38bdf8;">TATA TERTIB PENGGUNAAN</h4>
              <ul style="font-size:0.68rem; margin:8px 0 0 16px; line-height:1.4; opacity:0.9;">
                <li>Kartu ini identitas resmi siswa SMKN 6.</li>
                <li>Gunakan untuk presensi QR & perpustakaan.</li>
                <li>Dilarang dipindah-tangankan kepada orang lain.</li>
              </ul>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px dashed rgba(255,255,255,0.2); padding-top:8px;">
              <span style="font-size:0.65rem; opacity:0.7;">Terverifikasi Otomatis</span>
              <span style="font-size:0.65rem; color:#38bdf8; font-weight:700;">Academic Hub</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flip-card-hint">
        <span>🔄 Sentuh/klik kartu untuk membalik (3D Flip)</span>
      </div>
      <button class="btn-primary mt-4" onclick="window.closeModal()">Tutup</button>
    `;
  } else if (type === 'career') {
    card.innerHTML = `
      <div class="modal-title">🎯 Career Profiling TKJ</div>
      <p style="font-size:0.78rem; color:#64748b; margin-bottom:12px;">Analisis kecocokan minat bakat industri teknologi:</p>
      <div style="display:flex; flex-direction:column; gap:12px; font-size:0.8rem;">
        <div>
          <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:4px;">
            <span>🌐 Network Engineer</span>
            <span style="color:#0284c7;">95% Cocok</span>
          </div>
          <div style="height:8px; background:#e2e8f0; border-radius:10px; overflow:hidden;">
            <div style="width:95%; height:100%; background:linear-gradient(90deg,#0284c7,#38bdf8); border-radius:10px;"></div>
          </div>
        </div>
        <div>
          <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:4px;">
            <span>🛡️ Cybersecurity Specialist</span>
            <span style="color:#6366f1;">88% Cocok</span>
          </div>
          <div style="height:8px; background:#e2e8f0; border-radius:10px; overflow:hidden;">
            <div style="width:88%; height:100%; background:linear-gradient(90deg,#6366f1,#818cf8); border-radius:10px;"></div>
          </div>
        </div>
        <div>
          <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:4px;">
            <span>☁️ Cloud & DevOps</span>
            <span style="color:#10b981;">82% Cocok</span>
          </div>
          <div style="height:8px; background:#e2e8f0; border-radius:10px; overflow:hidden;">
            <div style="width:82%; height:100%; background:linear-gradient(90deg,#10b981,#34d399); border-radius:10px;"></div>
          </div>
        </div>
      </div>
      <button class="btn-primary mt-4" onclick="window.closeModal()">Tutup</button>
    `;
  } else if (type === 'kalenderAkademik') {
    card.innerHTML = `
      <div class="modal-title" style="font-weight:800; font-size:1.1rem; color:#0f172a;">📅 Kalender Akademik SMKN 6</div>
      <p style="font-size:0.78rem; color:#64748b; margin-bottom:12px;">Agenda & Tanggal Penting Tahun Ajaran 2026/2027:</p>
      
      <div style="max-height:300px; overflow-y:auto; display:flex; flex-direction:column; gap:10px; padding-right:4px;">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-left:4px solid #0284c7; padding:10px 12px; border-radius:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.7rem; font-weight:700; color:#0284c7;">15 - 20 September 2026</span>
            <span style="background:#e0f2fe; color:#0284c7; padding:2px 6px; border-radius:4px; font-size:0.65rem; font-weight:700;">Ujian</span>
          </div>
          <h4 style="font-size:0.85rem; font-weight:700; color:#1e293b; margin:4px 0 2px 0;">Penilaian Tengah Semester (PTS) Ganjil</h4>
          <p style="font-size:0.72rem; color:#64748b; margin:0;">Ujian teori dan berbasis komputer seluruh mata pelajaran.</p>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-left:4px solid #6366f1; padding:10px 12px; border-radius:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.7rem; font-weight:700; color:#6366f1;">05 - 12 Oktober 2026</span>
            <span style="background:#e0e7ff; color:#4338ca; padding:2px 6px; border-radius:4px; font-size:0.65rem; font-weight:700;">TKJ Specialty</span>
          </div>
          <h4 style="font-size:0.85rem; font-weight:700; color:#1e293b; margin:4px 0 2px 0;">Sertifikasi Industri MikroTik MTCNA</h4>
          <p style="font-size:0.72rem; color:#64748b; margin:0;">Pelatihan dan sertifikasi jaringan internasional untuk kelas XI & XII TKJ.</p>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-left:4px solid #10b981; padding:10px 12px; border-radius:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.7rem; font-weight:700; color:#10b981;">10 - 15 November 2026</span>
            <span style="background:#dcfce7; color:#15803d; padding:2px 6px; border-radius:4px; font-size:0.65rem; font-weight:700;">UKK TKJ</span>
          </div>
          <h4 style="font-size:0.85rem; font-weight:700; color:#1e293b; margin:4px 0 2px 0;">Simulasi Uji Kompetensi Keahlian (UKK)</h4>
          <p style="font-size:0.72rem; color:#64748b; margin:0;">Uji praktikum Perakitan Server, Fiber Optic, dan Routing Cisco di Lab.</p>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-left:4px solid #f59e0b; padding:10px 12px; border-radius:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.7rem; font-weight:700; color:#d97706;">01 - 10 Desember 2026</span>
            <span style="background:#fef3c7; color:#b45309; padding:2px 6px; border-radius:4px; font-size:0.65rem; font-weight:700;">PAS Ganjil</span>
          </div>
          <h4 style="font-size:0.85rem; font-weight:700; color:#1e293b; margin:4px 0 2px 0;">Penilaian Akhir Semester (PAS) Ganjil</h4>
          <p style="font-size:0.72rem; color:#64748b; margin:0;">Evaluasi komprehensif semester ganjil tahun ajaran 2026/2027.</p>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-left:4px solid #ef4444; padding:10px 12px; border-radius:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.7rem; font-weight:700; color:#ef4444;">21 Des 2026 - 04 Jan 2027</span>
            <span style="background:#fee2e2; color:#991b1b; padding:2px 6px; border-radius:4px; font-size:0.65rem; font-weight:700;">Libur Semester</span>
          </div>
          <h4 style="font-size:0.85rem; font-weight:700; color:#1e293b; margin:4px 0 2px 0;">Libur Semester Ganjil & Tahun Baru</h4>
          <p style="font-size:0.72rem; color:#64748b; margin:0;">Masa libur sekolah siswa SMKN 6 Bandung.</p>
        </div>
      </div>
      <button class="btn-primary mt-4" style="width:100%; font-weight:700;" onclick="window.closeModal()">Tutup Kalender</button>
    `;
  } else if (type === 'galeriSiswa') {
    card.innerHTML = `
      <div class="modal-title" style="font-weight:800; font-size:1.1rem; color:#0f172a;">🖼️ Galeri & Prestasi Siswa TKJ</div>
      <p style="font-size:0.78rem; color:#64748b; margin-bottom:12px;">Showcase Karya, Praktikum Lab & Prestasi LKS:</p>
      
      <div style="max-height:300px; overflow-y:auto; display:flex; flex-direction:column; gap:10px; padding-right:4px;">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:12px; border-radius:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="background:#fef3c7; color:#b45309; font-weight:800; font-size:0.68rem; padding:2px 8px; border-radius:6px;">🏆 PRESTASI</span>
            <span style="font-size:0.7rem; color:#64748b;">LKS 2026</span>
          </div>
          <h4 style="font-size:0.88rem; font-weight:700; color:#0f172a; margin:0 0 4px 0;">🥇 Juara 1 LKS IT Network Systems Administration</h4>
          <p style="font-size:0.73rem; color:#475569; margin:0 0 6px 0;">Tim TKJ SMKN 6 berhasil meraih Medali Emas pada Lomba Kompetensi Siswa bidang Jaringan Komputer.</p>
          <span style="font-size:0.7rem; font-weight:600; color:#0284c7;">Oleh: Tim Siswa XI TKJ 1</span>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:12px; border-radius:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="background:#e0f2fe; color:#0369a1; font-weight:800; font-size:0.68rem; padding:2px 8px; border-radius:6px;">🛠️ PRAKTIKUM LAB</span>
            <span style="font-size:0.7rem; color:#64748b;">Lab TKJ 2</span>
          </div>
          <h4 style="font-size:0.88rem; font-weight:700; color:#0f172a; margin:0 0 4px 0;">🌐 Praktikum Fiber Optic Splicing & OTDR Test</h4>
          <p style="font-size:0.73rem; color:#475569; margin:0 0 6px 0;">Penyambungan kabel serat optik menggunakan Fusion Splicer dan pengukuran redaman sinyal.</p>
          <span style="font-size:0.7rem; font-weight:600; color:#0284c7;">Oleh: Kelompok 3 - 10 TKJ 1</span>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:12px; border-radius:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="background:#e0e7ff; color:#4338ca; font-weight:800; font-size:0.68rem; padding:2px 8px; border-radius:6px;">💻 PROJECT</span>
            <span style="font-size:0.7rem; color:#64748b;">Cloud Server</span>
          </div>
          <h4 style="font-size:0.88rem; font-weight:700; color:#0f172a; margin:0 0 4px 0;">🚀 Deployment Server Linux Debian & DNS Server</h4>
          <p style="font-size:0.73rem; color:#475569; margin:0 0 6px 0;">Konfigurasi Web Server Apache, MySQL Database, dan Virtual Host lokal sekolah.</p>
          <span style="font-size:0.7rem; font-weight:600; color:#0284c7;">Oleh: Siswa 10 TKJ 1</span>
        </div>
      </div>
      <button class="btn-primary mt-4" style="width:100%; font-weight:700;" onclick="window.closeModal()">Tutup Galeri Siswa</button>
    `;
  } else if (type === 'videoTKJ') {
    const newsList = store.state.broadcastNews || [];
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <div class="modal-title" style="font-weight:800; font-size:1.15rem; color:#0f172a; margin:0;">📺 Beranda Video TKJ</div>
        <span style="background:#e0f2fe; color:#0284c7; padding:3px 8px; border-radius:6px; font-size:0.7rem; font-weight:700;">${newsList.length} Video</span>
      </div>
      <p style="font-size:0.78rem; color:#64748b; margin-bottom:12px;">Kumpulan Pengumuman, Tutorial & Pembelajaran YouTube TKJ:</p>

      <div style="max-height:340px; overflow-y:auto; display:flex; flex-direction:column; gap:10px; padding-right:4px;">
        ${newsList.length === 0 ? `
          <div style="text-align:center; padding:24px; color:#64748b; font-size:0.8rem;">Belum ada video pengumuman terdaftar di Firebase.</div>
        ` : newsList.map((item, idx) => {
          const yt = getYouTubeDetails(item.url);
          const directUrl = (item.url && item.url.startsWith('http')) ? item.url : (yt.id ? `https://www.youtube.com/watch?v=${yt.id}` : '#');
          return `
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:10px; display:flex; gap:12px; align-items:center;">
              <div style="width:100px; height:60px; border-radius:8px; background:#0f172a; position:relative; overflow:hidden; flex-shrink:0; cursor:pointer;" onclick="window.playNewsVideoById('${item.id}', ${idx})">
                ${yt.thumbnailUrl ? `
                  <img src="${yt.thumbnailUrl}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'" />
                ` : ''}
                <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.3);">
                  <div style="width:26px; height:26px; border-radius:50%; background:rgba(255,255,255,0.9); color:#0b345e; display:flex; align-items:center; justify-content:center; font-size:0.7rem;">▶</div>
                </div>
              </div>

              <div style="flex:1; min-width:0;">
                <h4 style="font-size:0.84rem; font-weight:700; color:#1e293b; margin:0 0 4px 0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${item.title}">${item.title}</h4>
                <div style="display:flex; gap:6px; align-items:center;">
                  <button style="background:#0284c7; color:white; border:none; padding:4px 10px; border-radius:6px; font-size:0.7rem; font-weight:700; cursor:pointer;" onclick="window.playNewsVideoById('${item.id}', ${idx})">
                    ▶ Tonton
                  </button>
                  ${directUrl !== '#' ? `
                    <a href="${directUrl}" target="_blank" rel="noopener noreferrer" style="background:#dc2626; color:white; text-decoration:none; padding:4px 8px; border-radius:6px; font-size:0.68rem; font-weight:700;">
                      YouTube
                    </a>
                  ` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <button class="btn-primary mt-4" style="width:100%; font-weight:700;" onclick="window.closeModal()">Tutup Beranda Video</button>
    `;
  } else if (type === 'elibrary') {
    card.innerHTML = `
      <div class="modal-title" style="font-weight:800; font-size:1.15rem; color:#0f172a; margin-bottom:4px;">📚 E-Library & Buku Digital TKJ</div>
      <p style="font-size:0.78rem; color:#64748b; margin-bottom:14px;">Koleksi Modul Pembelajaran & E-Book Referensi Akademik:</p>

      <div style="max-height:320px; overflow-y:auto; display:flex; flex-direction:column; gap:10px; padding-right:4px;">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:12px; border-radius:12px; display:flex; gap:12px; align-items:center;">
          <div style="width:44px; height:54px; border-radius:8px; background:linear-gradient(135deg, #0284c7, #0369a1); color:white; display:flex; align-items:center; justify-content:center; font-size:1.5rem; flex-shrink:0; box-shadow:0 4px 10px rgba(2,132,199,0.2);">📘</div>
          <div style="flex:1; min-width:0;">
            <h4 style="font-size:0.88rem; font-weight:700; color:#0f172a; margin:0 0 2px 0;">Jaringan Dasar & Cisco Routing</h4>
            <p style="font-size:0.72rem; color:#64748b; margin:0 0 6px 0;">Modul praktikum konfigurasi Mikrotik, Cisco Packet Tracer & VLAN.</p>
            <button style="background:#0284c7; color:white; border:none; padding:4px 10px; border-radius:6px; font-size:0.7rem; font-weight:700; cursor:pointer;" onclick="window.showToast('📖 Membuka E-Book Jaringan Dasar...', 'success')">Baca Buku Digital</button>
          </div>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:12px; border-radius:12px; display:flex; gap:12px; align-items:center;">
          <div style="width:44px; height:54px; border-radius:8px; background:linear-gradient(135deg, #10b981, #047857); color:white; display:flex; align-items:center; justify-content:center; font-size:1.5rem; flex-shrink:0; box-shadow:0 4px 10px rgba(16,185,129,0.2);">📗</div>
          <div style="flex:1; min-width:0;">
            <h4 style="font-size:0.88rem; font-weight:700; color:#0f172a; margin:0 0 2px 0;">Administrasi System & Server Linux</h4>
            <p style="font-size:0.72rem; color:#64748b; margin:0 0 6px 0;">Panduan lengkap instalasi Debian, DNS Server, Web Server Apache & Nginx.</p>
            <button style="background:#10b981; color:white; border:none; padding:4px 10px; border-radius:6px; font-size:0.7rem; font-weight:700; cursor:pointer;" onclick="window.showToast('📖 Membuka E-Book Server Linux...', 'success')">Baca Buku Digital</button>
          </div>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:12px; border-radius:12px; display:flex; gap:12px; align-items:center;">
          <div style="width:44px; height:54px; border-radius:8px; background:linear-gradient(135deg, #6366f1, #4338ca); color:white; display:flex; align-items:center; justify-content:center; font-size:1.5rem; flex-shrink:0; box-shadow:0 4px 10px rgba(99,102,241,0.2);">📙</div>
          <div style="flex:1; min-width:0;">
            <h4 style="font-size:0.88rem; font-weight:700; color:#0f172a; margin:0 0 2px 0;">Cyber Security & Network Defense</h4>
            <p style="font-size:0.72rem; color:#64748b; margin:0 0 6px 0;">Dasar-dasar keamanan jaringan, Firewall, Penetration Testing & Enkripsi.</p>
            <button style="background:#6366f1; color:white; border:none; padding:4px 10px; border-radius:6px; font-size:0.7rem; font-weight:700; cursor:pointer;" onclick="window.showToast('📖 Membuka E-Book Cyber Security...', 'success')">Baca Buku Digital</button>
          </div>
        </div>
      </div>
      <button class="btn-primary mt-4" style="width:100%; font-weight:700;" onclick="window.closeModal()">Tutup E-Library</button>
    `;
  } else if (type === 'lainnya') {
    card.innerHTML = `
      <div class="modal-title" style="font-weight:800; font-size:1.15rem; color:#0f172a;">⚙️ Semua Fitur Aplikasi SMKN 6</div>
      <p style="font-size:0.78rem; color:#64748b; margin-bottom:14px;">Pilih fitur atau layanan digital yang ingin diakses:</p>

      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px; max-height:340px; overflow-y:auto; padding-right:4px;">
        <button style="padding:12px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; font-weight:700; font-size:0.78rem; color:#1e293b; cursor:pointer; display:flex; align-items:center; gap:8px; text-align:left; transition:all 0.2s;" onclick="window.closeModal(); window.switchSiswaTab('videotkj');">
          <span style="font-size:1.3rem;">📺</span>
          <div>
            <div>Video TKJ</div>
            <span style="font-size:0.68rem; font-weight:400; color:#64748b;">Beranda Video YT</span>
          </div>
        </button>

        <button style="padding:12px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; font-weight:700; font-size:0.78rem; color:#1e293b; cursor:pointer; display:flex; align-items:center; gap:8px; text-align:left; transition:all 0.2s;" onclick="window.closeModal(); window.switchSiswaTab('visimisi');">
          <span style="font-size:1.3rem;">🎯</span>
          <div>
            <div>Visi & Misi</div>
            <span style="font-size:0.68rem; font-weight:400; color:#64748b;">Profil & Tujuan TKJ</span>
          </div>
        </button>

        <button style="padding:12px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; font-weight:700; font-size:0.78rem; color:#1e293b; cursor:pointer; display:flex; align-items:center; gap:8px; text-align:left; transition:all 0.2s;" onclick="window.closeModal(); window.switchSiswaTab('gurutkj');">
          <span style="font-size:1.3rem;">👨‍🏫</span>
          <div>
            <div>Guru TKJ</div>
            <span style="font-size:0.68rem; font-weight:400; color:#64748b;">Daftar Pengajar</span>
          </div>
        </button>

        <button style="padding:12px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; font-weight:700; font-size:0.78rem; color:#1e293b; cursor:pointer; display:flex; align-items:center; gap:8px; text-align:left; transition:all 0.2s;" onclick="window.closeModal(); window.switchSiswaTab('totalsiswa');">
          <span style="font-size:1.3rem;">👥</span>
          <div>
            <div>Total Siswa</div>
            <span style="font-size:0.68rem; font-weight:400; color:#64748b;">Rekap Database</span>
          </div>
        </button>

        <button style="padding:12px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; font-weight:700; font-size:0.78rem; color:#1e293b; cursor:pointer; display:flex; align-items:center; gap:8px; text-align:left; transition:all 0.2s;" onclick="window.closeModal(); window.switchSiswaTab('kalender');">
          <span style="font-size:1.3rem;">📅</span>
          <div>
            <div>Kalender</div>
            <span style="font-size:0.68rem; font-weight:400; color:#64748b;">Agenda Sekolah</span>
          </div>
        </button>

        <button style="padding:12px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; font-weight:700; font-size:0.78rem; color:#1e293b; cursor:pointer; display:flex; align-items:center; gap:8px; text-align:left; transition:all 0.2s;" onclick="window.closeModal(); window.switchSiswaTab('galerisiswa');">
          <span style="font-size:1.3rem;">🖼️</span>
          <div>
            <div>Galeri Siswa</div>
            <span style="font-size:0.68rem; font-weight:400; color:#64748b;">Karya & Prestasi</span>
          </div>
        </button>

        <button style="padding:12px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; font-weight:700; font-size:0.78rem; color:#1e293b; cursor:pointer; display:flex; align-items:center; gap:8px; text-align:left; transition:all 0.2s;" onclick="window.closeModal(); window.switchSiswaTab('library');">
          <span style="font-size:1.3rem;">📚</span>
          <div>
            <div>E-Library</div>
            <span style="font-size:0.68rem; font-weight:400; color:#64748b;">Buku Digital</span>
          </div>
        </button>

        <button style="padding:12px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; font-weight:700; font-size:0.78rem; color:#1e293b; cursor:pointer; display:flex; align-items:center; gap:8px; text-align:left; transition:all 0.2s;" onclick="window.closeModal(); window.switchSiswaTab('pelajaran');">
          <span style="font-size:1.3rem;">📊</span>
          <div>
            <div>Nilai Siswa</div>
            <span style="font-size:0.68rem; font-weight:400; color:#64748b;">Jadwal & Rekap</span>
          </div>
        </button>

        <button style="padding:12px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; font-weight:700; font-size:0.78rem; color:#1e293b; cursor:pointer; display:flex; align-items:center; gap:8px; text-align:left; transition:all 0.2s;" onclick="window.closeModal(); window.switchSiswaTab('scan');">
          <span style="font-size:1.3rem;">📸</span>
          <div>
            <div>Presensi</div>
            <span style="font-size:0.68rem; font-weight:400; color:#64748b;">Scan QR Presensi</span>
          </div>
        </button>

        <button style="padding:12px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; font-weight:700; font-size:0.78rem; color:#1e293b; cursor:pointer; display:flex; align-items:center; gap:8px; text-align:left; transition:all 0.2s;" onclick="window.closeModal(); window.openSiswaModal('survey');">
          <span style="font-size:1.3rem;">📋</span>
          <div>
            <div>Survey</div>
            <span style="font-size:0.68rem; font-weight:400; color:#64748b;">Evaluasi Pembelajaran</span>
          </div>
        </button>
      </div>
      <button class="btn-primary mt-4" style="width:100%; font-weight:700;" onclick="window.closeModal()">Tutup</button>
    `;
  }

  overlay.classList.add('open');
};

window.openAdminModal = function(type) {
  const overlay = document.getElementById('globalModal');
  const card = document.getElementById('modalCardContent');

  if (type === 'tambahGuru') {
    card.innerHTML = `
      <div class="modal-title">👨‍🏫 Tambah Guru Baru</div>
      <form onsubmit="window.handleCreateTeacher(event)">
        <div class="form-group">
          <label class="form-label">Nama Lengkap</label>
          <input type="text" id="tName" class="form-input" placeholder="Contoh: Budi Santoso, S.Kom" required />
        </div>
        <div class="form-group">
          <label class="form-label">Username Akun</label>
          <input type="text" id="tUser" class="form-input" placeholder="Username untuk login" required />
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" id="tPass" class="form-input" placeholder="Password" required />
        </div>
        <div class="form-group">
          <label class="form-label">Keahlian Mata Pelajaran</label>
          <select class="form-select" id="tMapel">
            <option>MTK</option>
            <option>Bahasa Indonesia</option>
            <option>Produktif TKJ</option>
          </select>
        </div>
        <button type="submit" class="btn-primary mt-4">Simpan Guru Baru</button>
      </form>
    `;
  } else if (type === 'tambahKelas') {
    card.innerHTML = `
      <div class="modal-title text-center">Tambah Kelas Baru</div>
      <p style="font-size:0.85rem; text-align:center; color:#64748b; margin-bottom:16px;">Konfirmasi tambahkan kelas 10 TKJ 2 ke sistem?</p>
      <div style="display:flex; gap:10px;">
        <button style="flex:1; padding:10px; background:#f1f5f9; border:none; border-radius:8px; font-weight:600; cursor:pointer;" onclick="window.closeModal()">Batal</button>
        <button style="flex:1; padding:10px; background:#0b345e; color:white; border:none; border-radius:8px; font-weight:600; cursor:pointer;" onclick="store.addClass('10 TKJ 2', 10); window.showToast('Kelas 10 TKJ 2 berhasil ditambahkan!', 'success'); window.closeModal();">Ya, Tambahkan</button>
      </div>
    `;
  }

  overlay.classList.add('open');
};

window.handleCreateTeacher = function(e) {
  e.preventDefault();
  const name = document.getElementById('tName').value;
  const username = document.getElementById('tUser').value;
  const mapel = document.getElementById('tMapel').value;

  store.addTeacher({ name, username, mapel });
  window.showToast(`👨‍🏫 Guru ${name} berhasil ditambahkan!`, 'success');
  window.closeModal();
};

window.editNewsVideoModal = function(id) {
  const news = (store.state.broadcastNews || []).find(n => String(n.id) === String(id));
  if (!news) return;

  const overlay = document.getElementById('globalModal');
  const card = document.getElementById('modalCardContent');

  card.innerHTML = `
    <div class="modal-title">✏️ Edit Video News</div>
    <form onsubmit="window.handleEditNewsVideo(event, '${id}')">
      <div class="form-group">
        <label class="form-label">Judul Pengumuman</label>
        <input type="text" id="editNewsTitle" class="form-input" value="${(news.title || '').replace(/"/g, '&quot;')}" required />
      </div>
      <div class="form-group">
        <label class="form-label">Link YouTube Video</label>
        <input type="text" id="editNewsUrl" class="form-input" value="${(news.url || '').replace(/"/g, '&quot;')}" required />
      </div>
      <div style="display:flex; gap:10px; margin-top:16px;">
        <button type="button" class="btn-primary" style="flex:1; background:#64748b;" onclick="window.closeModal()">Batal</button>
        <button type="submit" class="btn-primary" style="flex:1;">Simpan Perubahan</button>
      </div>
    </form>
  `;
  overlay.classList.add('open');
};

window.handleEditNewsVideo = function(e, id) {
  e.preventDefault();
  const title = document.getElementById('editNewsTitle').value.trim();
  const url = document.getElementById('editNewsUrl').value.trim();
  store.updateNews(id, title, url);
  window.showToast('Video News berhasil diperbarui!', 'success');
  window.closeModal();
};

/* Drag and Drop Handlers for Video Reordering */
let draggedNewsIndex = null;

window.handleNewsDragStart = function(e, index) {
  draggedNewsIndex = index;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  }
  const card = e.currentTarget;
  card.classList.add('dragging');
};

window.handleNewsDragOver = function(e, index) {
  e.preventDefault();
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move';
  }
  const card = e.currentTarget;
  if (draggedNewsIndex !== null && draggedNewsIndex !== index) {
    card.classList.add('drag-over');
  }
};

window.handleNewsDragLeave = function(e) {
  const card = e.currentTarget;
  card.classList.remove('drag-over');
};

window.handleNewsDrop = function(e, targetIndex) {
  e.preventDefault();
  const card = e.currentTarget;
  card.classList.remove('drag-over');

  if (draggedNewsIndex !== null && draggedNewsIndex !== targetIndex) {
    const list = store.state.broadcastNews;
    const [movedItem] = list.splice(draggedNewsIndex, 1);
    list.splice(targetIndex, 0, movedItem);
    store.saveState();
    window.showToast('✨ Urutan video berhasil diperbarui!', 'success');
  }
  draggedNewsIndex = null;
};

window.handleNewsDragEnd = function(e) {
  const card = e.currentTarget;
  card.classList.remove('dragging');
  document.querySelectorAll('.video-drag-item').forEach(el => el.classList.remove('drag-over', 'dragging'));
  draggedNewsIndex = null;
};

window.moveNewsUp = function(index) {
  store.moveNews(index, 'up');
  window.showToast('Urutan video dipindah ke atas ⬆️', 'info');
};

window.moveNewsDown = function(index) {
  store.moveNews(index, 'down');
  window.showToast('Urutan video dipindah ke bawah ⬇️', 'info');
};

window.deleteNews = function(id) {
  if (confirm('Hapus video pengumuman ini?')) {
    store.deleteNews(id);
    window.showToast('Video pengumuman berhasil dihapus.', 'info');
  }
};

window.deleteTeacher = function(id, name) {
  if (confirm(`Hapus pengajar ${name || ''}?`)) {
    store.deleteTeacher(id);
    window.showToast('Pengajar berhasil dihapus.', 'info');
  }
};

window.deleteMapel = function(id, name) {
  if (confirm(`Hapus mata pelajaran ${name || ''}?`)) {
    store.deleteMapel(id);
    window.showToast('Mata pelajaran berhasil dihapus.', 'info');
  }
};

window.deleteStudent = function(id, name) {
  if (confirm(`Hapus siswa ${name || ''}?`)) {
    store.deleteStudent(id);
    window.showToast('Siswa berhasil dihapus.', 'info');
  }
};

window.deleteSchedule = function(id, mapel) {
  if (confirm(`Hapus jadwal ${mapel || ''}?`)) {
    store.deleteSchedule(id);
    window.showToast('Jadwal berhasil dihapus.', 'info');
  }
};

window.editTeacherModal = function(id) {
  const teacher = (store.state.teachers || []).find(t => String(t.id) === String(id));
  if (!teacher) return;

  const overlay = document.getElementById('globalModal');
  const card = document.getElementById('modalCardContent');
  const mapelOptions = (store.state.mapel || []).map(m => m.name);

  card.innerHTML = `
    <div class="modal-title">✏️ Edit Data Guru</div>
    <form onsubmit="window.handleEditTeacher(event, '${id}')">
      <div class="form-group">
        <label class="form-label">Nama Lengkap</label>
        <input type="text" id="editTName" class="form-input" value="${(teacher.name || '').replace(/"/g, '&quot;')}" required />
      </div>
      <div class="form-group">
        <label class="form-label">Username Akun</label>
        <input type="text" id="editTUser" class="form-input" value="${(teacher.username || '').replace(/"/g, '&quot;')}" required />
      </div>
      <div class="form-group">
        <label class="form-label">Mata Pelajaran</label>
        <select class="form-select" id="editTMapel">
          ${mapelOptions.map(m => `<option value="${m}" ${m === teacher.mapel ? 'selected' : ''}>${m}</option>`).join('')}
        </select>
      </div>
      <div style="display:flex; gap:10px; margin-top:16px;">
        <button type="button" class="btn-primary" style="flex:1; background:#64748b;" onclick="window.closeModal()">Batal</button>
        <button type="submit" class="btn-primary" style="flex:1;">Simpan Perubahan</button>
      </div>
    </form>
  `;
  overlay.classList.add('open');
};

window.handleEditTeacher = function(e, id) {
  e.preventDefault();
  const name = document.getElementById('editTName').value.trim();
  const username = document.getElementById('editTUser').value.trim();
  const mapel = document.getElementById('editTMapel').value;

  store.updateTeacher(id, name, username, mapel);
  window.showToast(`Data guru ${name} berhasil diperbarui!`, 'success');
  window.closeModal();
};

window.editMapelModal = function(id) {
  const item = (store.state.mapel || []).find(m => String(m.id) === String(id));
  if (!item) return;

  const overlay = document.getElementById('globalModal');
  const card = document.getElementById('modalCardContent');

  card.innerHTML = `
    <div class="modal-title">✏️ Edit Mata Pelajaran</div>
    <form onsubmit="window.handleEditMapel(event, '${id}')">
      <div class="form-group">
        <label class="form-label">Nama Mata Pelajaran</label>
        <input type="text" id="editMName" class="form-input" value="${(item.name || '').replace(/"/g, '&quot;')}" required />
      </div>
      <div style="display:flex; gap:10px; margin-top:16px;">
        <button type="button" class="btn-primary" style="flex:1; background:#64748b;" onclick="window.closeModal()">Batal</button>
        <button type="submit" class="btn-primary" style="flex:1;">Simpan Perubahan</button>
      </div>
    </form>
  `;
  overlay.classList.add('open');
};

window.handleEditMapel = function(e, id) {
  e.preventDefault();
  const name = document.getElementById('editMName').value.trim();
  store.updateMapel(id, name);
  window.showToast(`Mata pelajaran ${name} berhasil diperbarui!`, 'success');
  window.closeModal();
};

window.addStudentModal = function(className) {
  const overlay = document.getElementById('globalModal');
  const card = document.getElementById('modalCardContent');

  card.innerHTML = `
    <div class="modal-title">👥 Tambah Siswa Baru</div>
    <form onsubmit="window.handleAddStudent(event)">
      <div class="form-group">
        <label class="form-label">Nama Lengkap Siswa</label>
        <input type="text" id="addStName" class="form-input" placeholder="Nama Siswa" required />
      </div>
      <div class="form-group">
        <label class="form-label">NIS / NISN</label>
        <input type="text" id="addStNis" class="form-input" placeholder="Nomor Induk Siswa" required />
      </div>
      <div class="form-group">
        <label class="form-label">Kelas</label>
        <input type="text" id="addStClass" class="form-input" value="${className || '10 TKJ 1'}" required />
      </div>
      <div style="display:flex; gap:10px; margin-top:16px;">
        <button type="button" class="btn-primary" style="flex:1; background:#64748b;" onclick="window.closeModal()">Batal</button>
        <button type="submit" class="btn-primary" style="flex:1;">Simpan Siswa</button>
      </div>
    </form>
  `;
  overlay.classList.add('open');
};

window.handleAddStudent = function(e) {
  e.preventDefault();
  const name = document.getElementById('addStName').value.trim();
  const nis = document.getElementById('addStNis').value.trim();
  const className = document.getElementById('addStClass').value.trim();

  store.addStudent({ name, nis, class: className });
  window.showToast(`Siswa ${name} berhasil ditambahkan!`, 'success');
  window.closeModal();
};

window.editStudentModal = function(id) {
  const student = (store.state.students || []).find(s => String(s.id) === String(id) || String(s.nis) === String(id));
  if (!student) return;

  const overlay = document.getElementById('globalModal');
  const card = document.getElementById('modalCardContent');

  card.innerHTML = `
    <div class="modal-title">✏️ Edit Data Siswa</div>
    <form onsubmit="window.handleEditStudent(event, '${id}')">
      <div class="form-group">
        <label class="form-label">Nama Lengkap Siswa</label>
        <input type="text" id="editStName" class="form-input" value="${(student.name || '').replace(/"/g, '&quot;')}" required />
      </div>
      <div class="form-group">
        <label class="form-label">NIS / NISN</label>
        <input type="text" id="editStNis" class="form-input" value="${(student.nis || '').replace(/"/g, '&quot;')}" required />
      </div>
      <div class="form-group">
        <label class="form-label">Kelas</label>
        <input type="text" id="editStClass" class="form-input" value="${(student.class || '10 TKJ 1').replace(/"/g, '&quot;')}" required />
      </div>
      <div style="display:flex; gap:10px; margin-top:16px;">
        <button type="button" class="btn-primary" style="flex:1; background:#64748b;" onclick="window.closeModal()">Batal</button>
        <button type="submit" class="btn-primary" style="flex:1;">Simpan Perubahan</button>
      </div>
    </form>
  `;
  overlay.classList.add('open');
};

window.handleEditStudent = function(e, id) {
  e.preventDefault();
  const name = document.getElementById('editStName').value.trim();
  const nis = document.getElementById('editStNis').value.trim();
  const className = document.getElementById('editStClass').value.trim();

  store.updateStudent(id, name, nis, className);
  window.showToast(`Data siswa ${name} berhasil diperbarui!`, 'success');
  window.closeModal();
};

window.editScheduleModal = function(id) {
  const sched = (store.state.schedules || []).find(s => String(s.id) === String(id));
  if (!sched) return;

  const overlay = document.getElementById('globalModal');
  const card = document.getElementById('modalCardContent');
  const mapelList = store.state.mapel || [];
  const teachersList = store.state.teachers || [];

  const timeParts = (sched.waktu || '07:30 - 11:30').split('-').map(t => t.trim());
  const startTime = timeParts[0] || '07:30';
  const endTime = timeParts[1] || '11:30';

  card.innerHTML = `
    <div class="modal-title">✏️ Edit Jadwal Pelajaran</div>
    <form onsubmit="window.handleEditSchedule(event, '${id}')">
      <div class="form-group">
        <label class="form-label">Mata Pelajaran</label>
        <select class="form-select" id="editSchedMapel" required>
          ${mapelList.map(m => `<option value="${m.name}" ${m.name === sched.mapel ? 'selected' : ''}>${m.name}</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Guru Pengajar</label>
        <select class="form-select" id="editSchedGuru" required>
          ${teachersList.map(t => `<option value="${t.name}" ${t.name === sched.guru ? 'selected' : ''}>${t.name}</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Ruangan</label>
        <input type="text" id="editSchedRuangan" class="form-input" value="${(sched.ruangan || 'Lab TKJ').replace(/"/g, '&quot;')}" required />
      </div>

      <div class="form-group">
        <label class="form-label">Hari</label>
        <select class="form-select" id="editSchedHari">
          ${['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map(h => `<option value="${h}" ${h === sched.hari ? 'selected' : ''}>${h}</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Waktu Belajar</label>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
          <input type="text" id="editSchedStart" class="form-input" value="${startTime}" placeholder="Mulai" />
          <input type="text" id="editSchedEnd" class="form-input" value="${endTime}" placeholder="Selesai" />
        </div>
      </div>

      <div style="display:flex; gap:10px; margin-top:16px;">
        <button type="button" class="btn-primary" style="flex:1; background:#64748b;" onclick="window.closeModal()">Batal</button>
        <button type="submit" class="btn-primary" style="flex:1;">Simpan Perubahan</button>
      </div>
    </form>
  `;
  overlay.classList.add('open');
};

window.handleEditSchedule = function(e, id) {
  e.preventDefault();
  const mapel = document.getElementById('editSchedMapel').value;
  const guru = document.getElementById('editSchedGuru').value;
  const ruangan = document.getElementById('editSchedRuangan').value.trim();
  const hari = document.getElementById('editSchedHari').value;
  const start = document.getElementById('editSchedStart').value.trim();
  const end = document.getElementById('editSchedEnd').value.trim();

  store.updateSchedule(id, {
    mapel,
    guru,
    ruangan,
    hari,
    waktu: `${start} - ${end}`
  });

  window.showToast(`Jadwal ${mapel} berhasil diperbarui!`, 'success');
  window.closeModal();
};

window.playNewsVideo = function(title, url) {
  const overlay = document.getElementById('globalModal');
  const card = document.getElementById('modalCardContent');
  
  const yt = getYouTubeDetails(url);
  const directUrl = (url && url.startsWith('http')) ? url : (yt.id ? `https://www.youtube.com/watch?v=${yt.id}` : '#');

  card.innerHTML = `
    <div class="modal-title" style="font-weight:700; font-size:1.05rem; margin-bottom:12px; color:#1e293b;">▶ ${title}</div>
    ${yt.embedUrl ? `
      <div style="position:relative; width:100%; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:12px; background:#000; box-shadow:0 8px 24px rgba(0,0,0,0.25);">
        <iframe
          src="${yt.embedUrl}"
          title="${title}"
          style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    ` : `
      <div class="news-video-frame" style="display:flex; align-items:center; justify-content:center; color:white; padding:20px; text-align:center; box-sizing:border-box;">
        Video YouTube tidak dapat diputar di iframe.
      </div>
    `}
    
    <div style="display:flex; gap:10px; margin-top:14px;">
      ${directUrl !== '#' ? `
        <a href="${directUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="flex:1; text-align:center; text-decoration:none; background:#dc2626; color:white; font-weight:700; font-size:0.8rem; padding:10px 14px; border-radius:8px;">
          🔴 Buka di YouTube
        </a>
      ` : ''}
      <button class="btn-primary" style="flex:1; font-weight:700; background:#475569; font-size:0.8rem; padding:10px 14px; border-radius:8px;" onclick="window.closeModal()">
        Tutup Video
      </button>
    </div>
  `;
  overlay.classList.add('open');
};

window.playNewsVideoById = function(id, index) {
  const newsList = store.state.broadcastNews || [];
  let item = newsList.find(n => String(n.id) === String(id));

  if (!item && typeof index === 'number' && newsList[index]) {
    item = newsList[index];
  }

  if (!item && typeof id === 'number' && newsList[id]) {
    item = newsList[id];
  }

  if (item) {
    window.playNewsVideo(item.title || 'Pengumuman TKJ', item.url);
  } else if (typeof index === 'number' && newsList[index]) {
    window.playNewsVideo(newsList[index].title || 'Pengumuman TKJ', newsList[index].url);
  } else if (newsList.length > 0) {
    window.playNewsVideo(newsList[0].title || 'Pengumuman TKJ', newsList[0].url);
  } else {
    window.showToast('Video pengumuman tidak ditemukan.', 'warning');
  }
};

// Global Event Listener for TKJ News Cards
if (!window._newsCardClickListenerAttached) {
  window._newsCardClickListenerAttached = true;
  document.addEventListener('click', function(e) {
    const card = e.target.closest('.news-card-item');
    if (card) {
      const idxAttr = card.getAttribute('data-index');
      if (idxAttr !== null && idxAttr !== undefined) {
        const idx = parseInt(idxAttr, 10);
        const newsList = store.state.broadcastNews || [];
        const item = newsList[idx];
        if (item) {
          window.playNewsVideo(item.title || 'Pengumuman TKJ', item.url);
        }
      }
    }
  });
}

window.closeModal = function() {
  document.getElementById('globalModal').classList.remove('open');
};

window.toggleBiometric = function(checked) {
  store.state.biometricEnabled = checked;
  store.saveState();
  window.showToast(`Login Biometrik ${checked ? 'Diaktifkan 🔒' : 'Dinonaktifkan 🔓'}`, 'info');
};

window.toggleThemeMode = function(checked) {
  const newTheme = checked ? 'dark' : 'light';
  store.setThemeMode(newTheme);
  window.showToast(`Tema ${checked ? 'Mode Gelap 🌙' : 'Mode Terang ☀️'} Diaktifkan!`, 'info');
};

let renderScheduledTimer = null;
function scheduleRenderApp() {
  if (renderScheduledTimer) clearTimeout(renderScheduledTimer);
  renderScheduledTimer = setTimeout(() => {
    requestAnimationFrame(() => {
      renderApp();
      renderScheduledTimer = null;
    });
  }, 20);
}

window.syncFirebase = function() {
  store.seedDatabaseToFirebase();
};

// Initialize App with debounced scheduler
store.subscribe(scheduleRenderApp);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleRenderApp);
} else {
  scheduleRenderApp();
}
