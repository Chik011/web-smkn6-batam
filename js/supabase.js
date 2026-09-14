/* Supabase Client Configuration & Helper Functions */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const SUPABASE_URL = 'https://npjraxiuwtchokzfknka.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_4dfUyYMnO5vU689jG1YTyg_2xEyxxLq';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('⚡ Supabase Client initialized successfully for SMKN 6 Web!');

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

// Helper to upload images directly to Cloudinary
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
  window.supabase = supabase;
}
