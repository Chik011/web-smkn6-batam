/* Central Store with LocalStorage Persistence & Firebase Real-Time Sync */
import { 
  db, 
  isFirebaseConnected, 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  deleteDoc,
  getDocs,
  serverTimestamp,
  getYouTubeDetails 
} from './firebase.js';

const STORAGE_KEY = 'SMKN6_APP_DATA_V3';

const defaultState = {
  isLoggedIn: false,
  activeRole: 'siswa', // 'siswa', 'guru', 'admin'
  activeViewMode: 'desktop', // 'desktop' or 'grid'
  
  // Current logged in user details per role
  currentUser: {
    siswa: { id: '1', name: 'Siswa', nis: '123456789', class: '10 TKJ 1' },
    guru: { id: '1', name: 'Guru TKJ', username: 'guru', mapel: 'MTK' },
    admin: { username: 'admin', lastUpdate: '2026-08-12' }
  },

  // Students Database
  students: [],

  // Teachers Database
  teachers: [],

  // Subjects List
  mapel: [],

  // Classes Database
  classes: [],

  // Schedules Database
  schedules: [],

  // Attendance Records
  attendance: [],

  // Grades Database
  grades: [],

  // News & Video Broadcasts
  broadcastNews: [],

  // Active Tabs per role
  activeTabs: {
    siswa: 'home',   // 'home', 'pelajaran', 'scan', 'notifikasi', 'akun'
    guru: 'beranda', // 'beranda', 'absensi', 'nilai', 'profil'
    admin: 'home'    // 'home', 'guru', 'mapel', 'siswa', 'jadwal', 'setting'
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

  biometricEnabled: false,
  themeMode: 'light'
};

class Store {
  constructor() {
    this.listeners = [];
    this.isSyncingWithFirebase = false;
    this.loadState();
    this.applyTheme();
    this.initFirebaseSync();
  }

  setThemeMode(theme) {
    this.state.themeMode = theme;
    this.saveState();
    this.applyTheme();
  }

  applyTheme() {
    const theme = (this.state && this.state.themeMode) ? this.state.themeMode : 'light';
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
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
          const { students, teachers, attendance, classes, schedules, mapel, grades, broadcastNews, ...cleanRemote } = remoteData;
          this.isSyncingWithFirebase = true;
          this.state = {
            ...this.state,
            ...cleanRemote,
            isLoggedIn: this.state.isLoggedIn,
            activeRole: this.state.activeRole,
            activeTabs: this.state.activeTabs
          };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
          } catch (err) {
            console.error("LocalStorage save error:", err);
          }
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
            if (snapshot) {
              if (snapshot.empty) {
                if (colName === 'news' || colName === 'broadcastNews') {
                  if (!this.state.broadcastNews || this.state.broadcastNews.length === 0) {
                    this.state.broadcastNews = [];
                  }
                }
              } else {
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
                }
              }
              this.saveStateToLocalStorage();
              this.notify();
            }
          }, () => {});
        } catch (e) {}
      });

      // 3. Sync teachers collection
      ['teachers', 'guru'].forEach(colName => {
        try {
          onSnapshot(collection(db, colName), (snapshot) => {
            if (snapshot) {
              if (snapshot.empty) {
                if (colName === 'teachers') {
                  if (!this.state.teachers || this.state.teachers.length === 0) this.state.teachers = [];
                }
              } else {
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
                }
              }
              this.syncCurrentUserData();
              this.saveStateToLocalStorage();
              this.notify();
            }
          }, () => {});
        } catch (e) {}
      });

      // 4. Primary Sync: Firestore `users` collection (Siswa Database)
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

      ['users', 'students', 'siswa'].forEach(colName => {
        try {
          onSnapshot(collection(db, colName), (snapshot) => {
            if (snapshot) {
              if (snapshot.empty) {
                if (colName === 'users') {
                  this.state.students = [];
                }
              } else {
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
                  .filter(s => (s.role === 'siswa' || !s.role) && !isDummy(s));

                if (fetched.length > 0 || colName === 'users') {
                  const seenMap = new Map();
                  fetched.forEach(s => {
                    const k = (s.nis || s.name || s.id).toString().toLowerCase();
                    if (!seenMap.has(k)) seenMap.set(k, s);
                  });
                  this.state.students = Array.from(seenMap.values());
                }
              }
              this.syncCurrentUserData();
              this.saveStateToLocalStorage();
              this.notify();
            }
          }, () => {});
        } catch (e) {}
      });

      // 5. Sync schedules / jadwal / jadwal_pelajaran collection
      ['schedules', 'jadwal', 'jadwal_pelajaran', 'schedule'].forEach(colName => {
        try {
          onSnapshot(collection(db, colName), (snapshot) => {
            if (snapshot) {
              if (snapshot.empty) {
                if (colName === 'schedules' || colName === 'jadwal') {
                  if (!this.state.schedules || this.state.schedules.length === 0) this.state.schedules = [];
                }
              } else {
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
                }
              }
              this.saveStateToLocalStorage();
              this.notify();
            }
          }, () => {});
        } catch (e) {}
      });

      // 6. Sync attendance_sessions subcollection schema & fallback attendance collection
      try {
        onSnapshot(collection(db, 'attendance_sessions'), async (snapshot) => {
          if (snapshot) {
            if (snapshot.empty) {
              this.state.attendance = [];
              this.saveStateToLocalStorage();
              this.notify();
              return;
            }

            const sessionPromises = snapshot.docs.map(async (sDoc) => {
              const sData = sDoc.data();
              const recordsRef = collection(db, 'attendance_sessions', sDoc.id, 'records');
              const recSnap = await getDocs(recordsRef).catch(() => null);
              const recordsObj = {};

              if (recSnap && !recSnap.empty) {
                recSnap.docs.forEach(rDoc => {
                  const rData = rDoc.data();
                  const statusMap = { 'Hadir': 'H', 'Sakit': 'S', 'Izin': 'I', 'Alpa': 'A', 'Alpha': 'A' };
                  const code = statusMap[rData.status] || rData.status || 'H';
                  recordsObj[rData.student_id || rDoc.id] = code;
                });
              }

              return {
                id: sDoc.id,
                date: sData.tanggal || sData.date || '2026-09-10',
                pertemuan: parseInt(sData.pertemuan_ke || sData.pertemuan || 1),
                mapel: sData.nama_mapel || sData.mapel || sData.subject_id || 'MTK',
                class: sData.nama_kelas || sData.className || sData.class_id || '10 TKJ 1',
                records: recordsObj
              };
            });

            const sessions = await Promise.all(sessionPromises);
            this.state.attendance = sessions;
            this.saveStateToLocalStorage();
            this.notify();
          }
        }, () => {});
      } catch (e) {}

      // Fallback listener for root 'attendance' collection
      try {
        onSnapshot(collection(db, 'attendance'), (snapshot) => {
          if (snapshot) {
            if (snapshot.empty) {
              if (!this.state.attendance || this.state.attendance.length === 0) {
                this.state.attendance = [];
                this.saveStateToLocalStorage();
                this.notify();
              }
              return;
            }

            const groups = {};
            snapshot.docs.forEach(docSnap => {
              const d = docSnap.data();
              const date = d.date || '2026-09-10';
              const pertemuan = parseInt(d.period || d.pertemuan || 1);
              const mapel = d.subject || d.mapel || 'MTK';
              const className = d.className || d.class || '10 TKJ 1';
              const key = `${date}_${pertemuan}_${mapel}_${className}`.replace(/\s+/g, '_');

              if (!groups[key]) {
                groups[key] = {
                  id: key,
                  date,
                  pertemuan,
                  mapel,
                  class: className,
                  records: {}
                };
              }

              if (d.records && typeof d.records === 'object') {
                groups[key].records = { ...groups[key].records, ...d.records };
              } else if (d.studentId) {
                const stId = d.studentId;
                const statusMap = { 'Hadir': 'H', 'Sakit': 'S', 'Izin': 'I', 'Alpha': 'A' };
                const statusCode = statusMap[d.status] || d.status || 'H';
                groups[key].records[stId] = statusCode;
              }
            });

            this.state.attendance = Object.values(groups);
            this.saveStateToLocalStorage();
            this.notify();
          }
        }, () => {});
      } catch (e) {}

      // 7. Sync classes collection (Kelas Database)
      ['classes', 'kelas'].forEach(colName => {
        try {
          onSnapshot(collection(db, colName), (snapshot) => {
            if (snapshot) {
              if (snapshot.empty) {
                if (colName === 'classes') {
                  if (!this.state.classes || this.state.classes.length === 0) this.state.classes = [];
                }
              } else {
                const fetchedClasses = snapshot.docs.map(cDoc => {
                  const cData = cDoc.data();
                  const className = cData.nama_kelas || cData.name || cData.className || '10 TKJ 1';
                  const parsedLevel = parseInt(cData.level || cData.angkatan || (className.match(/\d+/)?.[0]) || 10);
                  return {
                    id: cDoc.id,
                    name: className,
                    angkatan: String(cData.angkatan || parsedLevel),
                    level: parsedLevel,
                    count: parseInt(cData.count || 0)
                  };
                });
                if (fetchedClasses.length > 0) {
                  const seenMap = new Map();
                  fetchedClasses.forEach(c => {
                    const k = c.name.toString().trim().toLowerCase();
                    if (!seenMap.has(k)) seenMap.set(k, c);
                  });
                  this.state.classes = Array.from(seenMap.values());
                }
              }
              this.saveStateToLocalStorage();
              this.notify();
            }
          }, () => {});
        } catch (e) {}
      });

      // 8. Sync subjects collection (Mata Pelajaran & Pelajaran)
      ['subjects', 'mapel', 'pelajaran', 'mata_pelajaran', 'subject'].forEach(colName => {
        try {
          onSnapshot(collection(db, colName), (snapshot) => {
            if (snapshot) {
              if (snapshot.empty) {
                if (colName === 'subjects' || colName === 'mapel') {
                  if (!this.state.mapel || this.state.mapel.length === 0) {
                    this.state.mapel = [];
                  }
                }
              } else {
                const fetchedMapel = snapshot.docs.map(docSnap => {
                  const d = docSnap.data();
                  return {
                    id: docSnap.id,
                    name: d.nama_mapel || d.name || d.subject || d.nama || d.title || 'Mata Pelajaran',
                    code: d.kode || d.code || docSnap.id
                  };
                });
                if (fetchedMapel.length > 0) {
                  const seenMap = new Map();
                  fetchedMapel.forEach(m => {
                    const k = m.name.toString().trim().toLowerCase();
                    if (!seenMap.has(k)) seenMap.set(k, m);
                  });
                  this.state.mapel = Array.from(seenMap.values());
                }
              }
              this.saveStateToLocalStorage();
              this.notify();
            }
          }, () => {});
        } catch (e) {}
      });
    } catch (e) {
      console.error("Failed to setup Firebase real-time sync:", e);
    }
  }

  async seedDatabaseToFirebase() {
    if (!isFirebaseConnected || !db) return;

    try {
      const realStudents = [
        { id: '1', name: 'tes', nis: '123456789', class: '10 TKJ 1' },
        { id: '2', name: 'tes2', nis: '1212121212', class: '10 TKJ 1' },
        { id: '3', name: 'test', nis: '1212121212', class: '10 TKJ 1' }
      ];
      this.state.students = realStudents;

      // Overwrite classes & students subcollection in Firestore with real 3 students
      const classId = '10_tkj_1';
      setDoc(doc(db, 'classes', classId), {
        id: classId,
        nama_kelas: '10 TKJ 1',
        angkatan: '10',
        level: 10
      }, { merge: true }).catch(e => console.warn(e));

      for (const st of realStudents) {
        setDoc(doc(db, 'classes', classId, 'students', String(st.id)), {
          nama: st.name,
          nisn: st.nis,
          kelas: st.class
        }).catch(e => console.warn(e));

        setDoc(doc(db, 'users', String(st.id)), {
          studentName: st.name,
          studentId: st.nis,
          className: st.class,
          role: 'siswa'
        }).catch(e => console.warn(e));
      }

      // Sync subjects
      if (this.state.mapel && this.state.mapel.length > 0) {
        for (const m of this.state.mapel) {
          const subjectId = (m.id || m.name).replace(/\s+/g, '_').toLowerCase();
          setDoc(doc(db, 'subjects', subjectId), {
            id: subjectId,
            nama_mapel: m.name,
            name: m.name
          }, { merge: true }).catch(e => console.warn(e));
        }
      }
    } catch (err) {
      console.warn("Notice during database sync:", err);
    }
  }

  loadState() {
    try {
      try {
        localStorage.removeItem('SMKN6_APP_DATA_V1');
        localStorage.removeItem('SMKN6_APP_DATA_V2');
      } catch (e) {}

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.state = JSON.parse(saved);
        this.state.activeViewMode = 'desktop';
        if (typeof this.state.isLoggedIn !== 'boolean') this.state.isLoggedIn = false;

        if (Array.isArray(this.state.students)) {
          this.state.students = this.state.students.filter(s => {
            const name = (s.name || '').toLowerCase();
            const nis = String(s.nis || '');
            return !name.includes('ahmad rizki') && !name.includes('budi santoso') && !name.includes('citra dewi') && nis !== '2024001' && nis !== '2024002' && nis !== '2024003';
          });
        }
      } else {
        this.state = JSON.parse(JSON.stringify(defaultState));
        this.saveStateToLocalStorage();
      }
    } catch (e) {
      console.error("Error loading state", e);
      this.state = JSON.parse(JSON.stringify(defaultState));
    }
    this.applyTheme();
  }

  saveStateToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("Error saving state to LocalStorage", e);
    }
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("Error saving state", e);
    }

    if (isFirebaseConnected && db && !this.isSyncingWithFirebase) {
      try {
        const stateRef = doc(db, 'smkn6', 'app_state');
        setDoc(stateRef, JSON.parse(JSON.stringify(this.state)), { merge: true })
          .catch(err => console.warn("Firebase auto-sync info:", err.message || err));
      } catch (e) {
        console.warn("Firebase save state error:", e);
      }
    }

    this.notify();
  }

  resetState() {
    this.state = JSON.parse(JSON.stringify(defaultState));
    this.saveState();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.applyTheme();
    if (this._notifyTimer) clearTimeout(this._notifyTimer);
    this._notifyTimer = setTimeout(() => {
      this._notifyTimer = null;
      this.listeners.forEach(fn => fn(this.state));
    }, 40);
  }

  notifySync() {
    this.applyTheme();
    if (this._notifyTimer) clearTimeout(this._notifyTimer);
    this._notifyTimer = null;
    this.listeners.forEach(fn => fn(this.state));
  }

  // Action methods
  setRole(role) {
    if (this.state.activeRole === role) return;
    this.state.activeRole = role;
    this.saveState();
  }

  setViewMode(mode) {
    if (this.state.activeViewMode === mode) return;
    this.state.activeViewMode = mode;
    this.saveState();
  }

  syncCurrentUserData() {
    if (this.state.isLoggedIn && this.state.activeRole === 'siswa') {
      const curName = (this.state.currentUser.siswa.name || '').toLowerCase();
      const curNis = String(this.state.currentUser.siswa.nis || '');
      const curId = String(this.state.currentUser.siswa.id || '');

      const found = (this.state.students || []).find(s => {
        const uName = (s.name || s.studentName || '').toLowerCase();
        const uNis = String(s.nis || s.studentId || '');
        const uId = String(s.id || '');

        return (uName && uName === curName) ||
               (uNis && uNis === curNis) ||
               (uId && uId === curId) ||
               (uNis && uNis === curName) ||
               (uName && uName === curNis);
      });

      if (found) {
        this.state.currentUser.siswa = {
          id: found.id || found.studentId || found.nis || this.state.currentUser.siswa.id,
          name: found.name || found.studentName || this.state.currentUser.siswa.name,
          nis: found.nis || found.studentId || found.id || this.state.currentUser.siswa.nis,
          class: found.class || found.className || this.state.currentUser.siswa.class
        };
      }
    } else if (this.state.isLoggedIn && this.state.activeRole === 'guru') {
      const curUser = (this.state.currentUser.guru.username || '').toLowerCase();
      const curName = (this.state.currentUser.guru.name || '').toLowerCase();

      const found = (this.state.teachers || []).find(t => {
        const uName = (t.name || t.teacherName || '').toLowerCase();
        const uUser = (t.username || '').toLowerCase();
        return (uUser && uUser === curUser) || (uName && uName === curName);
      });

      if (found) {
        this.state.currentUser.guru = {
          id: found.id || this.state.currentUser.guru.id,
          name: found.name || found.teacherName || this.state.currentUser.guru.name,
          username: found.username || this.state.currentUser.guru.username,
          mapel: found.mapel || found.subject || this.state.currentUser.guru.mapel
        };
      }
    }
  }

  login(role, username) {
    this.state.isLoggedIn = true;
    this.state.activeRole = role;
    const defaultTab = (role === 'guru') ? 'beranda' : 'home';
    this.state.activeTabs[role] = defaultTab;

    if (role === 'siswa') {
      const u = String(username).toLowerCase();
      const found = (this.state.students || []).find(s => {
        const uName = (s.name || s.studentName || '').toLowerCase();
        const uNis = String(s.nis || s.studentId || '');
        const uId = String(s.id || '');

        return uName === u || uNis === u || uId === u;
      });

      if (found) {
        this.state.currentUser.siswa = {
          id: found.id || found.studentId || found.nis || username,
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
    }

    this.saveState();
  }

  logout() {
    this.state.isLoggedIn = false;
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
  }

  deleteTeacher(id) {
    const idStr = String(id);
    this.state.teachers = this.state.teachers.filter(t => String(t.id) !== idStr);
    this.saveState();

    if (isFirebaseConnected && db) {
      deleteDoc(doc(db, 'teachers', idStr)).catch(e => console.warn(e));
    }
  }

  addMapel(name) {
    const subjectId = name.replace(/\s+/g, '_').toLowerCase();
    const obj = { id: subjectId, name, nama_mapel: name };
    this.state.mapel.push(obj);
    this.saveState();

    if (isFirebaseConnected && db) {
      setDoc(doc(db, 'subjects', subjectId), {
        id: subjectId,
        nama_mapel: name,
        name: name
      }, { merge: true }).catch(e => console.warn(e));
    }
  }

  addClass(className, level) {
    const classId = className.replace(/\s+/g, '_').toLowerCase();
    const angkatan = String(level || '10');
    const obj = { id: classId, name: className, level: parseInt(level || 10), count: 0, angkatan };
    this.state.classes.push(obj);
    this.saveState();

    if (isFirebaseConnected && db) {
      setDoc(doc(db, 'classes', classId), {
        id: classId,
        nama_kelas: className,
        angkatan: angkatan,
        level: parseInt(level || 10)
      }, { merge: true }).catch(e => console.warn(e));
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
  }

  deleteSchedule(id) {
    const idStr = String(id);
    this.state.schedules = this.state.schedules.filter(s => String(s.id) !== idStr);
    this.saveState();

    if (isFirebaseConnected && db) {
      deleteDoc(doc(db, 'schedules', idStr)).catch(e => console.warn(e));
    }
  }

  addBroadcastNews(title, url) {
    const newId = String(Date.now());
    const newsObj = { id: newId, title, url };
    this.state.broadcastNews.push(newsObj);
    this.saveState();

    if (isFirebaseConnected && db) {
      setDoc(doc(db, 'news', newId), newsObj).catch(err => console.warn(err));
      setDoc(doc(db, 'broadcastNews', newId), newsObj).catch(err => console.warn(err));
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
        const newsObj = { id: idStr, title: newTitle, url: newUrl };
        setDoc(doc(db, 'news', idStr), newsObj, { merge: true }).catch(err => console.warn(err));
        setDoc(doc(db, 'broadcastNews', idStr), newsObj, { merge: true }).catch(err => console.warn(err));
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
      deleteDoc(doc(db, 'news', idStr)).catch(err => console.warn(err));
      deleteDoc(doc(db, 'broadcastNews', idStr)).catch(err => console.warn(err));
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
        const teacherObj = { id: idStr, name, username, mapel };
        setDoc(doc(db, 'teachers', idStr), teacherObj, { merge: true }).catch(err => console.warn(err));
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
        setDoc(doc(db, 'subjects', idStr), { id: idStr, name: newName, nama_mapel: newName }, { merge: true }).catch(err => console.warn(err));
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
    }
  }

  deleteStudent(id) {
    const idStr = String(id);
    this.state.students = this.state.students.filter(s => String(s.id) !== idStr && String(s.nis) !== idStr);
    this.saveState();

    if (isFirebaseConnected && db) {
      deleteDoc(doc(db, 'users', idStr)).catch(err => console.warn(err));
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
    }
  }

  // Guru Actions
  saveAttendance(date, pertemuan, mapel, className, records) {
    const existingIndex = this.state.attendance.findIndex(
      a => a.date === date && a.pertemuan === parseInt(pertemuan) && a.mapel === mapel && a.class === className
    );
    const newId = existingIndex >= 0 ? String(this.state.attendance[existingIndex].id) : String(Date.now());
    const attObj = {
      id: newId,
      date,
      pertemuan: parseInt(pertemuan),
      mapel,
      class: className,
      records
    };

    if (existingIndex >= 0) {
      this.state.attendance[existingIndex] = attObj;
    } else {
      this.state.attendance.push(attObj);
    }
    this.saveState();

    if (isFirebaseConnected && db) {
      // 1. Write to attendance_sessions (Session Document)
      const classId = className.replace(/\s+/g, '_').toLowerCase();
      const subjectId = mapel.replace(/\s+/g, '_').toLowerCase();
      const sessionId = `${date}_${classId}_${subjectId}_p${pertemuan}`;
      const sessionDocRef = doc(db, 'attendance_sessions', sessionId);

      setDoc(sessionDocRef, {
        id: sessionId,
        tanggal: date,
        class_id: classId,
        nama_kelas: className,
        subject_id: subjectId,
        nama_mapel: mapel,
        pertemuan_ke: parseInt(pertemuan),
        waktu_sesi: serverTimestamp()
      }, { merge: true }).catch(e => console.warn(e));

      // 2. Write subcollection records: attendance_sessions/{sessionId}/records/{studentId}
      Object.entries(records).forEach(([stId, statusCode]) => {
        const student = this.state.students.find(s => String(s.id) === String(stId) || String(s.nis) === String(stId));
        const stName = student ? student.name : `Siswa ${stId}`;
        const statusText = statusCode === 'H' ? 'Hadir' : statusCode === 'S' ? 'Sakit' : statusCode === 'I' ? 'Izin' : statusCode === 'A' ? 'Alpa' : statusCode;

        const recDocRef = doc(db, 'attendance_sessions', sessionId, 'records', String(stId));
        setDoc(recDocRef, {
          student_id: String(stId),
          nama_siswa: stName,
          status: statusText,
          waktu_absen: serverTimestamp()
        }, { merge: true }).catch(e => console.warn(e));

        // Legacy individual doc
        const legacyDocId = `${stId}_${date}_${pertemuan}_${mapel}`.replace(/\s+/g, '_');
        setDoc(doc(db, 'attendance', legacyDocId), {
          id: legacyDocId,
          studentId: String(stId),
          studentName: stName,
          className: className,
          date: date,
          period: String(pertemuan),
          subject: mapel,
          status: statusText
        }, { merge: true }).catch(e => console.warn(e));
      });

      // Legacy root doc
      setDoc(doc(db, 'attendance', newId), attObj).catch(e => console.warn(e));
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
  }
}

export const store = new Store();
if (typeof window !== 'undefined') {
  window.store = store;
}

