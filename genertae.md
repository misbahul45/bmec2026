## 🧠 SYSTEM PROMPT — STRICT ENGINEERING RULES

### ⚠️ CORE PRINCIPLE

Sebelum melakukan generate kode atau UI apapun, WAJIB melakukan analisis terhadap sistem yang sudah ada. Jangan pernah langsung generate tanpa memahami context.

---

## 1. 🔍 ANALYZE GLOBAL PATTERN FIRST

* Baca dan pahami **global CSS / design system**
* Identifikasi:

  * Color tokens (`--primary`, `--secondary`, `--accent`, dll)
  * Typography & font system
  * Spacing & radius scale
* **DILARANG** membuat warna baru di luar token global
* Gunakan **existing design language** secara konsisten

---

## 2. 🧩 FOLLOW UI & CODE ARCHITECTURE

* Pelajari struktur UI yang sudah ada:

  * Component pattern (atomic / modular)
  * Naming convention
  * Props pattern & reuse logic

* Ikuti:

  * Struktur folder
  * Cara penulisan component
  * State & animation pattern (GSAP, hooks, dll)

* **JANGAN:**

  * Membuat komponen yang out of pattern
  * Menggunakan styling yang tidak konsisten
  * Over-engineer tanpa alasan jelas

---

## 3. 🗄️ BACKEND & DATA FLOW AWARENESS

Jika task melibatkan API / database:

### WAJIB:

* Baca dulu:

  * Database schema / struktur data
  * Naming table & field
  * Existing API pattern (REST / RPC / dll)

### Baru kemudian:

* Design flow API
* Pastikan:

  * Konsisten dengan naming backend
  * Tidak membuat endpoint redundant
  * Data flow efisien & scalable

---

## 4. 🎨 UI GENERATION RULES

* UI harus:

  * Konsisten dengan design system
  * Responsive (mobile-first)
  * Clean & modern
* Gunakan:

  * Tailwind sesuai config
  * Variabel warna global (tidak hardcode)

---

## 5. ⚡ ANIMATION RULES (GSAP)

* Gunakan GSAP secara:

  * Smooth
  * Natural (ease: power, expo, dll)
* Hindari:

  * Animasi berlebihan
  * Motion yang tidak punya purpose

---

## 6. 🚫 HARD CONSTRAINTS

* ❌ Jangan buat warna baru
* ❌ Jangan ignore existing pattern
* ❌ Jangan lompat ke coding tanpa analisis
* ❌ Jangan bikin struktur baru tanpa alasan

---

## 7. ✅ OUTPUT EXPECTATION

* Clean code
* Reusable component
* Konsisten dengan system
* Scalable & maintainable

