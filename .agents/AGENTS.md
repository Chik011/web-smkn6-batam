# Project Rules & Customizations

## Auto-Deploy Workflow
- Setiap kali selesai membuat/mengubah kode atau fitur di proyek ini, AI Agent WAJIB langsung menjalankan verifikasi build (`npm run build`), lalu melakukan **commit** dan **push** otomatis ke repository GitHub (`git add .`, `git commit -m "..."`, `git push origin main`).
- Hal ini dilakukan agar repository GitHub dan hosting (Vercel) selalu ter-update secara otomatis secara real-time di setiap akhir pengerjaan tugas.
