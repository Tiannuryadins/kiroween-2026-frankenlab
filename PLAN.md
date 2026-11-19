# PLAN.md — Kiroween 2026: FrankenLab

**Repo target:** `github.com/Tiannuryadins/kiroween-2026-frankenlab` (published 19 Nov 2026 after user approval)
**Deadline submit:** Sabtu 5 Des 2026 05:00 WIB (Fri 4 Dec 2026 14:00 PT)
**Status (19 Nov 2026):** build selesai, 19/19 test lolos (verified); repo dipublish 19 Nov

## Kategori terpilih: Frankenstein ($5.000)

**Alasan:**
1. **Paling cocok untuk agen.** Satu aplikasi web statis, tanpa backend, tanpa API berbayar, tanpa login — sepenuhnya bisa dibangun, diuji, dan di-deploy (GitHub Pages) oleh agen dalam sisa waktu (~16 hari).
2. **Konsepnya ADALAH kategorinya.** Frankenstein = "stitch together a chimera of technologies into one app". FrankenLab menjahit teknologi yang tidak nyambung — gambar SVG prosedural + sintesis suara WebAudio + efek petir Canvas + PRNG ber-seed + state sharing via URL hash + localStorage — menjadi satu aplikasi hidup. Narasi kategorinya menulis dirinya sendiri.
3. **Skeleton Crew ditolak:** wajib 2 aplikasi terpisah dari satu fondasi = scope 2x, risiko tidak selesai.
4. **Resurrection ditolak:** butuh menghidupkan teknologi mati secara kredibel — sulit didemo dan dinilai "real problem" oleh juri.
5. **Costume Contest ditolak:** intinya polish UI; lemah di kriteria juri "Technological Implementation" (seberapa dalam Kiro dipakai), yang justru kekuatan kita (specs + hooks + steering).
6. **Hadiah:** Best Frankenstein $5.000 + masih eligible Overall 1st $30.000 / 2nd $20.000 / 3rd $10.000 + Best Demo $1.000 + Bonus Blog Prize (2.000 kredit Kiro, 100 pemenang).

## Konsep: FrankenLab — Stitch-Your-Own Monster Laboratory

Laboratorium tempat pengguna **menjahit monsternya sendiri** dari potongan-potongan monster klasik, lalu menghidupkannya dengan sambaran petir.

**Fitur:**
1. **Meja Jahit (Stitch Table):** pilih bagian tubuh per slot — kepala (Vampire, Witch, Mummy, Pumpkin), torso (Zombie, Golem, Ghost), lengan (Werewolf, Skeleton, Robot), kaki (Frankenstein's Monster, Spider, Slime). Setiap bagian dirender sebagai SVG, dijahit jadi satu monster di atas meja operasi.
2. **Lightning Strike:** tombol "IT'S ALIVE!" — animasi petir Canvas + suara guntur/zap hasil sintesis WebAudio (tanpa file audio), monster "hidup" (mata menyala, animasi).
3. **Nama & Statistik prosedural:** generator nama dari suku kata berdasarkan bagian yang dipilih + stat roll (Strength / Spook / Charm 1–10) + skor Power — deterministik dari seed (mulberry32), jadi monster bisa direproduksi.
4. **Lab Journal:** simpan monster ke jurnal lokal (localStorage), muat lagi, hapus.
5. **Bagikan monster:** encode monster ke URL hash (base64url JSON) — buka link = monster yang sama muncul.
6. **Monster of the Day:** monster harian deterministik dari tanggal (seed = YYYY-MM-DD).
7. **Randomize ("Mashup"):** acak semua slot sekaligus.

**Teknologi yang dijahit (chimera):** SVG prosedural + WebAudio synthesis + Canvas FX + seeded PRNG + URL-hash state encoding + localStorage persistence — semua dalam satu aplikasi statis tanpa dependensi, tanpa build step, tanpa API key.

## Stack

- Vanilla HTML/CSS/JS (ES modules), zero dependency, zero build step.
- `src/monster.js` — logika murni (testable di Node).
- `src/audio.js` — sintesis suara WebAudio (browser only).
- `src/app.js` — wiring DOM.
- `index.html`, `styles.css` — UI.
- `tests/test.mjs` — `node:test` bawaan Node 24.
- Deploy: GitHub Pages (static).

## Cara Kiro dipakai (jujur — untuk write-up submit)

- **Kiro CLI 3.3.0** (sudah login via GitHub, akun user `tian.nuryadin@gmail.com`) dipakai untuk implementasi: spec ditulis dulu di `.kiro/specs/frankenlab/`, lalu `kiro-cli chat --no-interactive` mengimplementasikan aplikasi mengikuti spec + membuat test hijau.
- **Spec-driven development:** `requirements.md` (EARS-style) → `design.md` (kontrak API) → `tasks.md` → implementasi → `npm test`.
- **Steering docs:** `.kiro/steering/` (product, tech, structure) menjaga konsistensi gaya & stack.
- **Agent hooks:** `.kiro/hooks/test-on-save.json` — menjalankan `npm test` setiap kali Kiro menyimpan/mengedit file `src/*.js`.
- **Yang dikerjakan manual (bukan Kiro):** PLAN.md ini, spec + steering + test contract ditulis oleh agen pendamping (Muse) sebelum memanggil Kiro CLI; verifikasi akhir & laporan juga manual. Jangan klaim sebaliknya di write-up.
- **Kredit Kiro:** akun free tier; kredit gratis 4.000 Kiroween via Credit Request Form BELUM diminta (langkah user, deadline 1 Des 12:00 PT).

## Langkah yang HANYA bisa dilakukan user

1. **Akun Kiro / kredit:** isi Credit Request Form (butuh Kiro user ID / AWS account ID) paling lambat 1 Des 12:00 PT — opsional, hanya bila kredit free tier habis.
2. **Push ke GitHub:** repo `kiroween-2026-frankenlab` belum dibuat; push butuh kode sudo GitHub user (kode dikirim ke email, kedaluwarsa cepat).
3. **Registrasi Devpost:** daftar di kiroween.devpost.com + isi form submit (repo URL, URL aplikasi live, deskripsi, write-up Kiro, pilih kategori Frankenstein + bonus).
4. **Video demo:** rekam demo <3 menit, upload ke YouTube (publik), pasang link di form submit.
5. **Deploy Pages:** aktifkan GitHub Pages dari repo (atau agen bisa bantu setelah push).
6. **(Opsional) Social Blitz / Bonus Blog:** posting sosial dengan hashtag #KiroweenHackathon26 atau posting blog — JANGAN dilakukan agen tanpa instruksi (aturan: agen tidak posting ke X/sosial media).

## Checklist fase 1

- [x] Verifikasi halaman Devpost resmi (kategori, hadiah, deadline, syarat /.kiro)
- [x] Kiro CLI 3.3.0 terinstal & sudah login (GitHub, tian.nuryadin@gmail.com)
- [x] Kategori + konsep dipilih (Frankenstein / FrankenLab)
- [x] Scaffold: `.kiro/` (specs, steering, hooks), `src/`, `tests/`, LICENSE MIT, README, package.json
- [x] Test contract ditulis (`tests/test.mjs`)
- [x] Implementasi oleh Kiro CLI dari spec (chat non-interaktif, engine V2 — lihat catatan Kiro di bawah)
- [x] `npm test` hijau (19/19)
- [x] Smoke test lokal (HTTP server: semua aset 200; tidak ada headless browser di VM jadi cek DOM visual belum bisa)
- [ ] Siap push (lapor ke user)

## Catatan Kiro CLI di VM ini (penting, 19 Nov 2026)

- Kiro CLI 3.3.0 sudah terinstal di `~/.local/bin/kiro-cli` (sejak 17 Nov) dan **sudah login via GitHub** (`tian.nuryadin@gmail.com`) — tidak perlu login baru.
- **Engine V3 GAGAL di VM ini:** semua sesi `chat` (default V3, model haiku-4.5 maupun auto) mati dengan `ServerConnectionResetError` / "connection was interrupted" begitu model mulai generate substansial + tool use (3x percobaan). Balasan pendek ("PUMPKIN") berhasil — jadi login + koneksi dasar OK, yang putus adalah streaming panjang (kemungkinan egress proxy memutus koneksi streaming lama).
- **Engine V2 BERHASIL:** `kiro-cli chat --v2 --no-interactive` menyelesaikan semua chunk implementasi (monster.js, audio.js, UI). Jadi build didorong penuh dengan Kiro V2.
- **Pembagian kerja yang jujur:** PLAN.md, spec (requirements/design/tasks), steering, dan test contract ditulis manual oleh agen pendamping (Muse); kode aplikasi (`src/monster.js`, `src/audio.js`, `src/app.js`, `index.html`, `styles.css`) ditulis oleh Kiro CLI V2 dari spec tersebut. Edit manual kecil: perbaikan script `npm test` (bentuk direktori `node --test tests/` tidak didukung Node 24.22.1 → `node --test tests/test.mjs`) dan hapus 1 link eksternal di footer index.html agar klaim zero-external-URL airtight.
- Tidak ada headless browser (chromium/firefox) di VM — verifikasi visual/DOM di browser belum dilakukan; perlu dicek user saat Pages live atau via browser agent.
