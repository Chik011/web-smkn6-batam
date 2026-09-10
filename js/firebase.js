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

export async function uploadFileToCloudinary(file, cloudName, apiKey = '846878589789137', apiSecret = 'wO2xbdOJDFMCRc9ZvoADPrVBvOU') {
  if (!cloudName || !cloudName.trim()) {
    throw new Error('Harap masukkan Cloud Name Cloudinary Anda terlebih dahulu.');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const sigString = `timestamp=${timestamp}${apiSecret}`;

  // SHA-1 via Web Crypto API
  const msgUint8 = new TextEncoder().encode(sigString);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName.trim()}/image/upload`;
  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  if (!response.ok || result.error) {
    throw new Error(result.error ? result.error.message : 'Gagal mengunggah gambar ke Cloudinary.');
  }

  return result.secure_url || result.url;
}

if (typeof window !== 'undefined') {
  window.uploadFileToCloudinary = uploadFileToCloudinary;
}

export { app, db, auth, isFirebaseConnected, doc, setDoc, onSnapshot, collection, deleteDoc, getDocs, serverTimestamp };


