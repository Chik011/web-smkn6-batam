/* Firebase Configuration & Initialization */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  onSnapshot,
  collection,
  deleteDoc,
  getDocs,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

// User provided Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyB5n2qH6F2UBKDM3G4Dq8NW5Cn7xA01aDA",
  authDomain: "tkjsmk6-714ce.firebaseapp.com",
  projectId: "tkjsmk6-714ce",
  storageBucket: "tkjsmk6-714ce.firebasestorage.app",
  messagingSenderId: "171441452681",
  appId: "1:171441452681:web:da4aecbd76d2c08b48b858",
  measurementId: "G-KJG6JGLVE2"
};

let app = null;
let db = null;
let auth = null;
let isFirebaseConnected = false;

try {
  app = initializeApp(firebaseConfig);
  try {
    db = getFirestore(app, 'muridtkj');
    console.log('✅ Connected to Cloud Firestore Database "muridtkj"');
  } catch (err) {
    db = getFirestore(app);
    console.log('✅ Connected to Cloud Firestore Default Database');
  }
  auth = getAuth(app);
  isFirebaseConnected = true;
  console.log('✅ Firebase initialized successfully for SMKN 6 Web (Project ID:', firebaseConfig.projectId + ')');
} catch (error) {
  console.warn('⚠️ Firebase initialization warning:', error);
}

// Helper to extract YouTube Video ID, Embed URL, and High-Res Thumbnail URL
export function getYouTubeDetails(url) {
  if (!url) return { id: '', embedUrl: '', thumbnailUrl: '' };
  
  let videoId = '';
  const cleanUrl = String(url).trim();

  try {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = cleanUrl.match(regExp);

    if (match && match[1]) {
      videoId = match[1];
    } else if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
      videoId = cleanUrl;
    } else {
      const urlObj = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
      if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1).split('?')[0].split('/')[0];
      } else if (urlObj.hostname.includes('youtube.com')) {
        if (urlObj.pathname.includes('/embed/')) {
          videoId = urlObj.pathname.split('/embed/')[1].split('?')[0].split('/')[0];
        } else if (urlObj.pathname.includes('/shorts/')) {
          videoId = urlObj.pathname.split('/shorts/')[1].split('?')[0].split('/')[0];
        } else {
          videoId = urlObj.searchParams.get('v') || '';
        }
      }
    }
  } catch (e) {
    console.warn("YouTube URL parser notice:", e);
  }

  if (videoId && videoId.length === 11) {
    return {
      id: videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };
  }

  return { id: '', embedUrl: cleanUrl, thumbnailUrl: '' };
}

export { app, db, auth, isFirebaseConnected, doc, setDoc, onSnapshot, collection, deleteDoc, getDocs, serverTimestamp };


