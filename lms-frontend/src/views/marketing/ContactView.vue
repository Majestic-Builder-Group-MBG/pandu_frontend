<template>
  <div>
    <MarketingHeader />

    <main class="mx-auto w-full max-w-6xl px-4 pb-10 pt-28 sm:pt-32">
      <section class="ink-card bg-paper-grid p-8">
        <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Demo</p>
        <h1 class="mt-2 text-4xl font-extrabold">AI Generate Kuis (PDF)</h1>
        <p class="mt-4 max-w-3xl text-sm font-semibold text-ink/70">
          Ini halaman demo untuk menampilkan fitur unggulan: generate draft soal dari PDF.
          Seluruh proses berjalan lokal di browser dan tidak disimpan ke database.
        </p>
      </section>

      <section class="mt-8 grid items-start gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article class="ink-card self-start bg-paper p-7">
          <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Input</p>
          <h2 class="mt-2 text-2xl font-extrabold">Upload PDF</h2>
          <p class="mt-3 text-sm font-semibold text-ink/70">
            Pilih file PDF materi. Setelah itu klik tombol generate untuk membuat draft soal.
          </p>

          <div class="mt-6 grid gap-3">
            <label class="block">
              <span class="text-sm font-extrabold">File PDF</span>
              <input
                type="file"
                accept="application/pdf,.pdf"
                class="mt-2 block w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-ink outline-none ring-ink/10 file:mr-4 file:rounded-lg file:border-0 file:bg-accent/60 file:px-3 file:py-2 file:text-sm file:font-extrabold focus:ring"
                @change="onPickFile"
              />
              <p v-if="fileMeta" class="mt-2 text-xs font-bold text-ink/60">
                {{ fileMeta }}
              </p>
              <p v-if="error" class="mt-2 text-xs font-extrabold text-red-600">
                {{ error }}
              </p>
            </label>

            <label class="block">
              <span class="text-sm font-extrabold">Jumlah soal</span>
              <div class="mt-2 grid grid-cols-2 gap-3">
                <input
                  v-model.number="count"
                  type="number"
                  min="3"
                  max="12"
                  class="ink-input"
                />
                <select v-model="difficulty" class="ink-input">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <p class="mt-2 text-xs font-bold text-ink/60">Batas demo: 3-12 soal.</p>
            </label>

            <div class="mt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                class="inline-flex rounded-xl border-2 border-ink bg-accent px-5 py-3 text-sm font-extrabold shadow-ink transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
                :disabled="!file || status === 'loading'"
                @click="generate"
              >
                {{ status === 'loading' ? 'Generating...' : 'Generate Soal' }}
              </button>

              <button
                type="button"
                class="text-sm font-extrabold text-ink/70 hover:text-ink hover:underline underline-offset-4 disabled:opacity-50"
                :disabled="status === 'loading'"
                @click="reset"
              >
                Reset
              </button>
            </div>

            <p class="mt-3 text-xs font-bold text-ink/60">
              Catatan: demo ini tidak mengirim file ke server. Draft dibuat untuk presentasi, bukan untuk penilaian produksi.
            </p>
          </div>
        </article>

        <section class="ink-card bg-paper p-7">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Output</p>
              <h2 class="mt-2 text-2xl font-extrabold">Draft Soal</h2>
              <p class="mt-3 text-sm font-semibold text-ink/70">
                Hasil generate akan muncul di sini. Kamu bisa copy untuk ditunjukkan ke juri.
              </p>
            </div>

            <button
              type="button"
              class="text-sm font-extrabold text-ink/70 hover:text-ink hover:underline underline-offset-4 disabled:opacity-50"
              :disabled="!questions.length"
              @click="copyAll"
            >
              Copy all
            </button>
          </div>

          <div v-if="!questions.length" class="mt-6 rounded-2xl bg-cloud p-6">
            <p class="text-sm font-extrabold">Belum ada output.</p>
            <p class="mt-2 text-sm font-semibold text-ink/70">
              Upload PDF lalu klik generate. Untuk demo, kita buat campuran MCQ dan short-answer.
            </p>
          </div>

          <ol v-else class="mt-6 grid gap-3">
            <li v-for="q in questions" :key="q.id" class="rounded-2xl bg-cloud p-5">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">
                    {{ q.type.toUpperCase() }} • {{ q.difficulty.toUpperCase() }}
                  </p>
                  <p class="mt-2 text-sm font-extrabold">{{ q.prompt }}</p>
                </div>
                <button
                  type="button"
                  class="shrink-0 text-xs font-extrabold text-ink/60 hover:text-ink hover:underline underline-offset-4"
                  @click="copyOne(q)"
                >
                  Copy
                </button>
              </div>

              <div v-if="q.type === 'mcq'" class="mt-3 grid gap-2">
                <p v-for="(c, idx) in q.choices" :key="idx" class="text-sm font-semibold text-ink/70">
                  {{ String.fromCharCode(65 + idx) }}. {{ c }}
                </p>
                <p class="mt-2 text-xs font-bold text-ink/60">Answer: {{ q.answer }}</p>
              </div>

              <div v-else class="mt-3">
                <p class="text-sm font-semibold text-ink/70">(Jawaban singkat, bebas)</p>
                <p class="mt-2 text-xs font-bold text-ink/60">Rubric: {{ q.rubric }}</p>
              </div>
            </li>
          </ol>
        </section>
      </section>
    </main>

    <MarketingFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'

import MarketingHeader from '@/components/marketing/MarketingHeader.vue'
import MarketingFooter from '@/components/marketing/MarketingFooter.vue'

const file = ref(null)
const fileMeta = ref('')
const error = ref('')
const status = ref('idle')

const count = ref(6)
const difficulty = ref('medium')
const questions = ref([])

function onPickFile(e) {
  error.value = ''
  questions.value = []

  const f = e?.target?.files?.[0] || null
  file.value = f
  if (!f) {
    fileMeta.value = ''
    return
  }

  const isPdf = f.type === 'application/pdf' || (typeof f.name === 'string' && f.name.toLowerCase().endsWith('.pdf'))
  if (!isPdf) {
    file.value = null
    fileMeta.value = ''
    error.value = 'File harus PDF.'
    return
  }

  const mb = (f.size / (1024 * 1024)).toFixed(2)
  fileMeta.value = `${f.name} • ${mb} MB`
}

function reset() {
  file.value = null
  fileMeta.value = ''
  error.value = ''
  status.value = 'idle'
  questions.value = []
  count.value = 6
  difficulty.value = 'medium'
}

function seedFromFile(f) {
  if (!f) return 123456
  const nameSeed = Array.from(String(f.name || '')).reduce((a, ch) => a + ch.charCodeAt(0), 0)
  return (nameSeed + (f.size || 0)) % 2147483647
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick(rand, arr) {
  return arr[Math.floor(rand() * arr.length)]
}

async function generate() {
  error.value = ''
  questions.value = []

  if (!file.value) {
    error.value = 'Pilih PDF dulu.'
    return
  }

  const n = Number(count.value)
  if (!Number.isFinite(n) || n < 3 || n > 12) {
    error.value = 'Jumlah soal harus 3-12.'
    return
  }

  status.value = 'loading'
  try {
    // Pure demo: generate locally with deterministic seed.
    await new Promise((r) => setTimeout(r, 650))

    const seed = seedFromFile(file.value)
    const rand = mulberry32(seed)

    const topics = [
      'konsep utama materi',
      'definisi dan contoh',
      'perbandingan dua konsep',
      'studi kasus sederhana',
      'langkah-langkah proses',
      'kesalahan umum',
    ]

    const dif = difficulty.value
    const mk = (i) => ({ id: `${seed}-${i}`, difficulty: dif })

    const out = []
    for (let i = 0; i < n; i += 1) {
      const isMcq = rand() < 0.7
      const t = pick(rand, topics)

      if (isMcq) {
        const base = `Berdasarkan PDF (${file.value.name}), pertanyaan berikut menguji ${t}.`
        const prompt = `${base} Pilih jawaban paling tepat.`
        const choices = [
          'Pernyataan A (paling tepat)',
          'Pernyataan B',
          'Pernyataan C',
          'Pernyataan D',
        ]
        out.push({
          ...mk(i),
          type: 'mcq',
          prompt,
          choices,
          answer: 'A',
        })
      } else {
        const prompt = `Jelaskan ${t} yang dibahas pada PDF (${file.value.name}) dengan 2-4 kalimat.`
        out.push({
          ...mk(i),
          type: 'short',
          prompt,
          rubric: 'Menjawab sesuai inti materi, jelas, dan relevan dengan konteks PDF.',
        })
      }
    }

    questions.value = out
  } catch (e) {
    error.value = 'Gagal generate. Coba lagi.'
  } finally {
    status.value = 'idle'
  }
}

function toText(q) {
  if (q.type === 'mcq') {
    const lines = q.choices.map((c, idx) => `${String.fromCharCode(65 + idx)}. ${c}`).join('\n')
    return `${q.prompt}\n${lines}\nAnswer: ${q.answer}`
  }
  return `${q.prompt}\nRubric: ${q.rubric}`
}

async function copyOne(q) {
  try {
    await navigator.clipboard.writeText(toText(q))
  } catch {
    // ignore
  }
}

async function copyAll() {
  try {
    const all = questions.value.map((q, i) => `${i + 1}. ${toText(q)}`).join('\n\n')
    await navigator.clipboard.writeText(all)
  } catch {
    // ignore
  }
}
</script>
