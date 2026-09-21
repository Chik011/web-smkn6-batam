/* Central Store with LocalStorage Persistence, Firebase Real-Time Sync & Supabase Hybrid Sync */
import { 
  db, 
  isFirebaseConnected, 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  deleteDoc, 
  getDocs, 
  serverTimestamp 
} from './firebase.js';
import { supabase, getYouTubeDetails } from './supabase.js';

const STORAGE_KEY = 'SMKN6_APP_DATA_V3';
const SESSION_KEY = 'SMKN6_SESSION_DATA_V1';

const legacyContentSeeds = {kalenderAgendas: [
    { id: '1', date: '15 - 20 September 2026', tag: 'PTS', title: 'Penilaian Tengah Semester Ganjil', desc: 'Pelaksanaan PTS Ganjil untuk seluruh siswa kelas X, XI, dan XII TKJ.', color: '#0284c7', bg: '#e0f2fe' },
    { id: '2', date: '05 - 12 Oktober 2026', tag: 'Sertifikasi', title: 'Uji Sertifikasi Kompetensi Mikrotik MTCNA', desc: 'Pelaksanaan sertifikasi internasional jaringan Mikrotik untuk siswa tingkat akhir.', color: '#6366f1', bg: '#e0e7ff' },
    { id: '3', date: '10 - 15 November 2026', tag: 'UKK TKJ', title: 'Pra-Uji Kompetensi Keahlian (UKK)', desc: 'Simulasi perakitan jaringan, routing, dan instalasi server.', color: '#10b981', bg: '#dcfce7' },
    { id: '4', date: '01 - 10 Desember 2026', tag: 'PAS Ganjil', title: 'Penilaian Akhir Semester (PAS)', desc: 'Ujian akhir semester ganjil tahun ajaran 2026/2027.', color: '#f59e0b', bg: '#fef3c7' }
  ],
elibraryBooks: [
    { id: '1', title: 'Jaringan Dasar & Cisco Routing', category: 'Modular TKJ', desc: 'Modul praktikum konfigurasi Mikrotik, Cisco Packet Tracer & VLAN.', color: '#0284c7', icon: '📘' },
    { id: '2', title: 'Administrasi System & Server Linux', category: 'Server & Cloud', desc: 'Panduan lengkap instalasi Debian, DNS Server, Web Server Apache & Nginx.', color: '#10b981', icon: '📗' },
    { id: '3', title: 'Cyber Security & Network Defense', category: 'Security', desc: 'Dasar-dasar keamanan jaringan, Firewall, Penetration Testing & Enkripsi.', color: '#6366f1', icon: '📙' }
  ]};
function cleanContentCache(items, key) {
 return (Array.isArray(items) ? items : []).filter(item => !legacyContentSeeds[key].some(seed => Object.entries(seed).every(([field, value]) => item[field] === value)));
}
const defaultState = {
  isLoggedIn: false,
  activeRole: 'siswa', // 'siswa', 'guru', 'admin'
  activeViewMode: 'desktop', // 'desktop' or 'grid'
  
  // Current logged in user details per role
  currentUser: {
    siswa: { id: '1', name: 'Siswa', nis: '123456789', class: '10 TKJ 1' },
    guru: { id: '1', name: 'Guru TKJ', username: 'guru', mapel: 'MTK' },
    admin: { username: 'admin', lastUpdate: '2026-08-12' },
    guest: { id: 'guest', name: 'Tamu / Pengunjung', role: 'guest' }
  },

  // Students Database
  students: [
    { id: '1', name: 'Siswa Demo TKJ', nis: '123456789', class: '10 TKJ 1', role: 'siswa' },
    { id: '2', name: 'tes', nis: 'tes', class: '10 TKJ 1', role: 'siswa' },
    { id: '3', name: 'tes2', nis: 'tes2', class: '10 TKJ 1', role: 'siswa' }
  ],

  // Teachers Database
  teachers: [
    { id: '1', name: 'Budi Santoso, S.Kom', username: 'budi', nip: '198501012010011001', mapel: 'Teknologi Jaringan Berbasis Luas (WAN)' },
    { id: '2', name: 'Siti Rahmawati, S.Pd', username: 'siti', nip: '198803152012012002', mapel: 'Administrasi Infrastruktur Jaringan (AIJ)' },
    { id: '3', name: 'Hendra Gunawan, M.T', username: 'hendra', nip: '197906202008011003', mapel: 'Administrasi Server & Cloud Computing' },
    { id: '4', name: 'Rina Marlina, S.Kom', username: 'rina', nip: '199209102015022004', mapel: 'Dasar Pemrograman & Jaringan Dasar' }
  ],

  // Subjects List
  mapel: [
    { id: '1', name: 'Jaringan Komputer & WAN', code: 'TKJ-WAN', teacher: 'Budi Santoso, S.Kom' },
    { id: '2', name: 'Administrasi Infrastruktur Jaringan (AIJ)', code: 'TKJ-AIJ', teacher: 'Siti Rahmawati, S.Pd' },
    { id: '3', name: 'Administrasi Server & Cloud', code: 'TKJ-ASJ', teacher: 'Hendra Gunawan, M.T' },
    { id: '4', name: 'Cyber Security & Network Defense', code: 'TKJ-SEC', teacher: 'Hendra Gunawan, M.T' },
    { id: '5', name: 'Dasar Pemrograman & Jaringan Dasar', code: 'TKJ-DASAR', teacher: 'Rina Marlina, S.Kom' },
    { id: '6', name: 'Fiber Optic & Splicing', code: 'TKJ-FO', teacher: 'Budi Santoso, S.Kom' }
  ],

  // Classes Database
  classes: ['10 TKJ 1', '10 TKJ 2', '11 TKJ 1', '11 TKJ 2', '12 TKJ 1', '12 TKJ 2'],

  // Schedules Database (Senin - Jumat)
  schedules: [
    { id: '1', class: '10 TKJ 1', hari: 'Senin', mapel: 'Jaringan Komputer & WAN', guru: 'Budi Santoso, S.Kom', ruangan: 'Lab Jaringan 1', waktu: '07:30 - 09:30 WIB' },
    { id: '2', class: '10 TKJ 1', hari: 'Senin', mapel: 'Dasar Pemrograman & Jaringan Dasar', guru: 'Rina Marlina, S.Kom', ruangan: 'Lab Komputer 2', waktu: '10:00 - 12:00 WIB' },
    { id: '3', class: '10 TKJ 1', hari: 'Selasa', mapel: 'Administrasi Server & Cloud', guru: 'Hendra Gunawan, M.T', ruangan: 'Lab Server', waktu: '07:30 - 10:00 WIB' },
    { id: '4', class: '10 TKJ 1', hari: 'Rabu', mapel: 'Administrasi Infrastruktur Jaringan (AIJ)', guru: 'Siti Rahmawati, S.Pd', ruangan: 'Lab Jaringan 2', waktu: '08:00 - 10:30 WIB' },
    { id: '5', class: '10 TKJ 1', hari: 'Kamis', mapel: 'Fiber Optic & Splicing', guru: 'Budi Santoso, S.Kom', ruangan: 'Lab Fiber Optic', waktu: '07:30 - 10:00 WIB' },
    { id: '6', class: '10 TKJ 1', hari: 'Jumat', mapel: 'Cyber Security & Network Defense', guru: 'Hendra Gunawan, M.T', ruangan: 'Lab Cyber Defense', waktu: '07:30 - 09:30 WIB' }
  ],

  // Attendance Records
  attendance: [],

  // Grades Database
  grades: [],

  // News & Video Broadcasts (TKJ News)
  broadcastNews: [],

  // Active Tabs per role
  activeTabs: {
    siswa: 'home',   // 'home', 'pelajaran', 'scan', 'notifikasi', 'akun'
    guru: 'beranda', // 'beranda', 'absensi', 'nilai', 'profil'
    admin: 'home',   // 'home', 'guru', 'mapel', 'siswa', 'jadwal', 'setting'
    guest: 'home'    // 'home', 'galeri', 'kalender', 'videotkj'
  },

  // Sub tab filters
  guruSubTab: {
    absensi: 'input', // 'input' or 'riwayat'
    nilai: 'pertemuan' // 'pertemuan' or 'rekap'
  },

  // Admin active sub-view
  adminSubView: {
    siswa: 'level', // 'level', 'rooms', 'menu', 'roster'
    selectedLevel: 10,
    selectedClass: '10 TKJ 1',
    jadwal: 'level', // 'level', 'list', 'create'
    selectedJadwalLevel: 10
  },

  // Visi Misi Content
  visiMisi: {
    visi: "Menjadi Program Keahlian Teknik Komputer dan Jaringan yang unggul, berkarakter, dan berdaya saing global.",
    misi: [
      "Menyelenggarakan pendidikan kejuruan berkualitas berbasis industri.",
      "Membentuk lulusan yang kompeten, berakhlak mulia, dan siap kerja.",
      "Mengembangkan inovasi dan teknologi jaringan terkini.",
      "Meningkatkan kemitraan strategis dengan dunia usaha dan industri."
    ]
  },

  // Galeri Siswa Database
  galeriItems: [
    { id: '1', title: 'Juara 1 LKS Network Administration', category: '🏆 PRESTASI', tagColor: '#b45309', tagBg: '#fef3c7', imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80', subtitle: 'Tim Siswa TKJ SMKN 6 Batam berhasil meraih Medali Emas LKS.' },
    { id: '2', title: 'Praktikum Fiber Optic Splicing', category: '🛠️ PRAKTIKUM', tagColor: '#0369a1', tagBg: '#e0f2fe', imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80', subtitle: 'Penyambungan kabel serat optik menggunakan Fusion Splicer.' },
    { id: '3', title: 'Deployment Server Linux Debian', category: '💻 PROJECT', tagColor: '#4338ca', tagBg: '#e0e7ff', imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', subtitle: 'Konfigurasi Web Server, DNS, dan Virtual Host Debian Server.' },
    { id: '4', title: 'Konfigurasi Mikrotik RouterOS', category: '🌐 JARINGAN', tagColor: '#15803d', tagBg: '#dcfce7', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80', subtitle: 'Simulasi routing, VLAN, dan Bandwidth Management Mikrotik.' },
    { id: '5', title: 'Workshop Cyber Security & Defense', category: '⚡ WORKSHOP', tagColor: '#9333ea', tagBg: '#faf5ff', imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', subtitle: 'Pelatihan dasar keamanan jaringan, firewall & pencegahan serangan.' },
    { id: '6', title: 'Perakitan & Trouble-shooting PC Lab', category: '🖥️ HARDWARE', tagColor: '#0d9488', tagBg: '#ccfbf1', imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80', subtitle: 'Praktikum perakitan komputer hardware dan instalasi sistem.' }
  ],

  // Kalender Agenda Database
  kalenderAgendas: [],

  // E-Library Database
  elibraryBooks: [],

  biometricEnabled: false,
  themeMode: 'light',
  cloudinaryCloudName: 'w7kqjyeq',
  cloudinaryApiKey: '846878589789137',
  cloudinaryApiSecret: 'wO2xbdOJDFMCRc9ZvoADPrVBvOU'
};

class Store {
  constructor() {
    this.listeners = [];
    this.isSyncingWithFirebase = false;
    this.loadState();
    this.applyTheme();
    this.initFirebaseSync();
    this.initSupabaseSync();
  }

  setCloudinaryCloudName(name) {
    this.state.cloudinaryCloudName = (name || '').trim();
    this.saveState();
  }

  setThemeMode(theme) {
    this.state.themeMode = theme === 'dark' ? 'dark' : 'light';
    this.applyTheme();
    this.saveStateToLocalStorage();
    this.notify();
  }

  applyTheme() {
    const theme = (this.state && this.state.themeMode) ? this.state.themeMode : 'light';
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.documentElement.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }

  initFirebaseSync() {
    if (!isFirebaseConnected || !db) return;

    try {
      // 1. Sync central state document
      const stateRef = doc(db, 'smkn6', 'app_state');
      onSnapshot(stateRef, (docSnap) => {
        if (docSnap.exists()) {
          const remoteData = docSnap.data();
          const {
            students,
            teachers,
            attendance,
            classes,
            schedules,
            mapel,
            grades,
            broadcastNews,
            galeriItems,
            kalenderAgendas,
            elibraryBooks,
            themeMode,
            ...cleanRemote
          } = remoteData;
          this.isSyncingWithFirebase = true;
          this.state = {
            ...this.state,
            ...cleanRemote,
            isLoggedIn: this.state.isLoggedIn,
            activeRole: this.state.activeRole,
            activeTabs: this.state.activeTabs
          };
          this.saveStateToLocalStorage();
          this.isSyncingWithFirebase = false;
          this.notify();
        }
      }, (error) => {
        console.warn("Firebase state listener info:", error.message || error);
      });

      // 2. Sync news / broadcastNews / tkjNews collection from Firestore muridtkj
      ['news', 'broadcastNews', 'broadcast_news', 'tkj_news', 'tkjNews'].forEach(colName => {
        try {
          onSnapshot(collection(db, colName), (snapshot) => {
            if (snapshot && !snapshot.empty) {
              const fetchedNews = snapshot.docs.map(docSnap => {
                const data = docSnap.data();
                return {
                  id: docSnap.id,
                  title: data.title || data.judul || data.name || data.titleText || data.nama || 'Pengumuman TKJ',
                  url: data.url || data.link || data.videoUrl || data.youtubeUrl || data.youtube_url || ''
                };
              });
              if (fetchedNews.length > 0) {
                this.state.broadcastNews = fetchedNews;
                this.saveStateToLocalStorage();
                this.notify();
              }
            }
          }, () => {});
        } catch (e) {}
      });

      // 3. Sync teachers collection
      ['teachers', 'guru'].forEach(colName => {
        try {
          onSnapshot(collection(db, colName), (snapshot) => {
            if (snapshot && !snapshot.empty) {
              const fetched = snapshot.docs.map(docSnap => {
                const d = docSnap.data();
                return {
                  id: docSnap.id,
                  name: d.name || d.nama || d.teacherName || 'Guru TKJ',
                  username: d.username || 'guru',
                  mapel: d.mapel || d.subject || 'Produktif TKJ'
                };
              });
              if (fetched.length > 0) {
                const seenMap = new Map();
                fetched.forEach(t => {
                  const k = (t.name || t.username).toString().trim().toLowerCase();
                  if (!seenMap.has(k)) seenMap.set(k, t);
                });
                this.state.teachers = Array.from(seenMap.values());
                this.syncCurrentUserData();
                this.saveStateToLocalStorage();
                this.notify();
              }
            }
          }, () => {});
        } catch (e) {}
      });

      // 4. Sync users/students collection
      ['users', 'students', 'siswa'].forEach(colName => {
        try {
          onSnapshot(collection(db, colName), (snapshot) => {
            if (snapshot && !snapshot.empty) {
              const fetched = snapshot.docs
                .map(docSnap => {
                  const d = docSnap.data();
                  return {
                    id: docSnap.id,
                    name: d.studentName || d.nama || d.name || 'Siswa',
                    nis: d.studentId || d.nisn || d.nis || d.id || docSnap.id,
                    class: d.className || d.kelas || d.class || '10 TKJ 1',
                    role: d.role || 'siswa'
                  };
                })
                .filter(s => s.role === 'siswa' || !s.role);

              if (fetched.length > 0) {
                const seenMap = new Map();
                fetched.forEach(s => {
                  const k = String(s.id || s.nis || s.name).trim().toLowerCase();
                  if (!seenMap.has(k)) seenMap.set(k, s);
                });
                this.state.students = Array.from(seenMap.values());
                this.syncCurrentUserData();
                this.saveStateToLocalStorage();
                this.notify();
              }
            }
          }, () => {});
        } catch (e) {}
      });

      // 5. Sync schedules collection
      ['schedules', 'jadwal', 'jadwal_pelajaran', 'schedule'].forEach(colName => {
        try {
          onSnapshot(collection(db, colName), (snapshot) => {
            if (snapshot && !snapshot.empty) {
              const fetchedSchedules = snapshot.docs.map(docSnap => {
                const d = docSnap.data();
                const className = d.class || d.className || d.nama_kelas || '10 TKJ 1';
                return {
                  id: docSnap.id,
                  mapel: d.mapel || d.subject || d.nama_mapel || 'Produktif TKJ',
                  guru: d.guru || d.teacher || d.teacherName || 'Guru TKJ',
                  hari: d.hari || d.day || 'Senin',
                  waktu: d.waktu || d.time || '07:30 - 11:30',
                  ruangan: d.ruangan || d.room || 'Lab TKJ',
                  level: parseInt(d.level || d.tingkat || (className.match(/\d+/)?.[0]) || 10),
                  class: className
                };
              });
              if (fetchedSchedules.length > 0) {
                const seenMap = new Map();
                fetchedSchedules.forEach(s => {
                  const k = `${s.mapel}_${s.hari}_${s.waktu}_${s.class}`.toLowerCase();
                  if (!seenMap.has(k)) seenMap.set(k, s);
                });
                this.state.schedules = Array.from(seenMap.values());
                this.saveStateToLocalStorage();
                this.notify();
              }
            }
          }, () => {});
        } catch (e) {}
      });

      // 6. Sync Galeri Siswa
      ['galeri_siswa', 'galeri'].forEach(colName => {
        try {
          onSnapshot(collection(db, colName), (snapshot) => {
            if (snapshot && !snapshot.empty) {
              const fetched = snapshot.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
              }));
              if (fetched.length > 0) {
                this.state.galeriItems = fetched;
                this.saveStateToLocalStorage();
                this.notify();
              }
            }
          }, () => {});
        } catch (e) {}
      });

      // 7. Sync Kalender Agenda
      try {
        onSnapshot(collection(db, 'kalender_agenda'), snapshot => {
          this.state.kalenderAgendas = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          this.saveStateToLocalStorage();
          this.notify();
        }, () => {});
      } catch (e) {}

      // 8. Sync E-Library
      try {
        onSnapshot(collection(db, 'elibrary_buku'), snapshot => {
          this.state.elibraryBooks = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          this.saveStateToLocalStorage();
          this.notify();
        }, () => {});
      } catch (e) {}

      // 9. Sync Visi Misi
      try {
        onSnapshot(doc(db, 'content_visimisi', 'visimisi_tkj'), (docSnap) => {
          if (docSnap.exists()) {
            this.state.visiMisi = docSnap.data();
            this.saveStateToLocalStorage();
            this.notify();
          }
        }, () => {});
      } catch (e) {}

    } catch (err) {
      console.warn('Firebase sync error:', err);
    }
  }

  async initSupabaseSync() {
    if (!supabase) return;

    try {
      // 1. Fetch App State (Silently handle if table not present in Supabase)
      try {
        const { data: stateData } = await supabase.from('app_state').select('*').limit(1).maybeSingle();
        if (stateData && stateData.state) {
          const { isLoggedIn, activeRole, currentUser, activeTabs, themeMode, ...safeGlobalState } = stateData.state;
          this.state = { ...this.state, ...safeGlobalState };
          this.saveStateToLocalStorage();
          this.notify();
        }
      } catch (_) {}

      // 2. Fetch Galeri Siswa
      try {
        const { data: galeriData } = await supabase.from('galeri_siswa').select('*');
        if (galeriData && galeriData.length > 0) {
          this.state.galeriItems = galeriData;
          this.saveStateToLocalStorage();
          this.notify();
        }
      } catch (_) {}

      // 3. Fetch Students / Users
      try {
        const { data: studentsData } = await supabase.from('users').select('*');
        if (studentsData && studentsData.length > 0) {
          this.state.students = studentsData.map(s => ({
            id: String(s.id),
            name: s.studentName || s.name || 'Siswa',
            nis: s.studentId || s.nis || String(s.id),
            class: s.className || s.class || '10 TKJ 1',
            role: s.role || 'siswa'
          }));
          this.syncCurrentUserData();
          this.saveStateToLocalStorage();
          this.notify();
        }
      } catch (_) {}

      // 4. Fetch Teachers
      try {
        const { data: teachersData } = await supabase.from('teachers').select('*');
        if (teachersData && teachersData.length > 0) {
          this.state.teachers = teachersData;
          this.syncCurrentUserData();
          this.saveStateToLocalStorage();
          this.notify();
        }
      } catch (_) {}

      // 5. Fetch Schedules
      try {
        const { data: schedulesData } = await supabase.from('schedules').select('*');
        if (schedulesData && schedulesData.length > 0) {
          this.state.schedules = schedulesData;
          this.saveStateToLocalStorage();
          this.notify();
        }
      } catch (_) {}

      // 6. Fetch Broadcast News
      try {
        const { data: newsData } = await supabase.from('broadcast_news').select('*');
        if (newsData && newsData.length > 0) {
          this.state.broadcastNews = newsData;
          this.saveStateToLocalStorage();
          this.notify();
        }
      } catch (_) {}

      // 7. Fetch Attendance
      try {
        const { data: attendanceData } = await supabase.from('attendance').select('*');
        if (attendanceData && attendanceData.length > 0) {
          this.state.attendance = attendanceData;
          this.deduplicateAttendance();
          this.saveStateToLocalStorage();
          this.notify();
        }
      } catch (_) {}

      // 8. Realtime Sync Listeners via Supabase Channels
      try {
        supabase.channel('public_db_changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'galeri_siswa' }, async () => {
            const { data } = await supabase.from('galeri_siswa').select('*');
            if (data && data.length > 0) {
              this.state.galeriItems = data;
              this.saveStateToLocalStorage();
              this.notify();
            }
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, async () => {
            const { data } = await supabase.from('users').select('*');
            if (data && data.length > 0) {
              this.state.students = data;
              this.saveStateToLocalStorage();
              this.notify();
            }
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, async () => {
            const { data } = await supabase.from('attendance').select('*');
            if (data && data.length > 0) {
              this.state.attendance = data;
              this.deduplicateAttendance();
              this.saveStateToLocalStorage();
              this.notify();
            }
          })
          .subscribe();
      } catch (_) {}

    } catch (err) {
      console.warn('Supabase sync note:', err.message || err);
    }
  }

  syncCurrentUserData() {
    if (this.state.currentUser.siswa && this.state.currentUser.siswa.nis) {
      const nis = String(this.state.currentUser.siswa.nis).trim();
      const found = (this.state.students || []).find(s => String(s.nis || s.id).trim() === nis);
      if (found) {
        this.state.currentUser.siswa = {
          ...this.state.currentUser.siswa,
          name: found.name,
          class: found.class
        };
      }
    }
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = {
          ...defaultState,
          ...parsed,
          students: (parsed.students && parsed.students.length > 0) ? parsed.students : defaultState.students,
          teachers: (parsed.teachers && parsed.teachers.length > 0) ? parsed.teachers : defaultState.teachers,
          mapel: (parsed.mapel && parsed.mapel.length > 0) ? parsed.mapel : defaultState.mapel,
          classes: (parsed.classes && parsed.classes.length > 0) ? parsed.classes : defaultState.classes,
          schedules: (parsed.schedules && parsed.schedules.length > 0) ? parsed.schedules : defaultState.schedules,
          broadcastNews: (parsed.broadcastNews && parsed.broadcastNews.length > 0) ? parsed.broadcastNews : defaultState.broadcastNews,
          galeriItems: (parsed.galeriItems && parsed.galeriItems.length > 0) ? parsed.galeriItems : defaultState.galeriItems,
          kalenderAgendas: cleanContentCache(parsed.kalenderAgendas, 'kalenderAgendas'),
          elibraryBooks: cleanContentCache(parsed.elibraryBooks, 'elibraryBooks'),
          activeTabs: { ...defaultState.activeTabs, ...(parsed.activeTabs || {}) },
          currentUser: { ...defaultState.currentUser, ...(parsed.currentUser || {}) },
          adminSubView: { ...defaultState.adminSubView, ...(parsed.adminSubView || {}) },
          isLoggedIn: false // Selalu default tidak login saat buka web baru
        };
      } else {
        this.state = JSON.parse(JSON.stringify(defaultState));
      }

      // Restore session data (hanya bertahan selama tab/browser aktif, hilang saat browser ditutup)
      const sessionSaved = sessionStorage.getItem(SESSION_KEY);
      if (sessionSaved) {
        const sessionParsed = JSON.parse(sessionSaved);
        if (sessionParsed && typeof sessionParsed === 'object') {
          this.state.isLoggedIn = !!sessionParsed.isLoggedIn;
          if (sessionParsed.activeRole) this.state.activeRole = sessionParsed.activeRole;
          if (sessionParsed.activeTabs) {
            this.state.activeTabs = { ...this.state.activeTabs, ...sessionParsed.activeTabs };
          }
          if (sessionParsed.currentUser) {
            this.state.currentUser = { ...this.state.currentUser, ...sessionParsed.currentUser };
          }
          if (sessionParsed.guruSubTab) {
            this.state.guruSubTab = { ...this.state.guruSubTab, ...sessionParsed.guruSubTab };
          }
          if (sessionParsed.adminSubView) {
            this.state.adminSubView = { ...this.state.adminSubView, ...sessionParsed.adminSubView };
          }
        }
      }
    } catch (e) {
      console.error("Error loading state from Storage", e);
      this.state = JSON.parse(JSON.stringify(defaultState));
    }
    this.applyTheme();
  }

  saveStateToLocalStorage() {
    try {
      // Simpan data master ke localStorage tanpa status login permanen
      const persistentState = {
        ...this.state,
        isLoggedIn: false
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistentState));

      // Simpan status sesi aktif ke sessionStorage (tetap bertahan saat di-refresh F5)
      const sessionData = {
        isLoggedIn: this.state.isLoggedIn,
        activeRole: this.state.activeRole,
        activeTabs: this.state.activeTabs,
        currentUser: this.state.currentUser,
        guruSubTab: this.state.guruSubTab,
        adminSubView: this.state.adminSubView
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    } catch (e) {
      console.error("Error saving state to Storage", e);
    }
  }

  saveState() {
    this.saveStateToLocalStorage();

    if (supabase) {
      const {
        students,
        teachers,
        mapel,
        classes,
        schedules,
        attendance,
        grades,
        broadcastNews,
        galeriItems,
        kalenderAgendas,
        elibraryBooks,
        themeMode,
        ...lightweightState
      } = this.state;

      supabase.from('app_state').upsert([{
        id: 'central_state',
        state: lightweightState,
        updated_at: new Date().toISOString()
      }]).then(({ error }) => {
        if (error) {
          // Table app_state might not be created yet, silently proceed
        }
      }).catch(() => {});
    }

    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (e) {
        console.error("Error in store listener:", e);
      }
    });
  }

  // Auth Actions
  login(role, username, password) {
    this.state.isLoggedIn = true;
    this.state.activeRole = role;

    if (role === 'siswa') {
      const found = (this.state.students || []).find(s => {
        const sNis = String(s.nis || s.studentId || s.id || '').trim();
        const sName = String(s.name || s.studentName || '').toLowerCase().trim();
        const inputU = String(username).toLowerCase().trim();
        return sNis === inputU || sName === inputU;
      });

      if (found) {
        this.state.currentUser.siswa = {
          id: found.id || username,
          name: found.name || found.studentName || username,
          nis: found.nis || found.studentId || found.id || '123456789',
          class: found.class || found.className || '10 TKJ 1'
        };
      } else {
        this.state.currentUser.siswa = {
          id: username,
          name: username,
          nis: username,
          class: '10 TKJ 1'
        };
      }
    } else if (role === 'guru') {
      const u = String(username).toLowerCase();
      const found = (this.state.teachers || []).find(t => {
        const uName = (t.name || t.teacherName || '').toLowerCase();
        const uUser = (t.username || '').toLowerCase();
        return uUser === u || uName === u;
      });

      if (found) {
        this.state.currentUser.guru = {
          id: found.id || username,
          name: found.name || found.teacherName || username,
          username: found.username || username,
          mapel: found.mapel || found.subject || 'MTK'
        };
      } else {
        this.state.currentUser.guru.username = username;
        this.state.currentUser.guru.name = username;
      }
    } else if (role === 'admin') {
      this.state.currentUser.admin.username = username;
    } else if (role === 'guest') {
      this.state.currentUser.guest = {
        id: 'guest',
        name: username || 'Tamu / Pengunjung',
        role: 'guest'
      };
      this.state.currentUser.siswa = {
        id: 'guest',
        name: username || 'Tamu / Pengunjung',
        nis: 'GUEST-ACCOUNT',
        class: 'Pengunjung Web'
      };
    }

    this.saveState();
  }

  logout() {
    this.state.isLoggedIn = false;
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) { }
    this.saveState();
  }

  setRoleTab(role, tab) {
    if (this.state.activeTabs[role] === tab) return;
    this.state.activeTabs[role] = tab;
    this.saveState();
  }

  // Admin Actions
  addTeacher(teacher) {
    const newId = String(Date.now());
    teacher.id = newId;
    this.state.teachers.push(teacher);
    this.saveState();

    if (isFirebaseConnected && db) {
      setDoc(doc(db, 'teachers', newId), teacher).catch(e => console.warn(e));
    }
    if (supabase) {
      supabase.from('teachers').upsert([teacher]).catch(e => console.warn(e));
    }
  }

  deleteTeacher(id) {
    const idStr = String(id);
    this.state.teachers = this.state.teachers.filter(t => String(t.id) !== idStr);
    this.saveState();

    if (isFirebaseConnected && db) {
      deleteDoc(doc(db, 'teachers', idStr)).catch(e => console.warn(e));
    }
    if (supabase) {
      supabase.from('teachers').delete().eq('id', idStr).catch(e => console.warn(e));
    }
  }

  addMapel(name) {
    const subjectId = name.replace(/\s+/g, '_').toLowerCase();
    const obj = { id: subjectId, name, nama_mapel: name };
    this.state.mapel.push(obj);
    this.saveState();

    if (isFirebaseConnected && db) {
      setDoc(doc(db, 'subjects', subjectId), obj).catch(e => console.warn(e));
    }
    if (supabase) {
      supabase.from('subjects').upsert([obj]).catch(e => console.warn(e));
    }
  }

  addClass(className, level) {
    const classId = className.replace(/\s+/g, '_').toLowerCase();
    const angkatan = String(level || '10');
    const obj = { id: classId, name: className, level: parseInt(level || 10), count: 0, angkatan };
    this.state.classes.push(obj);
    this.saveState();

    if (isFirebaseConnected && db) {
      setDoc(doc(db, 'classes', classId), obj).catch(e => console.warn(e));
    }
    if (supabase) {
      supabase.from('classes').upsert([obj]).catch(e => console.warn(e));
    }
  }

  addSchedule(schedule) {
    const newId = String(Date.now());
    schedule.id = newId;
    this.state.schedules.push(schedule);
    this.saveState();

    if (isFirebaseConnected && db) {
      setDoc(doc(db, 'schedules', newId), schedule).catch(e => console.warn(e));
    }
    if (supabase) {
      supabase.from('schedules').upsert([schedule]).catch(e => console.warn(e));
    }
  }

  deleteSchedule(id) {
    const idStr = String(id);
    this.state.schedules = this.state.schedules.filter(s => String(s.id) !== idStr);
    this.saveState();

    if (isFirebaseConnected && db) {
      deleteDoc(doc(db, 'schedules', idStr)).catch(e => console.warn(e));
    }
    if (supabase) {
      supabase.from('schedules').delete().eq('id', idStr).catch(e => console.warn(e));
    }
  }

  addBroadcastNews(title, url) {
    const newId = String(Date.now());
    const newsObj = { id: newId, title, url };
    this.state.broadcastNews.push(newsObj);
    this.saveState();

    if (isFirebaseConnected && db) {
      setDoc(doc(db, 'broadcastNews', newId), newsObj).catch(err => console.warn(err));
      setDoc(doc(db, 'news', newId), newsObj).catch(err => console.warn(err));
    }
    if (supabase) {
      supabase.from('broadcastNews').upsert([newsObj]).catch(err => console.warn(err));
    }
  }

  updateNews(id, newTitle, newUrl) {
    const idStr = String(id);
    const item = this.state.broadcastNews.find(n => String(n.id) === idStr);
    if (item) {
      item.title = newTitle;
      item.url = newUrl;
      this.saveState();

      if (isFirebaseConnected && db) {
        setDoc(doc(db, 'broadcastNews', idStr), item, { merge: true }).catch(err => console.warn(err));
        setDoc(doc(db, 'news', idStr), item, { merge: true }).catch(err => console.warn(err));
      }
      if (supabase) {
        supabase.from('broadcastNews').upsert([{ id: idStr, title: newTitle, url: newUrl }]).catch(err => console.warn(err));
      }
    }
  }

  moveNews(index, direction) {
    const news = this.state.broadcastNews;
    if (direction === 'up' && index > 0) {
      const temp = news[index];
      news[index] = news[index - 1];
      news[index - 1] = temp;
      this.saveState();
    } else if (direction === 'down' && index < news.length - 1) {
      const temp = news[index];
      news[index] = news[index + 1];
      news[index + 1] = temp;
      this.saveState();
    }
  }

  deleteNews(id) {
    const idStr = String(id);
    this.state.broadcastNews = this.state.broadcastNews.filter(n => String(n.id) !== idStr);
    this.saveState();

    if (isFirebaseConnected && db) {
      deleteDoc(doc(db, 'broadcastNews', idStr)).catch(err => console.warn(err));
      deleteDoc(doc(db, 'news', idStr)).catch(err => console.warn(err));
    }
    if (supabase) {
      supabase.from('broadcastNews').delete().eq('id', idStr).catch(err => console.warn(err));
    }
  }

  updateTeacher(id, name, username, mapel) {
    const idStr = String(id);
    const item = this.state.teachers.find(t => String(t.id) === idStr);
    if (item) {
      item.name = name;
      item.username = username;
      item.mapel = mapel;
      this.saveState();

      if (isFirebaseConnected && db) {
        setDoc(doc(db, 'teachers', idStr), item, { merge: true }).catch(err => console.warn(err));
      }
      if (supabase) {
        supabase.from('teachers').upsert([{ id: idStr, name, username, mapel }]).catch(err => console.warn(err));
      }
    }
  }

  updateMapel(id, newName) {
    const idStr = String(id);
    const item = this.state.mapel.find(m => String(m.id) === idStr);
    if (item) {
      item.name = newName;
      item.nama_mapel = newName;
      this.saveState();

      if (isFirebaseConnected && db) {
        setDoc(doc(db, 'subjects', idStr), item, { merge: true }).catch(err => console.warn(err));
      }
      if (supabase) {
        supabase.from('subjects').upsert([{ id: idStr, name: newName, nama_mapel: newName }]).catch(err => console.warn(err));
      }
    }
  }

  deleteMapel(id) {
    const idStr = String(id);
    this.state.mapel = this.state.mapel.filter(m => String(m.id) !== idStr);
    this.saveState();

    if (isFirebaseConnected && db) {
      deleteDoc(doc(db, 'subjects', idStr)).catch(err => console.warn(err));
    }
    if (supabase) {
      supabase.from('subjects').delete().eq('id', idStr).catch(err => console.warn(err));
    }
  }

  addStudent(student) {
    const newId = student.id || String(Date.now());
    const studentObj = {
      id: String(newId),
      name: student.name,
      nis: student.nis || String(newId),
      class: student.class || '10 TKJ 1',
      role: 'siswa'
    };
    this.state.students.push(studentObj);
    this.saveState();

    if (isFirebaseConnected && db) {
      setDoc(doc(db, 'users', String(newId)), {
        studentName: studentObj.name,
        studentId: studentObj.nis,
        className: studentObj.class,
        role: 'siswa'
      }, { merge: true }).catch(err => console.warn(err));
    }
    if (supabase) {
      supabase.from('users').upsert([studentObj]).catch(err => console.warn(err));
    }
  }

  updateStudent(id, name, nis, className) {
    const idStr = String(id);
    const item = this.state.students.find(s => String(s.id) === idStr || String(s.nis) === idStr);
    if (item) {
      item.name = name;
      item.nis = nis;
      item.class = className;
      this.saveState();

      if (isFirebaseConnected && db) {
        setDoc(doc(db, 'users', idStr), {
          studentName: name,
          studentId: nis,
          className: className,
          role: 'siswa'
        }, { merge: true }).catch(err => console.warn(err));
      }
      if (supabase) {
        supabase.from('users').upsert([{
          id: idStr,
          name,
          nis,
          class: className,
          role: 'siswa'
        }]).catch(err => console.warn(err));
      }
    }
  }

  deleteStudent(id) {
    const idStr = String(id);
    this.state.students = this.state.students.filter(s => String(s.id) !== idStr && String(s.nis) !== idStr);
    this.saveState();

    if (isFirebaseConnected && db) {
      deleteDoc(doc(db, 'users', idStr)).catch(err => console.warn(err));
    }
    if (supabase) {
      supabase.from('users').delete().eq('id', idStr).catch(err => console.warn(err));
    }
  }

  updateSchedule(id, updatedData) {
    const idStr = String(id);
    const item = this.state.schedules.find(s => String(s.id) === idStr);
    if (item) {
      Object.assign(item, updatedData);
      this.saveState();

      if (isFirebaseConnected && db) {
        setDoc(doc(db, 'schedules', idStr), item, { merge: true }).catch(err => console.warn(err));
      }
      if (supabase) {
        supabase.from('schedules').upsert([item]).catch(err => console.warn(err));
      }
    }
  }

  deduplicateAttendance() {
    if (!Array.isArray(this.state.attendance)) {
      this.state.attendance = [];
      return;
    }
    const map = new Map();
    this.state.attendance.forEach(item => {
      if (!item) return;
      const classId = String(item.class || item.className || '10 TKJ 1').trim().toLowerCase();
      const mapelId = String(item.mapel || item.subject || 'MTK').trim().toLowerCase();
      const pNum = parseInt(item.pertemuan || item.period || 1, 10);
      const key = `${classId}_${mapelId}_p${pNum}`;

      if (!map.has(key)) {
        map.set(key, { ...item, pertemuan: pNum });
      } else {
        const existing = map.get(key);
        const mergedRecords = { ...(existing.records || {}), ...(item.records || {}) };
        map.set(key, {
          ...existing,
          ...item,
          id: existing.id || item.id,
          date: item.date || existing.date,
          pertemuan: pNum,
          records: mergedRecords
        });
      }
    });
    this.state.attendance = Array.from(map.values());
  }

  // Guru Actions
  saveAttendance(date, pertemuan, mapel, className, records) {
    const targetPertemuan = parseInt(pertemuan, 10);
    const cleanMapel = String(mapel || '').trim().toLowerCase();
    const cleanClass = String(className || '').trim().toLowerCase();

    const existingIndex = (this.state.attendance || []).findIndex(a => {
      if (!a) return false;
      const aPertemuan = parseInt(a.pertemuan || a.period || 1, 10);
      const aMapel = String(a.mapel || a.subject || '').trim().toLowerCase();
      const aClass = String(a.class || a.className || '').trim().toLowerCase();
      return aPertemuan === targetPertemuan && aMapel === cleanMapel && aClass === cleanClass;
    });

    const newId = existingIndex >= 0 ? String(this.state.attendance[existingIndex].id) : `${date}_${cleanClass.replace(/\s+/g, '_')}_${cleanMapel.replace(/\s+/g, '_')}_p${targetPertemuan}`;
    const attObj = {
      id: newId,
      date,
      pertemuan: targetPertemuan,
      mapel,
      class: className,
      records
    };

    if (existingIndex >= 0) {
      this.state.attendance[existingIndex] = attObj;
    } else {
      this.state.attendance.push(attObj);
    }
    this.deduplicateAttendance();
    this.saveState();

    if (isFirebaseConnected && db) {
      setDoc(doc(db, 'attendance', newId), attObj).catch(e => console.warn(e));
    }
    if (supabase) {
      supabase.from('attendance').upsert([attObj]).catch(e => console.warn(e));
    }
  }

  saveGrades(pertemuan, mapel, className, scores) {
    const existingIndex = this.state.grades.findIndex(
      g => g.pertemuan === parseInt(pertemuan) && g.mapel === mapel && g.class === className
    );
    const newId = existingIndex >= 0 ? String(this.state.grades[existingIndex].id) : String(Date.now());
    const gradeObj = {
      id: newId,
      pertemuan: parseInt(pertemuan),
      mapel,
      class: className,
      scores
    };

    if (existingIndex >= 0) {
      this.state.grades[existingIndex] = gradeObj;
    } else {
      this.state.grades.push(gradeObj);
    }
    this.saveState();

    if (isFirebaseConnected && db) {
      setDoc(doc(db, 'grades', newId), gradeObj).catch(e => console.warn(e));
    }
    if (supabase) {
      supabase.from('grades').upsert([gradeObj]).catch(e => console.warn(e));
    }
  }

  // Admin Content Management Actions
  updateVisiMisi(visi, misi) {
    this.state.visiMisi = {
      visi: visi || this.state.visiMisi.visi,
      misi: Array.isArray(misi) ? misi : (this.state.visiMisi.misi || [])
    };
    this.saveState();

    if (isFirebaseConnected && db) {
      setDoc(doc(db, 'content_visimisi', 'visimisi_tkj'), this.state.visiMisi, { merge: true }).catch(e => console.warn(e));
    }
    if (supabase) {
      supabase.from('content_visimisi').upsert([{ id: 'visimisi_tkj', visi: this.state.visiMisi.visi, misi: this.state.visiMisi.misi }]).catch(e => console.warn(e));
    }
  }

  addGaleriItem(item) {
    if (!this.state.galeriItems) this.state.galeriItems = [];
    const newItem = {
      id: String(Date.now()),
      title: item.title || 'Karya Siswa TKJ',
      category: item.category || '🖼️ GALERI',
      tagColor: item.tagColor || '#0284c7',
      tagBg: item.tagBg || '#e0f2fe',
      imageUrl: item.imageUrl || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
      images: Array.isArray(item.images) && item.images.length > 0 ? item.images : [(item.imageUrl || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80')],
      subtitle: item.subtitle || 'Dokumentasi kegiatan siswa TKJ.'
    };
    this.state.galeriItems.unshift(newItem);
    this.saveState();

    if (isFirebaseConnected && db) {
      setDoc(doc(db, 'galeri_siswa', newItem.id), newItem).catch(e => console.warn(e));
    }
    if (supabase) {
      supabase.from('galeri_siswa').upsert([newItem]).then(({ error }) => {
        if (error) console.warn('Supabase galeri_siswa upsert note:', error.message);
      }).catch(e => console.warn(e));
    }
  }

  updateGaleriItem(id, updatedData) {
    const idStr = String(id);
    if (!this.state.galeriItems) return;
    const item = this.state.galeriItems.find(g => String(g.id) === idStr);
    if (item) {
      Object.assign(item, updatedData);
      this.saveState();

      if (isFirebaseConnected && db) {
        setDoc(doc(db, 'galeri_siswa', idStr), item, { merge: true }).catch(e => console.warn(e));
      }
      if (supabase) {
        supabase.from('galeri_siswa').upsert([item]).then(({ error }) => {
          if (error) console.warn('Supabase galeri_siswa update note:', error.message);
        }).catch(e => console.warn(e));
      }
    }
  }

  deleteGaleriItem(id) {
    const idStr = String(id);
    if (!this.state.galeriItems) return;
    this.state.galeriItems = this.state.galeriItems.filter(g => String(g.id) !== idStr);
    this.saveState();

    if (isFirebaseConnected && db) {
      deleteDoc(doc(db, 'galeri_siswa', idStr)).catch(e => console.warn(e));
    }
    if (supabase) {
      supabase.from('galeri_siswa').delete().eq('id', idStr).then(({ error }) => {
        if (error) console.warn('Supabase galeri_siswa delete note:', error.message);
      }).catch(e => console.warn(e));
    }
  }

  addKalenderAgenda(agenda) {
    if (!this.state.kalenderAgendas) this.state.kalenderAgendas = [];
    const newAgenda = {
      id: String(Date.now()),
      date: agenda.date || '01 - 05 Bulan 2026',
      tag: agenda.tag || 'Agenda',
      title: agenda.title || 'Kegiatan Akademik',
      desc: agenda.desc || 'Deskripsi kegiatan akademik.',
      color: agenda.color || '#0284c7',
      bg: agenda.bg || '#e0f2fe'
    };
    this.state.kalenderAgendas.push(newAgenda);
    this.saveState();

    if (isFirebaseConnected && db) {
      setDoc(doc(db, 'kalender_agenda', newAgenda.id), newAgenda).catch(e => console.warn(e));
    }
    if (supabase) {
      supabase.from('kalender_agenda').upsert([newAgenda]).catch(e => console.warn(e));
    }
  }

  deleteKalenderAgenda(id) {
    const idStr = String(id);
    if (!this.state.kalenderAgendas) return;
    this.state.kalenderAgendas = this.state.kalenderAgendas.filter(a => String(a.id) !== idStr);
    this.saveState();

    if (isFirebaseConnected && db) {
      deleteDoc(doc(db, 'kalender_agenda', idStr)).catch(e => console.warn(e));
    }
    if (supabase) {
      supabase.from('kalender_agenda').delete().eq('id', idStr).catch(e => console.warn(e));
    }
  }

  addElibraryBook(book) {
    if (!this.state.elibraryBooks) this.state.elibraryBooks = [];
    const newBook = {
      id: String(Date.now()),
      title: book.title || 'Buku Digital TKJ',
      category: book.category || 'Teknologi',
      desc: book.desc || 'Modul pembelajaran dan panduan praktikum digital.',
      color: book.color || '#0284c7',
      icon: book.icon || '📘'
    };
    this.state.elibraryBooks.push(newBook);
    this.saveState();

    if (isFirebaseConnected && db) {
      setDoc(doc(db, 'elibrary_buku', newBook.id), newBook).catch(e => console.warn(e));
    }
    if (supabase) {
      supabase.from('elibrary_buku').upsert([newBook]).catch(e => console.warn(e));
    }
  }

  deleteElibraryBook(id) {
    const idStr = String(id);
    if (!this.state.elibraryBooks) return;
    this.state.elibraryBooks = this.state.elibraryBooks.filter(b => String(b.id) !== idStr);
    this.saveState();

    if (isFirebaseConnected && db) {
      deleteDoc(doc(db, 'elibrary_buku', idStr)).catch(e => console.warn(e));
    }
    if (supabase) {
      supabase.from('elibrary_buku').delete().eq('id', idStr).catch(e => console.warn(e));
    }
  }
}

export const store = new Store();
if (typeof window !== 'undefined') {
  window.store = store;
}
