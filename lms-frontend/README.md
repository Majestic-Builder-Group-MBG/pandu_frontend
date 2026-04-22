# PanduLMS Frontend (Scholarly)

Frontend untuk aplikasi Learning Management System (LMS) bernama **Scholarly**. Aplikasi ini berfokus pada alur pembelajaran berbasis **modul** dan **sesi**, dengan dukungan **materi (file/url/teks)**, **quiz per sesi**, **enrollment berbasis key**, serta **reminder + web push** untuk sesi yang terjadwal.

Repo ini adalah proyek **Vue 3 + Vite** dengan **Pinia** (state management), **Vue Router** (routing), dan **TailwindCSS** (styling).

## Ringkasan Fitur

1. Autentikasi
1. Modul (courses)
1. Sesi per modul
1. Materi sesi (file/url/teks)
1. Quiz per sesi
1. Publish/unpublish quiz
1. Attempts quiz (student)
1. Review attempts (teacher/admin) untuk jawaban essay
1. Enrollment menggunakan key (student)
1. Reminder sesi + integrasi Web Push (opsional)
1. Admin: registration codes untuk onboarding user

## Role & Akses

1. **student**
1. Hanya melihat modul yang sudah di-enroll
1. Bisa enroll modul via enrollment key
1. Mengakses materi dan quiz ketika sesi sudah dibuka (berdasarkan schedule)
1. Bisa mengaktifkan reminder sesi (termasuk request permission notifikasi jika Web Push didukung)

1. **teacher**
1. Melihat semua modul
1. Membuat modul baru
1. Mengelola sesi (tambah/ubah/hapus)
1. Mengelola materi sesi
1. Mengelola quiz (buat, edit, publish, kelola soal, lihat attempts, review essay)
1. Mengelola registration codes (akses halaman `/registration-codes`)

1. **admin**
1. Semua kemampuan teacher
1. Mengelola registration codes (termasuk target role teacher)

Catatan: guard akses dilakukan lewat `src/router/index.js` memakai meta `requiresAuth` dan `roles`.

## Teknologi

1. Vue 3 (SFC + `<script setup>`)
1. Vite
1. Pinia
1. Vue Router
1. TailwindCSS
1. Service Worker sederhana untuk Web Push (`public/sw.js`)

## Requirement

1. Node.js (disarankan versi LTS)
1. npm

## Menjalankan Project

1. Install dependencies

```bash
npm install
```

1. Jalankan dev server

```bash
npm run dev
```

1. Build untuk produksi

```bash
npm run build
```

1. Preview hasil build

```bash
npm run preview
```

## Konfigurasi Environment

Konfigurasi utama ada di `src/config/env.js`.

1. `VITE_API_BASE_URL`
1. Base URL backend API.
1. Default (jika env tidak diset): `http://192.168.1.2:8001`.

1. `VITE_VAPID_PUBLIC_KEY`
1. Public key untuk Web Push.
1. Wajib jika ingin mengaktifkan subscribe push di browser.

Contoh `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8001
VITE_VAPID_PUBLIC_KEY=YOUR_VAPID_PUBLIC_KEY
```

## HTTPS Dev Server (Penting)

`vite.config.js` dikonfigurasi memakai HTTPS dan membaca sertifikat dari folder `../cert`.

1. Pastikan file sertifikat ada sesuai path di `vite.config.js`.
1. Jika tidak membutuhkan HTTPS di local, nonaktifkan bagian `server.https` di `vite.config.js`.

## Navigasi & Route

Route utama ada di `src/router/index.js`.

1. `/dashboard` (requiresAuth)
1. `/courses` (requiresAuth)
1. `/courses/:moduleId` (requiresAuth)
1. `/courses/:moduleId/sessions/:sessionId/quiz` (requiresAuth)
1. `/quiz` (requiresAuth)
1. `/registration-codes` (requiresAuth, roles: admin/teacher)
1. `/login`
1. `/register`

Layout ditentukan oleh `route.meta.layout`.

1. `default`: `src/layouts/DefaultLayout.vue`
1. `auth`: `src/layouts/AuthLayout.vue`

## Struktur Folder

Struktur penting di `src/`:

1. `src/views/`
1. Halaman (Dashboard, Courses, Module Sessions, Quiz, Auth, Admin)

1. `src/components/`
1. Komponen UI dan komponen domain (dashboard, sessions, modules, enroll, dll)

1. `src/stores/`
1. Pinia store (auth, modules, enrollments, moduleBanners)

1. `src/services/`
1. API client dan service layer untuk setiap domain

1. `src/composables/`
1. Logic reusable untuk halaman besar (mis. module sessions: contents, schedule, reminder)

1. `src/config/`
1. Konfigurasi environment

1. `public/`
1. Asset publik dan `sw.js` untuk push notification

## Arsitektur Singkat

### State (Pinia)

1. `auth` (`src/stores/auth.js`)
1. Menyimpan `user` dan `token`.
1. Persist ke localStorage key: `pandu:lms:auth`.
1. `logout()` juga membersihkan cache banner dan enrollment store.

1. `modules` (`src/stores/modules.js`)
1. Menyimpan daftar modul yang di-load dari backend.
1. Menyediakan `getById(id)`.

1. `enrollments` (`src/stores/enrollments.js`)
1. Menyimpan modul yang di-enroll oleh student.
1. Membentuk `moduleIdSet` untuk filtering modul yang boleh diakses.

1. `moduleBanners` (`src/stores/moduleBanners.js`)
1. Mengelola object URL untuk banner agar tidak leak (pakai `URL.createObjectURL` dan `URL.revokeObjectURL`).

### Service Layer

Service container dibuat via `getServices()` (`src/services/container.js`).

1. `ApiClient` (`src/services/api/ApiClient.js`)
1. Wrapper `fetch()`.
1. Menyuntikkan header `Authorization: Bearer <token>` dari auth store.
1. Mendukung `dedupe` (menghindari request GET duplikat), `cacheTTL`, dan `cancelPrevious`.
1. Mendukung `responseType` (`json` | `text` | `blob`).

Service domain yang dipakai:

1. `AuthService`
1. `RegisterCodesService`
1. `ModulesService`
1. `SessionsService`
1. `QuizzesService`
1. `EnrollmentsService`
1. `DashboardService`
1. `RemindersService`
1. `PushSubscriptionsService`

### Composables

Halaman `ModuleSessionsView` memecah logic ke beberapa composable:

1. `useModuleSessions`: load, create, delete sesi
1. `useSessionContents`: load, add/edit/delete materi, download/view file
1. `useSessionSchedule`: membaca dan mengatur jadwal open_at sesi
1. `useSessionReminder`: toggle reminder + subscribe Web Push

## Spesifikasi Data & API (Yang Dipakai FE)

Bagian ini mencatat endpoint yang dipanggil oleh frontend berdasarkan implementasi `src/services/**`. Nama field mengikuti best-effort normalisasi di code (bisa menerima variasi `snake_case` dan `camelCase`).

### Auth

1. `POST /api/auth/login`
1. `POST /api/auth/register`
1. `POST /api/auth/logout`

### Registration Codes

1. `GET /api/auth/register-codes`
1. `GET /api/auth/register-codes/summary`
1. `POST /api/auth/register-codes`
1. `GET /api/auth/register-codes/:codeId/usages`
1. `PATCH /api/auth/register-codes/:codeId/revoke`
1. `PATCH /api/auth/register-codes/expired/archive`
1. `DELETE /api/auth/register-codes/expired`

### Modules

1. `GET /api/modules`
1. `GET /api/modules/:moduleId`
1. `POST /api/modules` (multipart: `name`, `description?`, `banner?`)
1. `PUT /api/modules/:moduleId` (multipart: `name?`, `description?`, `enroll_key?`, `banner?`)
1. `PATCH /api/modules/:moduleId/regenerate-enroll-key`
1. `DELETE /api/modules/:moduleId`
1. `GET /api/modules/:moduleId/banner` (blob)

### Enrollments

1. `POST /api/enrollments/enroll` (body: `{ enroll_key }`)
1. `GET /api/enrollments/me?page=&per_page=`

### Sessions

1. `GET /api/modules/:moduleId/sessions`
1. `POST /api/modules/:moduleId/sessions` (body: `{ title, description? }`)
1. `PUT /api/modules/:moduleId/sessions/:sessionId` (body: `{ title?, description?, sort_order? }`)
1. `DELETE /api/modules/:moduleId/sessions/:sessionId` (best-effort, backend bisa 404 jika tidak ada)

### Session Contents

1. `GET /api/modules/:moduleId/sessions/:sessionId/contents`
1. `POST /api/modules/:moduleId/sessions/:sessionId/contents` (multipart: `content_type`, `title?`, `file?`, `url?`, `text_content?`)
1. `PUT /api/modules/:moduleId/sessions/:sessionId/contents/:contentId` (multipart)
1. `DELETE /api/modules/:moduleId/sessions/:sessionId/contents/:contentId`
1. `GET /api/modules/:moduleId/sessions/:sessionId/contents/:contentId/file` (blob)
1. `POST /api/modules/:moduleId/sessions/:sessionId/contents/:contentId/view-url` (membuat public view URL jika backend mendukung)

### Session Schedule

1. `GET /api/modules/:moduleId/sessions/:sessionId/schedule`
1. `PATCH /api/modules/:moduleId/sessions/:sessionId/schedule` (body: `{ open_at: string | null }`)

### Quiz

1. `GET /api/modules/:moduleId/sessions/:sessionId/quiz`
1. `POST /api/modules/:moduleId/sessions/:sessionId/quiz` (multipart: `title`, `description?`, `banner?`, `duration_minutes?`, `max_attempts?`, `passing_score?`)
1. `PUT /api/modules/:moduleId/sessions/:sessionId/quiz` (multipart: `title?`, `description?`, `banner?`, `remove_banner?`, `duration_minutes?`, `max_attempts?`, `passing_score?`)
1. `PATCH /api/modules/:moduleId/sessions/:sessionId/quiz/publish` (body: `{ is_published: boolean }`)
1. `GET /api/modules/:moduleId/sessions/:sessionId/quiz/banner` (blob)

### Quiz Questions

1. `POST /api/modules/:moduleId/sessions/:sessionId/quiz/questions` (multipart: `question_type`, `question_text`, `points?`, `options?`, `media?`)
1. `PUT /api/modules/:moduleId/sessions/:sessionId/quiz/questions/:questionId` (multipart)
1. `DELETE /api/modules/:moduleId/sessions/:sessionId/quiz/questions/:questionId`
1. `GET /api/modules/:moduleId/sessions/:sessionId/quiz/questions/:questionId/media` (blob)

### Quiz Attempts

1. `POST /api/modules/:moduleId/sessions/:sessionId/quiz/start`
1. `POST /api/modules/:moduleId/sessions/:sessionId/quiz/submit` (body: `{ attempt_id, answers: [] }`)
1. `GET /api/modules/:moduleId/sessions/:sessionId/quiz/attempts`
1. `GET /api/modules/:moduleId/sessions/:sessionId/quiz/attempts/:attemptId`
1. `PATCH /api/modules/:moduleId/sessions/:sessionId/quiz/attempts/:attemptId/review` (body: `{ reviews: [] }`)

### Dashboard

1. `GET /api/dashboard/upcoming-sessions?page=&per_page=`

### Reminders

1. `GET /api/modules/:moduleId/sessions/:sessionId/reminder`
1. `PUT /api/modules/:moduleId/sessions/:sessionId/reminder` (body: `{ enabled, channel, notify_before_minutes }`)
1. `DELETE /api/modules/:moduleId/sessions/:sessionId/reminder`
1. `GET /api/reminders/me?page=&per_page=`

### Push Subscriptions

1. `POST /api/push/subscriptions` (body: `{ subscription, platform, user_agent }`)
1. `DELETE /api/push/subscriptions` (body: `{ endpoint }`)
1. `GET /api/push/subscriptions/me?page=&per_page=`

## Web Push (Service Worker)

Service worker ada di `public/sw.js`.

1. Event `push`: menampilkan notifikasi.
1. Event `notificationclick`: membuka atau fokus ke tab aplikasi dan navigate ke URL yang dikirim payload.

Integrasi client ada di `src/services/push/webPush.js` dan dipakai oleh `useSessionReminder`.

## Rencana: AI Generate Soal Quiz (Planned)

Fitur ini belum ada implementasinya, tetapi **rencananya** akan ditambahkan untuk membantu teacher/admin membuat soal otomatis berdasarkan materi modul per sesi.

### Tujuan

1. Mengurangi waktu pembuatan soal.
1. Menjaga konsistensi format soal.
1. Menghasilkan variasi soal dari sumber yang sama (materi sesi).

### User Flow (Rencana)

1. Teacher/admin membuka halaman quiz sesi: `/courses/:moduleId/sessions/:sessionId/quiz`.
1. Pada tab `Soal`, tersedia tombol `AI Generate`.
1. User memilih parameter generate.
1. Sistem membuat draft soal (belum publish), user bisa review dan edit sebelum menyimpan.

### Parameter Generate (Rencana)

1. `source`: materi sesi saat ini (contents: text, url, file yang bisa diekstrak)
1. `count_mcq`: jumlah soal pilihan ganda
1. `count_essay`: jumlah soal essay
1. `difficulty`: easy | medium | hard
1. `language`: id | en
1. `taxonomy`: optional (mis. Bloom level)
1. `constraints`: optional (panjang soal, gaya, larangan tertentu)

### Kontrak API (Usulan)

Endpoint di bawah adalah usulan agar FE dan BE punya titik temu lebih awal. Nama endpoint bisa disesuaikan.

1. `POST /api/modules/:moduleId/sessions/:sessionId/quiz/ai-generate`

Contoh request:

```json
{
  "count_mcq": 10,
  "count_essay": 2,
  "difficulty": "medium",
  "language": "id",
  "include_session_contents": true
}
```

Contoh response (draft questions):

```json
{
  "questions": [
    {
      "question_type": "mcq",
      "question_text": "...",
      "points": 10,
      "options": [
        { "option_text": "...", "is_correct": true },
        { "option_text": "...", "is_correct": false }
      ],
      "explanation": "..."
    }
  ]
}
```

Catatan implementasi FE (rencana): hasil generate akan langsung dipetakan ke format yang sudah dipakai `QuizzesService.addQuestion()` agar bisa disimpan satu per satu atau batch.

## Catatan Implementasi Penting

1. Normalisasi list response: `normalizeListResponse()` saat ini menerima array di `res.data`, atau `res.data.sessions`, atau `res.data.contents`. Jika backend menaruh list di lokasi berbeda, FE perlu disesuaikan.
1. Object URL (banner dan media): selalu revoke untuk mencegah memory leak.
1. Token disimpan di localStorage. Untuk keamanan, pastikan backend memakai TTL dan mekanisme revoke.

## Troubleshooting

1. Error HTTPS saat `npm run dev`
1. Penyebab umum: file cert yang dirujuk di `vite.config.js` tidak ada.
1. Solusi: sediakan cert tersebut atau nonaktifkan `server.https`.

1. Tidak bisa mengaktifkan reminder
1. Pastikan `VITE_VAPID_PUBLIC_KEY` tersedia.
1. Pastikan browser mendukung Web Push.
1. Pastikan backend endpoint push subscription tersedia.

## Lisensi

Ikuti lisensi di root repo.
