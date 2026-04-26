<template>
  <section class="space-y-6">
    <header class="ink-card bg-paper-grid p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div class="min-w-0">
          <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Quiz</p>
          <h1 class="mt-2 truncate text-2xl font-semibold">{{ headerTitle }}</h1>
          <p class="mt-2 text-sm font-semibold text-ink/60">{{ headerSubtitle }}</p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            @click="onBack"
          >
            Back
          </button>

          <button
            v-if="canManage && quizExists"
            type="button"
            class="rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            @click="goToQuestions"
          >
            Kelola Soal
          </button>

          <button
            v-if="canManage"
            type="button"
            class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="aiGenerateStatus === 'loading'"
            @click="openAiGenerate"
            title="Generate draft soal dari materi PDF sesi ini"
          >
            AI Generate
          </button>

          <button
            v-if="canManage && quizExists"
            type="button"
            class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            @click="openQuizModal('edit')"
          >
            Edit
          </button>

          <button
            v-if="canManage && !quizExists"
            type="button"
            class="rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            @click="openQuizModal('create')"
          >
            + Buat Quiz
          </button>
        </div>
      </div>

      <div class="mt-5 flex flex-wrap items-center justify-end gap-2">
          <span
            v-if="quizExists"
            class="inline-flex items-center gap-2 rounded-xl border-2 px-3 py-1.5 text-xs font-extrabold shadow-ink-sm"
            :class="quizIsPublished ? 'border-emerald-700 bg-emerald-50 text-emerald-900' : 'border-ink bg-paper text-ink/70'"
          >
            <span class="h-2 w-2 rounded-full" :class="quizIsPublished ? 'bg-emerald-600' : 'bg-ink/30'" />
            {{ quizIsPublished ? 'Published' : 'Draft' }}
          </span>

          <button
            v-if="canManage && quizExists"
            type="button"
            class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-xs font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="publishStatus === 'loading'"
            @click="togglePublish"
          >
            {{ publishStatus === 'loading' ? 'Memproses...' : quizIsPublished ? 'Unpublish' : 'Publish' }}
          </button>
      </div>
    </header>

    <nav class="ink-card p-3">
      <div
        class="grid w-full gap-1 rounded-2xl border-2 border-ink bg-paper p-1 shadow-ink-sm"
        :class="canManage ? 'grid-cols-3' : 'grid-cols-1'"
      >
        <button
          type="button"
          class="w-full rounded-xl px-3 py-2 text-xs font-extrabold transition sm:px-4 sm:text-sm"
          :class="activeTab === 'overview' ? 'bg-accent text-ink shadow-ink-sm' : 'text-ink/80 hover:bg-accent/20'"
          @click="activeTab = 'overview'"
        >
          Overview
        </button>

        <button
          v-if="canManage"
          type="button"
          class="w-full rounded-xl px-3 py-2 text-xs font-extrabold transition disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
          :class="activeTab === 'questions' ? 'bg-accent text-ink shadow-ink-sm' : 'text-ink/80 hover:bg-accent/20'"
          @click="activeTab = 'questions'"
          :disabled="!quizExists"
          :title="!quizExists ? 'Buat quiz dulu' : ''"
        >
          Soal
        </button>

        <button
          v-if="canManage"
          type="button"
          class="w-full rounded-xl px-3 py-2 text-xs font-extrabold transition disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
          :class="activeTab === 'attempts' ? 'bg-accent text-ink shadow-ink-sm' : 'text-ink/80 hover:bg-accent/20'"
          @click="activeTab = 'attempts'"
          :disabled="!quizExists"
          :title="!quizExists ? 'Buat quiz dulu' : ''"
        >
          Attempts
        </button>
      </div>
    </nav>

    <div v-if="status === 'loading'" class="ink-card p-10 text-center">
      <p class="text-sm font-extrabold">Memuat quiz...</p>
    </div>

    <div v-else-if="status === 'error'" class="ink-card p-10 text-center">
      <p class="text-sm font-extrabold">Gagal memuat quiz</p>
      <p class="mt-2 text-sm font-semibold text-ink/60">{{ error }}</p>
      <button
        type="button"
        class="mt-5 rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
        @click="loadQuiz({ force: true })"
      >
        Coba lagi
      </button>
    </div>

    <div v-else-if="status === 'not-found'" class="ink-card p-10 text-center">
      <p class="text-sm font-extrabold">Quiz belum dibuat.</p>
      <button
        v-if="canManage"
        type="button"
        class="mt-5 rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm"
        @click="openQuizModal('create')"
      >
        + Buat Quiz
      </button>
    </div>

    <template v-else>
      <div v-if="activeTab === 'overview'" class="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside class="space-y-4">
          <div class="ink-card overflow-hidden">
            <div class="aspect-[16/9] w-full bg-cloud">
              <img v-if="bannerUrl" :src="bannerUrl" alt="Quiz banner" class="h-full w-full object-cover" />
              <div v-else class="grid h-full w-full place-items-center">
                <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/40">No banner</p>
              </div>
            </div>
            <div class="border-t-2 border-ink bg-paper p-5">
              <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Aturan</p>
              <div class="mt-3 grid gap-2">
                <div class="rounded-xl border-2 border-ink bg-cloud px-3 py-2 shadow-ink-sm">
                  <p class="text-xs font-bold text-ink/50">Durasi</p>
                  <p class="text-sm font-extrabold">{{ quizDurationLabel }}</p>
                </div>
                <div class="rounded-xl border-2 border-ink bg-cloud px-3 py-2 shadow-ink-sm">
                  <p class="text-xs font-bold text-ink/50">Max attempts</p>
                  <p class="text-sm font-extrabold">{{ quizMaxAttemptsLabel }}</p>
                </div>
                <div class="rounded-xl border-2 border-ink bg-cloud px-3 py-2 shadow-ink-sm">
                  <p class="text-xs font-bold text-ink/50">Passing score</p>
                  <p class="text-sm font-extrabold">{{ quizPassingScoreLabel }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!canManage" class="ink-card p-6">
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Student</p>
            <p class="mt-2 text-sm font-semibold text-ink/60">
              {{ quizIsPublished ? studentHint : 'Quiz belum dipublish oleh pengampu modul.' }}
            </p>

            <div class="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                class="rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
                :disabled="!quizIsPublished || startStatus === 'loading' || attemptStatus === 'active' || submitStatus === 'loading'"
                @click="start"
              >
                {{ startStatus === 'loading' ? 'Memulai...' : attemptStatus === 'active' ? 'Sedang Berjalan' : 'Start' }}
              </button>

              <span
                v-if="attemptStatus === 'active' && remainingSeconds != null"
                class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-xs font-extrabold shadow-ink-sm"
              >
                Sisa waktu: {{ remainingLabel }}
              </span>

              <span
                v-else-if="attemptStatus === 'active'"
                class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-xs font-extrabold text-ink/70 shadow-ink-sm"
              >
                Tanpa waktu
              </span>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm disabled:cursor-not-allowed disabled:opacity-70"
                :disabled="studentScoreStatus === 'loading'"
                @click="openStudentScore"
              >
                {{ studentScoreStatus === 'loading' ? 'Memuat...' : 'Lihat Nilai' }}
              </button>

              <span class="text-xs font-bold text-ink/50">(Tampil kalau pengampu mengizinkan)</span>
            </div>

            <p v-if="studentNotice" class="mt-4 rounded-xl border-2 border-ink bg-accent/30 px-4 py-3 text-sm font-semibold text-ink">
              {{ studentNotice }}
            </p>
          </div>
        </aside>

        <main class="space-y-4">
          <article class="ink-card p-6">
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Quiz</p>
            <h2 class="mt-2 text-xl font-semibold">{{ quizTitle }}</h2>
            <p v-if="quizDescription" class="mt-3 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm font-semibold text-ink/70">{{ quizDescription }}</p>

            
          </article>

          <article v-if="canManage" class="ink-card p-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Soal</p>
                <p class="mt-2 text-sm font-semibold text-ink/60">Total: <span class="font-extrabold">{{ questions.length }}</span></p>
              </div>

              <button
                type="button"
                class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
                @click="goToQuestions"
              >
                Kelola Soal
              </button>
            </div>

            <div v-if="!questions.length" class="mt-4 rounded-2xl border-2 border-ink bg-cloud p-6 text-center shadow-ink-sm">
              <p class="text-sm font-extrabold">Belum ada soal.</p>
              <p class="mt-2 text-sm font-semibold text-ink/60">Masuk ke tab Soal untuk menambahkan MCQ.</p>
            </div>

            <div v-else class="mt-4 space-y-3">
              <article
                v-for="(q, idx) in questions"
                :key="q.id || q.question_id || q.questionId || idx"
                class="rounded-2xl border-2 border-ink bg-paper p-5 shadow-ink-sm"
              >
                <p class="text-sm font-extrabold">{{ idx + 1 }}. {{ q.question_text || q.questionText || '-' }}</p>
                <p class="mt-1 text-xs font-bold text-ink/50">MCQ • {{ q.points ?? '-' }} poin</p>

                <img
                  v-if="mediaSrcForQuestion(q)"
                  :src="mediaSrcForQuestion(q)"
                  alt="Question image"
                  class="mt-4 w-full max-h-[360px] rounded-2xl border-2 border-ink object-contain bg-cloud shadow-ink-sm"
                  loading="lazy"
                />

                <div class="mt-3 grid gap-2">
                  <div
                    v-for="opt in (q.options || [])"
                    :key="opt.id || opt.option_id || opt.optionId || opt.option_text"
                    class="flex items-center justify-between gap-3 rounded-xl border-2 bg-cloud px-3 py-2 shadow-ink-sm"
                    :class="canManage && isCorrectOption(opt)
                      ? 'border-emerald-700 outline outline-2 outline-emerald-200'
                      : 'border-ink'"
                  >
                    <template v-if="isImageDataUrl(opt.option_text || opt.optionText)">
                      <img :src="opt.option_text || opt.optionText" alt="Option image" class="max-h-16 w-full object-contain" />
                    </template>
                    <p v-else class="text-sm font-semibold text-ink/80">{{ opt.option_text || opt.optionText || '' }}</p>
                    <span
                      v-if="opt.is_correct === true || opt.isCorrect === true"
                      class="rounded-xl border-2 border-emerald-700 bg-emerald-50 px-2 py-1 text-[11px] font-extrabold text-emerald-900"
                    >
                      BENAR
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </article>

          <article v-if="!canManage && attemptStatus === 'active'" class="ink-card p-6">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Jawaban</p>
                <p class="mt-2 text-sm font-semibold text-ink/60">Isi jawaban lalu submit sebelum waktu habis.</p>
              </div>

              <button
                type="button"
                class="rounded-xl border-2 border-ink bg-emerald-500 px-4 py-2 text-sm font-extrabold text-white shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
                :disabled="submitStatus === 'loading'"
                @click="openSubmitConfirm"
              >
                {{ submitStatus === 'loading' ? 'Mengirim...' : 'Submit' }}
              </button>
            </div>

            <p v-if="submitError" class="mt-4 rounded-xl border-2 border-rose-700 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900">
              {{ submitError }}
            </p>

            <div class="mt-5 space-y-3">
              <article
                v-for="q in questions"
                :key="q.id || q.question_id || q.questionId"
                class="rounded-2xl border-2 border-ink bg-paper p-5 shadow-ink-sm"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="min-w-0">
                    <p class="text-sm font-extrabold">{{ q.question_text || q.questionText || '-' }}</p>
                    <p class="mt-1 text-xs font-bold text-ink/50">
                      {{ String(q.question_type || q.questionType || '').toUpperCase() }} • {{ q.points ?? '-' }} poin
                    </p>
                  </div>
                </div>

                <img
                  v-if="mediaSrcForQuestion(q)"
                  :src="mediaSrcForQuestion(q)"
                  alt="Question image"
                  class="mt-3 w-full max-h-[360px] rounded-2xl border-2 border-ink object-contain bg-cloud shadow-ink-sm"
                  loading="lazy"
                />

                <div class="mt-4">
                  <div v-if="(q.question_type || q.questionType) === 'mcq'" class="space-y-2">
                    <label
                      v-for="opt in (q.options || [])"
                      :key="opt.id || opt.option_id || opt.optionId || opt.option_text"
                      class="grid grid-cols-[auto_1fr] items-start gap-3 rounded-xl border-2 border-ink bg-cloud px-3 py-2 shadow-ink-sm"
                    >
                      <input
                        type="radio"
                        class="mt-1"
                        :name="`q-${q.id || q.question_id || q.questionId}`"
                        :value="opt.id || opt.option_id || opt.optionId"
                        v-model="studentAnswersMcq[String(q.id || q.question_id || q.questionId)]"
                      />
                      <div class="min-w-0">
                        <template v-if="isImageDataUrl(opt.option_text || opt.optionText)">
                          <img :src="opt.option_text || opt.optionText" alt="Option image" class="max-h-24 w-full object-contain" />
                        </template>
                        <span v-else class="block text-sm font-semibold text-ink/80">
                          {{ opt.option_text || opt.optionText || '' }}
                        </span>
                      </div>
                    </label>
                  </div>

                  <div v-else class="space-y-2">
                    <textarea
                      class="ink-input min-h-[120px] resize-y"
                      :placeholder="'Jawaban essay...'"
                      v-model.trim="studentAnswersEssay[String(q.id || q.question_id || q.questionId)]"
                    />
                  </div>
                </div>
              </article>
            </div>
          </article>

          <BaseModal
            :open="submitSuccessOpen"
            title="Kuis Selesai"
            kicker="Quiz"
            :subtitle="submitSuccessSubtitle"
            :show-close="false"
            @close="closeSubmitSuccess"
          >
            <p class="text-sm font-semibold text-ink/70">{{ submitSuccessMessage }}</p>

            <template #actions>
              <button
                type="button"
                class="rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm"
                @click="closeSubmitSuccess"
              >
                Oke
              </button>
            </template>
          </BaseModal>

          <ConfirmDialog
            :open="submitConfirmOpen"
            title="Submit Quiz?"
            kicker="Konfirmasi"
            message="Kamu yakin mau submit sekarang? Setelah submit, jawaban tidak bisa diubah."
            confirm-text="Ya, submit"
            :is-loading="submitStatus === 'loading'"
            @cancel="closeSubmitConfirm"
            @confirm="confirmSubmit"
          />
        </main>
      </div>

      <div v-else-if="activeTab === 'questions'" class="space-y-4">
        <div class="ink-card p-6">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Soal</p>
              <p class="mt-2 text-sm font-semibold text-ink/60">Kelola soal pilihan ganda dan essay untuk quiz ini.</p>
            </div>

            <button
              v-if="canManage"
              type="button"
              class="rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              @click="openQuestionModal('create')"
            >
              + Tambah Soal
            </button>
          </div>
        </div>

        <div v-if="!questions.length" class="ink-card p-10 text-center">
          <p class="text-sm font-extrabold">Belum ada soal.</p>
          <p class="mt-2 text-sm font-semibold text-ink/60">Tambahkan minimal 1 soal untuk quiz.</p>
        </div>

        <div v-else class="space-y-3">
          <article
            v-for="q in questions"
            :key="q.id || q.question_id || q.questionId"
            class="ink-card p-6"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <p class="text-sm font-extrabold">{{ q.question_text || q.questionText || '-' }}</p>
                <p class="mt-1 text-xs font-bold text-ink/50">
                  {{ String(q.question_type || q.questionType || '').toUpperCase() }} • {{ q.points ?? '-' }} poin
                </p>
              </div>

              <div v-if="canManage" class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-xs font-extrabold shadow-ink-sm"
                  @click="openQuestionModal('edit', q)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="rounded-xl border-2 border-rose-700 bg-rose-50 px-3 py-2 text-xs font-extrabold text-rose-900 shadow-ink-sm"
                  @click="confirmDeleteQuestion(q)"
                >
                  Hapus
                </button>
              </div>
            </div>

            <img
              v-if="mediaSrcForQuestion(q)"
              :src="mediaSrcForQuestion(q)"
              alt="Question image"
              class="mt-4 w-full max-h-[360px] rounded-2xl border-2 border-ink object-contain bg-cloud shadow-ink-sm"
              loading="lazy"
            />

            <div v-if="(q.question_type || q.questionType) === 'mcq'" class="mt-4 grid gap-2">
                  <div
                    v-for="opt in (q.options || [])"
                    :key="opt.id || opt.option_id || opt.optionId || opt.option_text"
                    class="flex items-center justify-between gap-3 rounded-xl border-2 bg-cloud px-3 py-2 shadow-ink-sm"
                    :class="canManage && isCorrectOption(opt)
                      ? 'border-emerald-700 outline outline-2 outline-emerald-200'
                      : 'border-ink'"
                  >
                <template v-if="isImageDataUrl(opt.option_text || opt.optionText)">
                  <img :src="opt.option_text || opt.optionText" alt="Option image" class="max-h-16 w-full object-contain" />
                </template>
                <p v-else class="text-sm font-semibold text-ink/80">{{ opt.option_text || opt.optionText || '' }}</p>
                <span
                  v-if="canManage && (opt.is_correct === true || opt.isCorrect === true)"
                  class="rounded-xl border-2 border-emerald-700 bg-emerald-50 px-2 py-1 text-[11px] font-extrabold text-emerald-900"
                >
                  BENAR
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="ink-card p-6">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Attempts</p>
              <p class="mt-2 text-sm font-semibold text-ink/60">Lihat attempt murid dan review essay.</p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <div class="flex items-center gap-2 rounded-2xl border-2 border-ink bg-paper px-3 py-2 shadow-ink-sm">
                <span class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Passing</span>
                <input
                  v-model.number="passingScoreDraft"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  class="w-20 rounded-lg border-2 border-ink bg-cloud px-2 py-1 text-sm font-extrabold outline-none"
                  :disabled="passingScoreStatus === 'loading'"
                  aria-label="Passing score"
                />
                <span class="text-xs font-bold text-ink/50">/ 100</span>
              </div>

              <button
                v-if="canManage"
                type="button"
                class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
                :disabled="leaderboardVisibilityStatus === 'loading'"
                @click="toggleLeaderboardVisibility"
                title="Atur apakah student boleh melihat nilai (global untuk modul ini)"
              >
                {{ leaderboardVisibilityStatus === 'loading'
                  ? 'Menyimpan...'
                  : `Nilai Student: ${leaderboardVisibility === 'public' ? 'Public' : 'Private'}`
                }}
              </button>

              <button
                v-if="canManage"
                type="button"
                class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
                :disabled="studentScoreStatus === 'loading'"
                @click="openStudentScore"
                title="Lihat leaderboard nilai student"
              >
                {{ studentScoreStatus === 'loading' ? 'Memuat...' : 'Leaderboard' }}
              </button>

              <button
                type="button"
                class="rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
                :disabled="passingScoreStatus === 'loading'"
                @click="savePassingScore"
                title="Simpan batas kelulusan"
              >
                {{ passingScoreStatus === 'loading' ? 'Menyimpan...' : 'Simpan' }}
              </button>

              <button
                type="button"
                class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
                :disabled="attemptsStatus === 'loading'"
                @click="loadAttempts({ force: true })"
              >
                {{ attemptsStatus === 'loading' ? 'Memuat...' : 'Refresh' }}
              </button>
            </div>
          </div>

          <p v-if="attemptsError" class="mt-4 rounded-xl border-2 border-rose-700 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900">
            {{ attemptsError }}
          </p>

          <p v-if="passingScoreError" class="mt-4 rounded-xl border-2 border-rose-700 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900">
            {{ passingScoreError }}
          </p>

          <p v-if="leaderboardVisibilityError" class="mt-4 rounded-xl border-2 border-rose-700 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900">
            {{ leaderboardVisibilityError }}
          </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside class="ink-card p-6">
            <p class="text-sm font-extrabold">Daftar Attempt</p>

            <p v-if="attemptsStatus === 'loading'" class="mt-4 text-sm font-semibold text-ink/60">Memuat attempt...</p>
            <p v-else-if="!attempts.length" class="mt-4 text-sm font-semibold text-ink/60">Belum ada attempt.</p>

            <div v-else class="mt-4 space-y-2">
              <button
                v-for="a in attempts"
                :key="a.id || a.attempt_id || a.attemptId"
                type="button"
                class="w-full rounded-2xl border-2 border-ink bg-paper px-4 py-3 text-left shadow-ink-sm hover:bg-accent/20"
                :class="selectedAttemptId === (a.id || a.attempt_id || a.attemptId) ? 'bg-accent/30' : ''"
                @click="selectAttempt(a)"
              >
                <p class="text-sm font-extrabold">Attempt #{{ a.id || a.attempt_id || a.attemptId }}</p>
                <p class="mt-1 text-xs font-bold text-ink/50">
                  {{ a.student_name || a.studentName || a.user_name || a.userName || 'Student' }}
                </p>
              </button>
            </div>
          </aside>

          <main class="ink-card p-6">
            <p class="text-sm font-extrabold">Detail Attempt</p>

            <p v-if="!selectedAttemptId" class="mt-3 text-sm font-semibold text-ink/60">Pilih attempt untuk melihat detail.</p>

            <template v-else>
              <p v-if="attemptDetailStatus === 'loading'" class="mt-3 text-sm font-semibold text-ink/60">Memuat detail...</p>
              <p v-else-if="attemptDetailError" class="mt-3 text-sm font-semibold text-rose-700">{{ attemptDetailError }}</p>

              <template v-else>
                <div class="mt-4 grid gap-3 sm:grid-cols-3">
                  <div class="rounded-2xl border-2 border-ink bg-cloud px-4 py-3 shadow-ink-sm">
                    <p class="text-xs font-bold text-ink/50">Student</p>
                    <p class="mt-1 text-sm font-extrabold">{{ attemptStudentName }}</p>
                  </div>
                  <div class="rounded-2xl border-2 border-ink bg-cloud px-4 py-3 shadow-ink-sm">
                    <p class="text-xs font-bold text-ink/50">Status</p>
                    <p class="mt-1 text-sm font-extrabold">{{ attemptStatusLabel }}</p>
                    <p v-if="attemptSubmittedAt" class="mt-1 text-xs font-bold text-ink/50">Submit: {{ attemptSubmittedAt }}</p>
                  </div>
                  <div class="rounded-2xl border-2 border-ink bg-cloud px-4 py-3 shadow-ink-sm">
                    <p class="text-xs font-bold text-ink/50">Nilai</p>
                    <p class="mt-1 text-sm font-extrabold">{{ attemptScoreLabel }}</p>
                    <p v-if="attemptPassingLabel" class="mt-1 text-xs font-bold" :class="attemptPassingLabel === 'Lulus' ? 'text-emerald-800' : 'text-rose-800'">
                      {{ attemptPassingLabel }}
                    </p>
                  </div>
                </div>

                <div class="mt-4">
                  <p class="text-sm font-extrabold">Jawaban</p>
                  <p class="mt-2 text-sm font-semibold text-ink/60">Ringkasan jawaban siswa untuk setiap soal.</p>

                  <div v-if="!attemptAnswerRows.length" class="mt-4 rounded-2xl border-2 border-ink bg-cloud p-6 text-center shadow-ink-sm">
                    <p class="text-sm font-extrabold">Jawaban tidak tersedia.</p>
                    <p class="mt-2 text-sm font-semibold text-ink/60">Backend tidak mengembalikan daftar answers pada detail attempt.</p>
                  </div>

                  <div v-else class="mt-4 space-y-3">
                    <article
                      v-for="row in attemptAnswerRows"
                      :key="row.questionId"
                      class="rounded-2xl border-2 border-ink bg-paper p-5 shadow-ink-sm"
                    >
                      <div class="flex flex-wrap items-start justify-between gap-3">
                        <div class="min-w-0">
                          <p class="text-sm font-extrabold">{{ row.index }}. {{ row.questionText }}</p>
                          <p class="mt-1 text-xs font-bold text-ink/50">{{ row.pointsLabel }}</p>
                        </div>

        <span
          v-if="row.correctnessLabel"
          class="shrink-0 rounded-xl border-2 px-2 py-1 text-[11px] font-extrabold"
          :class="row.correctnessLabel === 'BENAR'
            ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
            : row.correctnessLabel === 'REVIEWED'
              ? 'border-sky-700 bg-sky-50 text-sky-900'
              : 'border-rose-700 bg-rose-50 text-rose-900'"
        >
          {{ row.correctnessLabel }}
        </span>
                      </div>

                      <div v-if="row.questionType === 'essay'" class="mt-4 space-y-3">
                        <div class="rounded-xl border-2 border-ink bg-cloud px-3 py-2 shadow-ink-sm">
                          <p class="text-xs font-bold text-ink/50">Jawaban siswa</p>
                          <p class="mt-1 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm font-extrabold">{{ row.essayAnswer || row.selectedLabel }}</p>
                        </div>

                        <div v-if="canManage" class="grid gap-3 sm:grid-cols-[180px_1fr]">
                          <p v-if="!canGradeEssayForAttempt" class="sm:col-span-2 rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm font-semibold text-ink/70">
                            Essay hanya bisa dinilai saat attempt berstatus <span class="font-extrabold">pending review</span>.
                          </p>

                          <label class="block space-y-2">
                            <span class="text-sm font-semibold">Manual points</span>
                            <input
                              v-model.number="reviewDraftByQuestionId[String(row.questionId)].manual_points"
                              type="number"
                              class="ink-input"
                              min="0"
                              :max="Number.isFinite(row.possiblePoints) ? row.possiblePoints : 100"
                              :disabled="!canGradeEssayForAttempt || reviewStatus === 'loading'"
                            />
                            <p v-if="Number.isFinite(row.possiblePoints)" class="text-xs font-bold text-ink/50">Maks: {{ row.possiblePoints }}</p>
                          </label>

                          <label class="block space-y-2">
                            <span class="text-sm font-semibold">Feedback</span>
                            <input
                              v-model.trim="reviewDraftByQuestionId[String(row.questionId)].reviewer_feedback"
                              type="text"
                              class="ink-input"
                              placeholder="Catatan untuk murid (opsional)"
                              :disabled="!canGradeEssayForAttempt || reviewStatus === 'loading'"
                            />
                          </label>
                        </div>
                      </div>

                      <div v-else class="mt-4 grid gap-2">
                        <div class="rounded-xl border-2 border-ink bg-cloud px-3 py-2 shadow-ink-sm">
                          <p class="text-xs font-bold text-ink/50">Jawaban siswa</p>
                          <p class="mt-1 text-sm font-extrabold">{{ row.selectedLabel }}</p>
                        </div>

                        <div v-if="row.correctLabel" class="rounded-xl border-2 border-ink bg-cloud px-3 py-2 shadow-ink-sm">
                          <p class="text-xs font-bold text-ink/50">Kunci</p>
                          <p class="mt-1 text-sm font-extrabold">{{ row.correctLabel }}</p>
                        </div>
                      </div>
                    </article>
                  </div>

                  <div v-if="canManage && reviewableEssayItems.length" class="mt-6 space-y-3">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                      <p class="text-sm font-semibold text-ink/60">Review essay langsung di card jawaban essay.</p>
                      <button
                        type="button"
                        class="rounded-xl border-2 border-ink bg-emerald-500 px-4 py-2 text-sm font-extrabold text-white shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
                        :disabled="reviewStatus === 'loading' || !canGradeEssayForAttempt"
                        @click="saveReview"
                      >
                        {{ reviewStatus === 'loading' ? 'Menyimpan...' : 'Simpan Review' }}
                      </button>
                    </div>

                    <p v-if="reviewError" class="rounded-xl border-2 border-rose-700 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900">
                      {{ reviewError }}
                    </p>
                  </div>

                  <div v-else-if="canManage && essayReviewItems.length" class="mt-6 rounded-2xl border-2 border-ink bg-cloud p-4 text-sm font-semibold text-ink/70">
                    Tidak ada jawaban essay yang bisa direview di attempt ini.
                  </div>
                </div>
              </template>
            </template>
          </main>
        </div>
      </div>
    </template>


    <BaseModal
      :open="quizModalOpen"
      :title="quizModalMode === 'create' ? 'Buat Quiz' : 'Edit Quiz'"
      kicker="Quiz"
      :full-height="true"
      :show-close="false"
      @close="closeQuizModal"
    >
      <form class="space-y-4" @submit.prevent>
        <div class="space-y-2">
          <span class="text-sm font-semibold">Banner (opsional)</span>
          <label
            class="flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-ink bg-paper px-4 py-4 hover:bg-accent/10"
            title="Upload banner (gambar)"
          >
            <input ref="quizBannerInputRef" type="file" accept="image/*" class="hidden" @change="onPickQuizBanner" />

            <div class="flex min-w-0 items-center gap-3">
              <span class="grid h-11 w-11 place-items-center rounded-2xl border-2 border-ink bg-cloud">
                <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                  <path d="M12 3v10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M8 7l4-4 4 4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </span>
              <div class="min-w-0">
                <p class="text-sm font-extrabold">Upload banner</p>
                <p class="mt-1 truncate text-xs font-bold text-ink/50">{{ quizDraft.bannerLabel }}</p>
              </div>
            </div>

          </label>

          <label
            v-if="quizModalMode === 'edit'"
            class="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-paper px-3 py-2 text-xs font-extrabold shadow-ink-sm"
            title="Hapus banner saat update"
          >
            <input type="checkbox" v-model="quizDraft.remove_banner" />
            Remove banner
          </label>
        </div>

        <label class="block space-y-2">
          <span class="text-sm font-semibold">Judul</span>
          <input v-model.trim="quizDraft.title" class="ink-input" placeholder="Quiz Sesi ..." />
        </label>

        <label class="block space-y-2">
          <span class="text-sm font-semibold">Deskripsi (opsional)</span>
          <textarea v-model.trim="quizDraft.description" class="ink-input min-h-[100px] resize-y" placeholder="Instruksi / cakupan quiz..." />
        </label>

        <div class="flex flex-wrap items-center gap-2">
          <span class="text-sm font-semibold">Mode</span>
          <button
            type="button"
            class="ink-chip"
            :class="quizDraft.use_timer ? 'bg-accent/60' : 'bg-paper hover:bg-accent/30'"
            @click="() => {
              quizDraft.use_timer = true
              if (quizDraft.duration_minutes == null || Number(quizDraft.duration_minutes) <= 0) quizDraft.duration_minutes = 30
            }"
          >
            Timer
          </button>
          <button
            type="button"
            class="ink-chip"
            :class="!quizDraft.use_timer ? 'bg-accent/60' : 'bg-paper hover:bg-accent/30'"
            @click="() => {
              quizDraft.use_timer = false
              quizDraft.duration_minutes = null
            }"
          >
            tanpa batas
          </button>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <label class="block space-y-2">
            <span class="text-sm font-semibold">Durasi (menit)</span>
            <input
              v-model.number="quizDraft.duration_minutes"
              type="number"
              min="1"
              max="480"
              class="ink-input"
              :disabled="!quizDraft.use_timer"
              :placeholder="quizDraft.use_timer ? '' : 'Tanpa waktu'"
            />
          </label>
          <label class="block space-y-2">
            <span class="text-sm font-semibold">Max attempts</span>
            <input v-model.number="quizDraft.max_attempts" type="number" min="1" max="50" class="ink-input" />
          </label>
          <label class="col-span-2 block space-y-2 sm:col-span-1">
            <span class="text-sm font-semibold">Passing score</span>
            <input v-model.number="quizDraft.passing_score" type="number" min="0" max="100" step="0.01" class="ink-input" />
          </label>
        </div>

        <p v-if="quizModalError" class="rounded-xl border-2 border-ink bg-accent/30 px-4 py-3 text-sm font-semibold text-ink">
          {{ quizModalError }}
        </p>
      </form>

      <template #actions>
        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm font-extrabold shadow-ink-sm"
          :disabled="quizModalLoading"
          @click="closeQuizModal"
        >
          Batal
        </button>
        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-accent px-3 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="quizModalLoading"
          @click="saveQuiz"
        >
          {{ quizModalLoading ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </template>
    </BaseModal>

    <BaseModal
      :open="questionModalOpen"
      :title="questionModalMode === 'create' ? 'Tambah Soal' : 'Edit Soal'"
      kicker="Tambah Soal"
      @close="closeQuestionModal"
    >
      <form class="space-y-4" @submit.prevent>
        <div class="max-h-[78vh] space-y-6 overflow-y-auto pr-1">
          <template v-for="(draft, qIdx) in questionDrafts" :key="draft.local_id">
            <div class="space-y-4">
              <div class="flex items-center justify-between gap-3">
                <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Soal {{ qIdx + 1 }}</p>
              </div>
              <div class="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-start sm:justify-center">
                <div class="shrink-0 w-fit self-center sm:self-start">
                  <!-- <p class="text-sm font-semibold">Gambar (opsional)</p> -->
                  <label
                    class="block aspect-square w-[80px] max-w-full cursor-pointer rounded-2xl border-2 border-ink bg-paper transition hover:bg-accent/20 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  >
                    <input type="file" accept="image/*" class="hidden" @change="onPickQuestionMedia($event, qIdx)" />
                    <img
                      v-if="draft.mediaPreviewUrl"
                      :src="draft.mediaPreviewUrl"
                      alt="Selected image preview"
                      class="h-full w-full rounded-2xl object-contain bg-cloud"
                    />
                    <div v-else class="flex h-full w-full flex-col items-center justify-center gap-2 px-4">
                      <svg viewBox="0 0 24 24" fill="none" class="h-6 w-6 text-ink/70" aria-hidden="true">
                        <path d="M12 3v10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                        <path d="M8 7l4-4 4 4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                      </svg>
                      <p class="text-xs font-extrabold text-ink/70">Upload</p>
                    </div>
                  </label>
                </div>

                <div class="min-w-0 flex-1 space-y-4">
                  <label class="block space-y-2">
                    <!-- <span class="text-sm font-semibold">Question</span> -->
                    <textarea v-model.trim="draft.question_text" class="ink-input min-h-[80px] resize-y" placeholder="Tulis pertanyaan..." />
                  </label>

                  <!-- <label class="block space-y-2">
                    <span class="text-sm font-semibold">Points</span>
                    <input v-model.number="draft.points" type="number" min="0" class="ink-input" />
                  </label> -->
                </div>
              </div>

              <div class="space-y-3">
                <p class="text-sm font-semibold">Options</p>

                <div class="space-y-2">
                  <div
                    v-for="(opt, optIdx) in draft.options"
                    :key="optIdx"
                    class="flex items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      class="h-5 w-5 shrink-0 appearance-none rounded-full border-2 border-ink bg-paper checked:border-emerald-700 checked:bg-emerald-500"
                      v-model="opt.is_correct"
                      :aria-label="`Correct option ${optIdx + 1}`"
                    />

                    <div class="flex flex-1 items-stretch">
                      <div class="relative flex-1">
                        <template v-if="isImageDataUrl(opt.option_text)">
                          <div class="rounded-l-full rounded-r-none border-2 border-ink bg-paper px-4 py-2 shadow-ink-sm">
                            <img :src="opt.option_text" alt="Option image" class="h-12 w-full object-contain" />
                          </div>
                        </template>
                        <input
                          v-else
                          v-model.trim="opt.option_text"
                          class="ink-input w-full rounded-l-full rounded-r-none"
                          placeholder="Tulis jawaban..."
                        />
                      </div>

                      <button
                        type="button"
                        class="grid w-12 place-items-center rounded-r-full rounded-l-none border-y-2 border-r-2 bg-rose-500/50 hover:bg-rose-500/60"
                        aria-label="Hapus opsi"
                        title="Hapus"
                        @click="removeOption(qIdx, optIdx)"
                      >
                        <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4 text-rose-900" aria-hidden="true">
                          <path d="M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                          <path d="M18 6L6 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  class="text-left text-[11px] font-extrabold text-sky-700 hover:underline"
                  @click="addOption(qIdx)"
                >
                  + Tambah pilihan
                </button>
              </div>
            </div>

            <hr v-if="qIdx !== questionDrafts.length - 1" class="border-ink/20" />
          </template>

          <div class="flex flex-col items-center gap-2 pt-1">
            <button
              v-if="questionModalMode === 'create'"
              type="button"
              class="text-xs font-extrabold text-sky-700 hover:underline"
              :disabled="questionModalLoading"
              @click="addAnotherQuestionDraft"
            >
              + Tambah soal lagi
            </button>

            <button
              type="button"
              class="rounded-2xl border-2 border-ink bg-accent px-5 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
              :disabled="questionModalLoading"
              @click="saveQuestion"
            >
              {{ questionModalLoading ? 'Menyimpan...' : (questionModalMode === 'create' ? 'Simpan Semua Soal' : 'Simpan') }}
            </button>
          </div>

          <p v-if="questionModalError" class="rounded-xl border-2 border-ink bg-accent/30 px-4 py-3 text-sm font-semibold text-ink">
            {{ questionModalError }}
          </p>
        </div>
      </form>
    </BaseModal>

    <ConfirmDialog
      :open="deleteQuestionOpen"
      title="Hapus Soal"
      kicker="Danger"
      :message="deleteQuestionMessage"
      confirm-text="Ya, hapus"
      :is-loading="deleteQuestionLoading"
      @cancel="closeDeleteQuestion"
      @confirm="doDeleteQuestion"
    />

    <BaseModal
      :open="aiGenerateOpen"
      title="AI Generate Soal"
      kicker="Quiz"
      subtitle="Generate soal otomatis dari materi PDF sesi ini. Hasil generate akan menggantikan soal yang ada dan quiz akan di-unpublish supaya bisa kamu review dulu."
      :show-close="aiGenerateStatus !== 'loading'"
      @close="closeAiGenerate"
    >
      <form class="space-y-4" @submit.prevent>
        <div class="space-y-2">
          <p class="text-sm font-extrabold">Sumber PDF</p>
          <p class="text-xs font-semibold text-ink/60">
            Hanya file PDF yang akan dipakai sebagai konteks AI (sesuai aturan backend).
          </p>

          <div v-if="pdfSourceStatus === 'loading'" class="text-sm font-semibold text-ink/60">Memuat materi sesi...</div>
          <div v-else-if="!pdfSources.length" class="rounded-2xl border-2 border-ink bg-cloud p-4 text-sm font-semibold text-ink/70">
            Tidak ada materi PDF di sesi ini. Isi <span class="font-extrabold">Manual context</span> agar tetap bisa generate.
          </div>

          <div v-else class="space-y-2">
            <label
              v-for="c in pdfSources"
              :key="c.id"
              class="flex items-start gap-3 rounded-2xl border-2 border-ink bg-paper px-4 py-3 shadow-ink-sm"
            >
              <input
                type="checkbox"
                class="mt-1 h-4 w-4"
                :value="c.id"
                v-model="aiGenerateForm.contentIds"
                :disabled="aiGenerateStatus === 'loading'"
              />
              <div class="min-w-0">
                <p class="truncate text-sm font-extrabold">{{ c.title }}</p>
                <p class="mt-1 truncate text-xs font-bold text-ink/50">{{ c.fileName }}</p>
              </div>
            </label>
          </div>
        </div>

        <label class="block space-y-2">
          <span class="text-sm font-semibold">Manual context (fallback)</span>
          <textarea
            v-model.trim="aiGenerateForm.manualContext"
            class="ink-input min-h-[110px] resize-y"
            placeholder="Tulis ringkasan materi / poin penting jika PDF tidak bisa diproses..."
            :disabled="aiGenerateStatus === 'loading'"
          />
          <p class="text-xs font-bold text-ink/50">
            Wajib diisi jika tidak ada PDF yang bisa dipakai.
          </p>
        </label>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <label class="block space-y-2">
            <span class="text-sm font-semibold">MCQ</span>
            <input v-model.number="aiGenerateForm.mcqCount" type="number" min="0" max="50" class="ink-input" :disabled="aiGenerateStatus === 'loading'" />
          </label>
          <label class="block space-y-2">
            <span class="text-sm font-semibold">Essay</span>
            <input v-model.number="aiGenerateForm.essayCount" type="number" min="0" max="50" class="ink-input" :disabled="aiGenerateStatus === 'loading'" />
          </label>
          <label class="block space-y-2">
            <span class="text-sm font-semibold">Difficulty</span>
            <select v-model="aiGenerateForm.difficulty" class="ink-input" :disabled="aiGenerateStatus === 'loading'">
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </label>
          <label class="block space-y-2">
            <span class="text-sm font-semibold">Locale</span>
            <select v-model="aiGenerateForm.locale" class="ink-input" :disabled="aiGenerateStatus === 'loading'">
              <option value="id">id</option>
              <option value="en">en</option>
            </select>
          </label>
        </div>

        <p v-if="aiGenerateError" class="rounded-xl border-2 border-ink bg-accent/30 px-4 py-3 text-sm font-semibold text-ink">
          {{ aiGenerateError }}
        </p>

        <div v-if="aiGenerateWarnings.length" class="rounded-2xl border-2 border-ink bg-cloud p-4">
          <p class="text-sm font-extrabold">Warnings</p>
          <ul class="mt-2 list-disc pl-5 text-xs font-semibold text-ink/70">
            <li v-for="(w, idx) in aiGenerateWarnings" :key="idx">{{ w }}</li>
          </ul>
        </div>
      </form>

      <template #actions>
        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
          :disabled="aiGenerateStatus === 'loading'"
          @click="closeAiGenerate"
        >
          Batal
        </button>
        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="aiGenerateStatus === 'loading'"
          @click="runAiGenerate"
        >
          {{ aiGenerateStatus === 'loading' ? 'Generating...' : 'Generate' }}
        </button>
      </template>
    </BaseModal>

    <BaseModal
      :open="studentScoreOpen"
      title="Nilai Quiz"
      kicker="Leaderboard"
      @close="studentScoreOpen = false"
    >
      <p v-if="studentScoreError" class="rounded-xl border-2 border-rose-700 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900">
        {{ studentScoreError }}
      </p>

      <div v-else class="space-y-4">
        <p v-if="studentScoreStatus === 'loading'" class="text-sm font-semibold text-ink/60">Memuat nilai...</p>

        <div v-else-if="!leaderboardRows.length" class="text-sm font-semibold text-ink/60">Leaderboard belum tersedia.</div>

        <div v-else class="space-y-4">
          <section class="rounded-3xl border-2 border-ink bg-cloud p-4 shadow-ink-sm">
            <div class="grid grid-cols-3 items-end gap-3">
              <div
                v-for="rank in [3, 2, 1]"
                :key="`podium-${rank}`"
                class="flex flex-col items-center gap-2"
              >
                <div
                  class="grid h-12 w-12 place-items-center rounded-full border-2 border-ink shadow-ink-sm"
                  :class="rank === 1 ? 'bg-accent' : rank === 2 ? 'bg-ocean-50' : 'bg-paper'"
                >
                  <span class="text-xs font-extrabold">{{ initials(leaderboardByRank[rank]?.name) }}</span>
                </div>

                <p class="max-w-[100px] truncate text-xs font-extrabold text-ink">
                  {{ leaderboardByRank[rank]?.name || '-' }}
                </p>

                <span
                  class="rounded-xl border-2 border-ink px-2 py-1 text-[11px] font-extrabold shadow-ink-sm"
                  :class="rank === 1 ? 'bg-accent-soft' : rank === 2 ? 'bg-ocean-50' : 'bg-paper'"
                >
                  {{ leaderboardScoreLabel(leaderboardByRank[rank]) }}
                </span>

                <div
                  class="w-full rounded-3xl border-2 border-ink shadow-ink-sm"
                  :class="podiumClass(rank)"
                >
                  <div class="grid h-full place-items-center p-3">
                    <p class="text-2xl font-black text-ink">{{ rank }}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section v-if="myLeaderboardRow" class="rounded-3xl border-2 border-ink bg-accent p-4 shadow-ink-sm">
            <div class="flex items-center justify-between gap-3">
              <div class="flex min-w-0 items-center gap-3">
                <div class="grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-paper shadow-ink-sm">
                  <span class="text-xs font-extrabold">{{ initials(myLeaderboardRow.name) }}</span>
                </div>
                <div class="min-w-0">
                  <p class="truncate text-sm font-extrabold text-ink">{{ myLeaderboardRow.name }}</p>
                  <p class="text-xs font-bold text-ink/70">Posisi #{{ myLeaderboardRow.rank }}</p>
                </div>
              </div>
              <span class="rounded-2xl border-2 border-ink bg-paper px-3 py-2 text-sm font-extrabold shadow-ink-sm">
                {{ leaderboardScoreLabel(myLeaderboardRow) }}
              </span>
            </div>

            <div class="mt-3 grid grid-cols-3 gap-2">
              <div class="rounded-2xl border-2 border-ink bg-paper px-3 py-2 shadow-ink-sm">
                <p class="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink/60">Nilai</p>
                <p class="mt-1 text-sm font-black text-ink">{{ leaderboardScoreLabel(myLeaderboardRow) }}</p>
              </div>
              <div class="rounded-2xl border-2 border-ink bg-ocean-50 px-3 py-2 shadow-ink-sm">
                <p class="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink/60">Attempt</p>
                <p class="mt-1 text-sm font-black text-ink">{{ myLeaderboardRow.attemptNo ? `#${myLeaderboardRow.attemptNo}` : '-' }}</p>
              </div>
              <div class="rounded-2xl border-2 border-ink bg-accent-soft px-3 py-2 shadow-ink-sm">
                <p class="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink/60">Peringkat</p>
                <p class="mt-1 text-sm font-black text-ink">#{{ myLeaderboardRow.rank }}</p>
              </div>
            </div>
          </section>

          <section class="space-y-2">
            <article
              v-for="r in leaderboardRest"
              :key="r.key"
              class="flex items-center gap-3 rounded-3xl border-2 border-ink bg-paper px-4 py-3 shadow-ink-sm"
            >
              <p class="w-10 shrink-0 font-mono text-xs font-extrabold text-ink/70">{{ String(r.rank || 0).padStart(2, '0') }}</p>
              <p class="min-w-0 flex-1 truncate text-sm font-extrabold text-ink">{{ r.name }}</p>
              <span class="rounded-2xl border-2 border-ink bg-ocean-50 px-2.5 py-1 text-xs font-extrabold">{{ leaderboardScoreLabel(r) }}</span>
            </article>
          </section>
        </div>
      </div>

    </BaseModal>

    <div v-if="aiGenerateStatus === 'loading'" class="fixed inset-0 z-[90] grid place-items-center bg-ink/40 p-4">
      <div class="ink-card w-full max-w-sm bg-paper p-6 text-center shadow-ink">
        <p class="text-sm font-extrabold">AI lagi ngerjain soalnya...</p>
        <p class="mt-2 text-sm font-semibold text-ink/60">Tunggu sebentar ya. Jangan tutup halaman ini dulu.</p>
        <div class="mt-5 h-2 w-full overflow-hidden rounded-full border-2 border-ink bg-cloud">
          <div class="h-full w-1/2 animate-pulse bg-accent" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import BaseModal from '@/components/ui/BaseModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { getServices } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useModulesStore } from '@/stores/modules'
import { normalizeListResponse } from '@/services/mappers/list'

const route = useRoute()
const router = useRouter()
const services = getServices()
const auth = useAuthStore()
const modules = useModulesStore()

const moduleId = computed(() => Number(route.params.moduleId))
const sessionId = computed(() => Number(route.params.sessionId))

const canManage = computed(() => {
  const r = String(auth.user?.role || '').toLowerCase()
  return r === 'teacher' || r === 'admin'
})

const backToSessionLink = computed(() => `/courses/${moduleId.value}?sessionId=${sessionId.value}`)

const status = ref('loading')
const error = ref('')

const quiz = ref(null)
const bannerUrl = ref('')
const bannerUrlStatus = ref('idle')

function quizHasBanner(q) {
  if (!q) return false
  const flag = q?.has_banner ?? q?.hasBanner
  if (typeof flag === 'boolean') return flag

  const rawUrl =
    q?.banner_download_url ??
    q?.bannerDownloadUrl ??
    q?.banner_url ??
    q?.bannerUrl ??
    q?.banner_path ??
    q?.bannerPath ??
    q?.banner_image_path ??
    q?.bannerImagePath

  if (typeof rawUrl === 'string') {
    const s = rawUrl.trim()
    return Boolean(s) && s !== 'null' && s !== 'undefined'
  }

  // If the API doesn't provide any banner fields, fall back to previous behavior
  // (we'll try fetching and treat 404 as "no banner").
  return rawUrl != null
}

const activeTab = ref('overview')

const publishStatus = ref('idle')

const attemptsStatus = ref('idle')
const attemptsError = ref('')
const attempts = ref([])
const selectedAttemptId = ref(null)
const attemptDetailStatus = ref('idle')
const attemptDetailError = ref('')
const attemptDetail = ref(null)

const leaderboardVisibility = ref('private') // private | public
const leaderboardVisibilityStatus = ref('idle')
const leaderboardVisibilityError = ref('')

const studentScoreOpen = ref(false)
const studentScoreStatus = ref('idle')
const studentScoreError = ref('')
const leaderboardRows = ref([])

const leaderboardByRank = computed(() => {
  const out = {}
  for (const r of leaderboardRows.value) {
    const rank = Number(r?.rank)
    if (!Number.isFinite(rank) || rank <= 0) continue
    if (!out[rank]) out[rank] = r
  }
  return out
})

const leaderboardRest = computed(() => {
  return leaderboardRows.value.filter((r) => Number(r?.rank) >= 4)
})

const myLeaderboardRow = computed(() => {
  const uid = auth.user?.id ?? auth.user?.user_id ?? auth.user?.userId ?? auth.user?.student_id ?? auth.user?.studentId
  if (uid != null) {
    const byId = leaderboardRows.value.find((r) => String(r?.key) === String(uid))
    if (byId) return byId
  }

  const n = String(auth.user?.name || auth.user?.full_name || auth.user?.fullName || '').trim().toLowerCase()
  if (!n) return null
  return leaderboardRows.value.find((r) => String(r?.name || '').trim().toLowerCase() === n) || null
})

function initials(name) {
  const s = String(name || '').trim()
  if (!s) return '??'
  const parts = s.split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] || '') : (parts[0]?.[1] || '')
  const out = `${first}${last}`.toUpperCase()
  return out || '??'
}

function leaderboardScoreLabel(r) {
  if (!r) return '-'
  const v = Number(r.score)
  if (!Number.isFinite(v)) return '-'
  return `${Math.round(v)} / 100`
}

function podiumClass(rank) {
  const r = Number(rank)
  if (r === 1) return 'bg-accent h-28'
  if (r === 2) return 'bg-ocean-50 h-24'
  return 'bg-paper h-20'
}

const reviewStatus = ref('idle')
const reviewError = ref('')
const reviewDraftByQuestionId = ref({})

const startStatus = ref('idle')
const submitStatus = ref('idle')
const submitError = ref('')
const attemptStatus = ref('idle') // idle | active | submitted
const attemptId = ref(null)
const remainingSeconds = ref(null)
const studentNotice = ref('')
let countdownTimer = null

const submitSuccessOpen = ref(false)
const submitSuccessMessage = ref('')
const submitSuccessSubtitle = computed(() => {
  const title = quizTitle.value
  return title ? `Nice! Kamu sudah menyelesaikan "${title}".` : 'Nice! Kamu sudah menyelesaikan kuis ini.'
})

const submitConfirmOpen = ref(false)

const aiGenerateOpen = ref(false)
const aiGenerateStatus = ref('idle') // idle | loading
const aiGenerateError = ref('')
const aiGenerateWarnings = ref([])

const pdfSourceStatus = ref('idle')
const sessionContents = ref([])

const aiGenerateForm = reactive({
  contentIds: [],
  manualContext: '',
  mcqCount: 5,
  essayCount: 3,
  difficulty: 'medium',
  locale: 'id',
})

const pdfSources = computed(() => {
  const list = sessionContents.value
  return list
    .map((c) => {
      const id = c?.id
      const type = String(c?.content_type || c?.type || '').toLowerCase()
      const mime = String(c?.mime_type || c?.mimeType || '').toLowerCase()
      const fileName = String(c?.original_name || c?.file_name || c?.filename || c?.title || '').trim()
      const isPdf = mime.includes('pdf') || fileName.toLowerCase().endsWith('.pdf')

      if (!id || type !== 'file' || !isPdf) return null
      return {
        id,
        title: String(c?.title || 'PDF').trim() || 'PDF',
        fileName: fileName || `content-${id}.pdf`,
      }
    })
    .filter(Boolean)
})

const questionMediaStatusById = reactive({})
const questionMediaUrlById = reactive({})

const studentAnswersMcq = ref({})
const studentAnswersEssay = ref({})

const quizExists = computed(() => Boolean(quiz.value))
const quizTitle = computed(() => quiz.value?.title || quiz.value?.name || `Quiz Sesi #${sessionId.value}`)
const quizDescription = computed(() => quiz.value?.description || '')
const quizIsPublished = computed(() => Boolean(quiz.value?.is_published ?? quiz.value?.isPublished))
const questions = computed(() => {
  const qs = quiz.value?.questions
  if (Array.isArray(qs)) return qs
  const data = quiz.value?.data?.questions
  if (Array.isArray(data)) return data
  return []
})

const quizDurationLabel = computed(() => {
  const n = quiz.value?.duration_minutes ?? quiz.value?.durationMinutes
  if (n == null || n === '' || Number(n) === 0) return 'Tanpa waktu'
  return `${Number(n)} menit`
})

const quizMaxAttemptsLabel = computed(() => {
  const n = quiz.value?.max_attempts ?? quiz.value?.maxAttempts
  return n == null || n === '' ? '-' : String(n)
})
const quizPassingScoreLabel = computed(() => {
  const n = quiz.value?.passing_score ?? quiz.value?.passingScore
  return n == null || n === '' ? '-' : String(n)
})

const passingScoreThreshold = computed(() => {
  const raw = quiz.value?.passing_score ?? quiz.value?.passingScore
  const n = Number(raw)
  return Number.isFinite(n) ? n : 70
})

const passingScoreDraft = ref(70)
const passingScoreStatus = ref('idle')
const passingScoreError = ref('')

const studentHint = computed(() => {
  const dur = quiz.value?.duration_minutes ?? quiz.value?.durationMinutes
  if (dur == null || dur === '' || Number(dur) === 0) return 'Klik start untuk mulai attempt. Quiz ini tanpa batas waktu.'
  return 'Klik start untuk mulai attempt. Waktu akan berjalan setelah start.'
})

const moduleTitle = computed(() => {
  const m = modules.getById(moduleId.value)
  return m?.title || `Modul #${moduleId.value}`
})

const headerTitle = computed(() => quizExists.value ? quizTitle.value : `Quiz Sesi #${sessionId.value}`)
const headerSubtitle = computed(() => `Modul: ${moduleTitle.value} • Sesi #${sessionId.value}`)

const remainingLabel = computed(() => {
  const s = remainingSeconds.value
  if (!Number.isFinite(s) || s == null) return '-'
  const ss = Math.max(0, Math.floor(s))
  const mm = Math.floor(ss / 60)
  const rr = ss % 60
  return `${mm}:${String(rr).padStart(2, '0')}`
})

const quizModalOpen = ref(false)
const quizModalMode = ref('create')
const quizModalLoading = ref(false)
const quizModalError = ref('')
const quizBannerInputRef = ref(null)
const quizDraft = ref({
  use_timer: true,
  title: '',
  description: '',
  duration_minutes: 30,
  max_attempts: 1,
  passing_score: 70,
  bannerFile: null,
  bannerLabel: 'No file chosen',
  remove_banner: false,
})

const questionModalOpen = ref(false)
const questionModalMode = ref('create')
const questionModalLoading = ref(false)
const questionModalError = ref('')
const editingQuestionId = ref(null)

const questionDrafts = ref([])

function createQuestionDraft() {
  return {
    local_id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    question_type: 'mcq',
    question_text: '',
    points: 10,
    options: [
      { option_text: '', is_correct: true },
      { option_text: '', is_correct: false },
    ],
    mediaFile: null,
    mediaPreviewUrl: '',
    mediaLabel: 'Belum ada gambar',
  }
}

const deleteQuestionOpen = ref(false)
const deleteQuestionLoading = ref(false)
const deleteQuestionTarget = ref(null)
const deleteQuestionMessage = computed(() => {
  const q = deleteQuestionTarget.value
  const label = q?.question_text || q?.questionText || ''
  return label
    ? `Kamu yakin mau menghapus soal: "${label}"? Tindakan ini tidak bisa dibatalkan.`
    : 'Kamu yakin mau menghapus soal ini? Tindakan ini tidak bisa dibatalkan.'
})

onMounted(async () => {
  if (!modules.items.length) {
    try {
      await modules.fetchAll({ services })
    } catch {
      // ignore
    }
  }

  await loadQuiz()
})

watch(
  () => passingScoreThreshold.value,
  (v) => {
    // Keep draft synced unless user is currently saving.
    if (passingScoreStatus.value === 'loading') return
    passingScoreDraft.value = Number.isFinite(Number(v)) ? Number(v) : 70
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  clearCountdown()
  revokeBannerUrl()
  revokeAllQuestionMedia()
  revokeAllDraftPreviews()
})

watch([moduleId, sessionId], async () => {
  activeTab.value = 'overview'
  attempts.value = []
  attemptsError.value = ''
  selectedAttemptId.value = null
  attemptDetail.value = null
  attemptDetailError.value = ''
  reviewDraftByQuestionId.value = {}
  reviewError.value = ''
  revokeBannerUrl()
  clearCountdown()
  studentAnswersMcq.value = {}
  studentAnswersEssay.value = {}
  submitError.value = ''
  studentNotice.value = ''
  attemptStatus.value = 'idle'
  attemptId.value = null
  remainingSeconds.value = null
  revokeAllQuestionMedia()
  revokeAllDraftPreviews()
  aiGenerateOpen.value = false
  aiGenerateStatus.value = 'idle'
  aiGenerateError.value = ''
  aiGenerateWarnings.value = []
  pdfSourceStatus.value = 'idle'
  sessionContents.value = []
  aiGenerateForm.contentIds = []
  aiGenerateForm.manualContext = ''
  submitConfirmOpen.value = false
  await loadQuiz({ force: true })
})

watch(
  () => questions.value.map((q) => getQuestionId(q)).filter(Boolean).join(','),
  () => {
    // Best-effort: fetch images for visible questions.
    for (const q of questions.value) {
      ensureQuestionMedia(q)
    }
  },
  { immediate: true }
)

function getQuestionId(q) {
  return q?.id || q?.question_id || q?.questionId || null
}

function mediaSrcForQuestion(q) {
  const id = getQuestionId(q)
  if (!id) return ''
  return questionMediaUrlById[id] || ''
}

function questionHasMedia(q) {
  return Boolean(q?.has_media ?? q?.hasMedia ?? q?.media_url ?? q?.mediaUrl)
}

async function ensureQuestionMedia(q) {
  const id = getQuestionId(q)
  if (!id) return

  if (!questionHasMedia(q)) {
    questionMediaStatusById[id] = 'none'
    return
  }

  const status = questionMediaStatusById[id]
  if (status === 'loading' || status === 'success' || status === 'none') return

  questionMediaStatusById[id] = 'loading'
  try {
    const blob = await services.quizzes.getQuestionMedia(moduleId.value, sessionId.value, id)
    const url = URL.createObjectURL(blob)
    // revoke old if any
    if (questionMediaUrlById[id]) URL.revokeObjectURL(questionMediaUrlById[id])
    questionMediaUrlById[id] = url
    questionMediaStatusById[id] = 'success'
  } catch (e) {
    // No media or forbidden; don't spam retries.
    questionMediaStatusById[id] = 'none'
  }
}

function revokeAllQuestionMedia() {
  Object.keys(questionMediaUrlById).forEach((k) => {
    const url = questionMediaUrlById[k]
    if (url) URL.revokeObjectURL(url)
    delete questionMediaUrlById[k]
  })
  Object.keys(questionMediaStatusById).forEach((k) => {
    delete questionMediaStatusById[k]
  })
}

function revokeAllDraftPreviews() {
  for (const d of questionDrafts.value) {
    const url = d?.mediaPreviewUrl
    if (url && typeof url === 'string' && url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  }
}

function onBack() {
  if (activeTab.value !== 'overview') {
    activeTab.value = 'overview'
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  router.push(backToSessionLink.value)
}

function revokeBannerUrl() {
  if (bannerUrl.value) URL.revokeObjectURL(bannerUrl.value)
  bannerUrl.value = ''
  bannerUrlStatus.value = 'idle'
}

async function loadBanner() {
  revokeBannerUrl()
  bannerUrlStatus.value = 'loading'
  try {
    const blob = await services.quizzes.getQuizBanner(moduleId.value, sessionId.value)
    bannerUrl.value = URL.createObjectURL(blob)
    bannerUrlStatus.value = 'success'
  } catch (e) {
    // Common case: quiz has no banner. Treat as "none" and don't surface as error.
    if (e?.status === 404) {
      bannerUrlStatus.value = 'none'
      return
    }
    bannerUrlStatus.value = 'error'
  }
}

async function loadQuiz({ force = false } = {}) {
  status.value = 'loading'
  error.value = ''
  try {
    const res = await services.quizzes.getQuiz(moduleId.value, sessionId.value)
    const data = res?.data || res

    if (res?.success === false) throw new Error(res?.message || 'Gagal memuat quiz')

    quiz.value = data
    status.value = 'success'

    // Avoid GET /quiz/banner when quiz has no banner (prevents 404 noise on deploy).
    if (quizHasBanner(data)) {
      await loadBanner()
    } else {
      revokeBannerUrl()
      bannerUrlStatus.value = 'none'
    }

    const lv = String(data?.leaderboard_visibility || data?.leaderboardVisibility || '').toLowerCase()
    if (lv === 'public' || lv === 'private') leaderboardVisibility.value = lv
  } catch (e) {
    if (e?.status === 404) {
      quiz.value = null
      status.value = 'not-found'
      return
    }
    if (e?.status === 403 && !canManage.value) {
      // Student hit unpublished access. Treat as not-found-ish for UI.
      quiz.value = null
      status.value = 'not-found'
      return
    }
    status.value = 'error'
    error.value = e?.message || 'Gagal memuat quiz'
  }
}

async function toggleLeaderboardVisibility() {
  if (!canManage.value) return
  if (!quizExists.value) return

  leaderboardVisibilityError.value = ''
  leaderboardVisibilityStatus.value = 'loading'
  try {
    const next = leaderboardVisibility.value === 'public' ? 'private' : 'public'
    const res = await services.quizzes.setLeaderboardVisibility(moduleId.value, sessionId.value, {
      leaderboard_visibility: next,
    })
    if (res?.success === false) throw new Error(res?.message || 'Gagal menyimpan visibility')
    leaderboardVisibility.value = next
  } catch (e) {
    leaderboardVisibilityError.value = e?.message || 'Gagal menyimpan visibility'
  } finally {
    leaderboardVisibilityStatus.value = 'idle'
  }
}

function normalizeLeaderboardRows(res) {
  // Backend payload shape varies by wrapper. Support common nestings.
  const data = res?.data ?? res
  const d1 = data?.data ?? data
  const d2 = d1?.data ?? d1

  const list = Array.isArray(d2)
    ? d2
    : Array.isArray(d2?.rows)
      ? d2.rows
      : Array.isArray(d2?.leaderboard)
        ? d2.leaderboard
        : Array.isArray(d1?.rows)
          ? d1.rows
          : Array.isArray(d1?.leaderboard)
            ? d1.leaderboard
            : []

  const normalized = list
    .map((r, idx) => {
      // Documented fields: rank, student_id, student_name, attempt_no, submitted_at,
      // final_score_percent, final_score_points, total_points
      const rankRaw = r?.rank
      const studentId = r?.student_id ?? r?.studentId ?? r?.id
      const name =
        r?.student_name ||
        r?.studentName ||
        r?.user_name ||
        r?.userName ||
        r?.name ||
        r?.student?.name ||
        r?.student?.full_name ||
        r?.student?.fullName

      // Contract: final_score_percent is the UI source of truth.
      const percentRaw = r?.final_score_percent ?? r?.finalScorePercent
      let percent = Number(percentRaw)
      if (Number.isFinite(percent)) {
        percent = percent <= 1 ? percent * 100 : percent
      } else {
        // Fallback to points (documented audit fields)
        const total = Number(r?.total_points ?? r?.totalPoints)
        const points = Number(r?.final_score_points ?? r?.finalScorePoints ?? r?.final_score ?? r?.finalScore)
        if (Number.isFinite(total) && total > 0 && Number.isFinite(points)) {
          percent = (points / total) * 100
        } else {
          const alt = Number(r?.score ?? r?.percent)
          if (Number.isFinite(alt)) percent = alt <= 1 ? alt * 100 : alt
        }
      }

      if (Number.isFinite(percent)) percent = Math.max(0, Math.min(100, percent))

      const totalPoints = Number(r?.total_points ?? r?.totalPoints)
      const finalPoints = Number(r?.final_score_points ?? r?.finalScorePoints)
      const pointsLabel = Number.isFinite(totalPoints) && totalPoints > 0 && Number.isFinite(finalPoints)
        ? `${formatPoints(finalPoints)}/${formatPoints(totalPoints)}`
        : ''

      const attemptNo = r?.attempt_no ?? r?.attemptNo
      const submittedAtRaw = r?.submitted_at ?? r?.submittedAt
      const submittedAt = submittedAtRaw ? parseIsoToLocal(submittedAtRaw) : ''

      return {
        key: studentId ?? `${idx}`,
        rank: Number.isFinite(Number(rankRaw)) ? Number(rankRaw) : null,
        name: String(name || '').trim() || (studentId != null ? `Student ${studentId}` : 'Student'),
        score: percent,
        scoreLabel: Number.isFinite(percent) ? `${percent.toFixed(2)}` : '-',
        pointsLabel,
        attemptNo: Number.isFinite(Number(attemptNo)) ? Number(attemptNo) : null,
        submittedAt,
      }
    })
    .filter((x) => x.name)

  // Prefer backend rank if provided (documented), otherwise rank by score.
  const hasAnyRank = normalized.some((x) => Number.isFinite(Number(x.rank)))
  if (hasAnyRank) {
    normalized.sort((a, b) => (Number(a.rank) || 999999) - (Number(b.rank) || 999999))
    normalized.forEach((r, i) => {
      if (!Number.isFinite(Number(r.rank))) r.rank = i + 1
    })
  } else {
    normalized.sort((a, b) => {
      const as = Number.isFinite(a.score) ? a.score : -1
      const bs = Number.isFinite(b.score) ? b.score : -1
      return bs - as
    })
    normalized.forEach((r, i) => {
      r.rank = i + 1
    })
  }

  return normalized
}

async function openStudentScore() {
  studentScoreOpen.value = true
  studentScoreError.value = ''
  leaderboardRows.value = []
  studentScoreStatus.value = 'loading'
  try {
    // Keep it simple: always show latest attempt.
    const res = await services.quizzes.getLeaderboard(moduleId.value, sessionId.value, { mode: 'latest' })
    if (res?.success === false) throw new Error(res?.message || 'Leaderboard tidak tersedia')
    leaderboardRows.value = normalizeLeaderboardRows(res)
  } catch (e) {
    studentScoreError.value = canManage.value
      ? (e?.message || 'Gagal memuat leaderboard')
      : (e?.message || 'Nilai belum dibuka oleh pengampu.')
  } finally {
    studentScoreStatus.value = 'idle'
  }
}

function openQuizModal(mode) {
  quizModalMode.value = mode
  quizModalError.value = ''
  quizModalLoading.value = false

  if (mode === 'edit' && quiz.value) {
    const dur = quiz.value?.duration_minutes
    quizDraft.value = {
      use_timer: !(dur == null || dur === '' || Number(dur) === 0),
      title: quiz.value?.title || '',
      description: quiz.value?.description || '',
      duration_minutes: dur != null && dur !== '' && Number(dur) !== 0 ? Number(dur) : null,
      max_attempts: Number(quiz.value?.max_attempts ?? 1),
      passing_score: Number(quiz.value?.passing_score ?? 70),
      bannerFile: null,
      bannerLabel: 'No file chosen',
      remove_banner: false,
    }
  } else {
    quizDraft.value = {
      use_timer: true,
      title: '',
      description: '',
      duration_minutes: 30,
      max_attempts: 1,
      passing_score: 70,
      bannerFile: null,
      bannerLabel: 'No file chosen',
      remove_banner: false,
    }
  }

  quizModalOpen.value = true
}

function closeQuizModal() {
  quizModalOpen.value = false
}

function onPickQuizBanner(e) {
  const file = e?.target?.files?.[0]
  if (file && !String(file.type || '').toLowerCase().startsWith('image/')) {
    quizDraft.value.bannerFile = null
    quizDraft.value.bannerLabel = 'File harus gambar'
    quizModalError.value = 'Banner hanya mendukung format gambar.'
    return
  }
  quizDraft.value.bannerFile = file || null
  quizDraft.value.bannerLabel = file?.name || 'No file chosen'
}

async function saveQuiz() {
  const title = String(quizDraft.value.title || '').trim()
  if (!title) {
    quizModalError.value = 'Judul wajib diisi.'
    return
  }

  if (quizDraft.value.use_timer) {
    const dur = Number(quizDraft.value.duration_minutes)
    if (!Number.isFinite(dur) || dur < 1 || dur > 480) {
      quizModalError.value = 'Durasi wajib diisi (1-480 menit) atau pilih mode Idle.'
      return
    }
  }

  const maxAttempts = Number(quizDraft.value.max_attempts)
  if (!Number.isFinite(maxAttempts) || maxAttempts < 1 || maxAttempts > 50) {
    quizModalError.value = 'Max attempts harus 1-50.'
    return
  }

  const passing = Number(quizDraft.value.passing_score)
  if (!Number.isFinite(passing) || passing < 0 || passing > 100) {
    quizModalError.value = 'Passing score harus 0-100.'
    return
  }

  quizModalLoading.value = true
  quizModalError.value = ''
  try {
    const payload = {
      title,
      description: String(quizDraft.value.description || '').trim() || undefined,
      banner: quizDraft.value.bannerFile || undefined,
      remove_banner: quizDraft.value.remove_banner,
      // For idle mode, omit duration_minutes from multipart.
      duration_minutes: quizDraft.value.use_timer ? quizDraft.value.duration_minutes : null,
      max_attempts: quizDraft.value.max_attempts,
      passing_score: quizDraft.value.passing_score,
    }

    const res = quizModalMode.value === 'create'
      ? await services.quizzes.createQuiz(moduleId.value, sessionId.value, payload)
      : await services.quizzes.updateQuiz(moduleId.value, sessionId.value, payload)

    if (res?.success === false) throw new Error(res?.message || 'Gagal menyimpan quiz')

    quizModalOpen.value = false
    await loadQuiz({ force: true })
  } catch (e) {
    quizModalError.value = e?.message || 'Gagal menyimpan quiz'
  } finally {
    quizModalLoading.value = false
  }
}

async function togglePublish() {
  publishStatus.value = 'loading'
  try {
    const res = await services.quizzes.publishQuiz(moduleId.value, sessionId.value, { is_published: !quizIsPublished.value })
    if (res?.success === false) throw new Error(res?.message || 'Gagal publish quiz')
    await loadQuiz({ force: true })
  } catch (e) {
    // surface via header: reuse error block minimally
    error.value = e?.message || 'Gagal publish quiz'
  } finally {
    publishStatus.value = 'idle'
  }
}

async function savePassingScore() {
  if (!canManage.value) return
  if (!quizExists.value) return

  passingScoreError.value = ''

  const n = Number(passingScoreDraft.value)
  if (!Number.isFinite(n) || n < 0 || n > 100) {
    passingScoreError.value = 'Passing score harus 0-100.'
    return
  }

  passingScoreStatus.value = 'loading'
  try {
    const res = await services.quizzes.updateQuiz(moduleId.value, sessionId.value, {
      passing_score: n,
    })
    if (res?.success === false) throw new Error(res?.message || 'Gagal menyimpan passing score')
    await loadQuiz({ force: true })
  } catch (e) {
    passingScoreError.value = e?.message || 'Gagal menyimpan passing score'
  } finally {
    passingScoreStatus.value = 'idle'
  }
}

function openQuestionModal(mode, q) {
  questionModalMode.value = mode
  questionModalError.value = ''
  questionModalLoading.value = false
  editingQuestionId.value = null

  revokeAllDraftPreviews()
  questionDrafts.value = []

  if (mode === 'edit' && q) {
    const qid = q.id || q.question_id || q.questionId
    editingQuestionId.value = qid

    const type = q.question_type || q.questionType || 'mcq'
    if (String(type).toLowerCase() !== 'mcq') {
      error.value = 'Saat ini UI hanya mendukung soal MCQ.'
      return
    }

    const opts = Array.isArray(q.options) ? q.options : []
    const d = createQuestionDraft()
    d.question_text = q.question_text || q.questionText || ''
    d.points = Number(q.points ?? 0)
    d.options = (opts.length
      ? opts.map((o) => ({
          option_text: o.option_text || o.optionText || '',
          is_correct: Boolean(o.is_correct ?? o.isCorrect),
        }))
      : [
          { option_text: '', is_correct: true },
          { option_text: '', is_correct: false },
        ])
    questionDrafts.value = [d]
  } else {
    questionDrafts.value = [createQuestionDraft()]
  }

  questionModalOpen.value = true
}

function closeQuestionModal() {
  questionModalOpen.value = false
  revokeAllDraftPreviews()
  questionDrafts.value = []
  editingQuestionId.value = null
}

function goToQuestions() {
  activeTab.value = 'questions'
}

function addOption(qIdx) {
  const d = questionDrafts.value[qIdx]
  if (!d) return
  d.options.push({ option_text: '', is_correct: false })
}

function removeOption(qIdx, optIdx) {
  const d = questionDrafts.value[qIdx]
  if (!d) return
  d.options.splice(optIdx, 1)
}

function onPickQuestionMedia(e, qIdx) {
  const d = questionDrafts.value[qIdx]
  if (!d) return

  const file = e?.target?.files?.[0]
  if (!file) return
  if (!String(file.type || '').toLowerCase().startsWith('image/')) {
    questionModalError.value = 'File harus gambar.'
    return
  }

  if (d.mediaPreviewUrl && String(d.mediaPreviewUrl).startsWith('blob:')) {
    URL.revokeObjectURL(d.mediaPreviewUrl)
  }

  d.mediaFile = file
  d.mediaLabel = file.name || 'Gambar'
  d.mediaPreviewUrl = URL.createObjectURL(file)
}

function validateQuestionDraft(d) {
  const type = 'mcq'
  const text = String(d?.question_text || '').trim()
  if (!text) return 'Question wajib diisi.'

  if (type === 'mcq') {
    const opts = (d?.options || [])
      .map((o) => ({ option_text: String(o.option_text || '').trim(), is_correct: Boolean(o.is_correct) }))
      .filter((o) => o.option_text)

    if (opts.length < 2) return 'MCQ harus memiliki minimal 2 opsi.'
    if (!opts.some((o) => o.is_correct)) return 'MCQ harus memiliki minimal 1 jawaban benar.'
  }

  return ''
}

function getQuestionType(q) {
  return String(q?.question_type || q?.questionType || '').toLowerCase()
}

function getQuestionText(q) {
  return String(q?.question_text || q?.questionText || '').trim()
}

function getQuestionSortOrder(q, fallback = 999) {
  const raw = q?.sort_order ?? q?.sortOrder
  const n = Number(raw)
  return Number.isFinite(n) ? n : fallback
}

function computePointsPlanTo100(questionList) {
  const list = Array.isArray(questionList) ? questionList : []
  const n = list.length
  if (!n) return []

  // Use cents to avoid float drift. Total = 100.00
  const totalCents = 10_000
  const baseCents = Math.floor(totalCents / n)
  const rem = totalCents - baseCents * n

  return list.map((q, idx) => {
    const cents = baseCents + (idx < rem ? 1 : 0)
    const points = Number((cents / 100).toFixed(2))
    return { id: getQuestionId(q), points }
  })
}

async function syncQuestionPointsTo100() {
  if (!canManage.value) return
  if (!quizExists.value) return

  // Fetch fresh quiz to avoid using stale state.
  let fresh
  try {
    const res = await services.quizzes.getQuiz(moduleId.value, sessionId.value)
    fresh = res?.data || res
  } catch {
    return
  }

  const rawQuestions = Array.isArray(fresh?.questions)
    ? fresh.questions
    : Array.isArray(fresh?.data?.questions)
      ? fresh.data.questions
      : []

  const ordered = [...rawQuestions]
    .filter((q) => getQuestionId(q) && getQuestionType(q) && getQuestionText(q))
    .sort((a, b) => {
      const ao = getQuestionSortOrder(a)
      const bo = getQuestionSortOrder(b)
      if (ao !== bo) return ao - bo
      return Number(getQuestionId(a)) - Number(getQuestionId(b))
    })

  const plan = computePointsPlanTo100(ordered)
  if (!plan.length) return

  const currentPointsById = new Map(
    ordered.map((q) => [String(getQuestionId(q)), Number(q?.points ?? 0)])
  )

  let changed = false
  for (let i = 0; i < ordered.length; i++) {
    const q = ordered[i]
    const id = String(getQuestionId(q))
    const target = plan[i]
    if (!target?.id) continue

    const nextPoints = Number(target.points)
    const cur = currentPointsById.get(id)
    if (Number.isFinite(cur) && Math.abs(cur - nextPoints) < 0.001) continue

    const type = getQuestionType(q)
    const text = getQuestionText(q)
    const opts = Array.isArray(q?.options) ? q.options : []

    const payload = {
      question_type: type,
      question_text: text,
      points: nextPoints,
    }

    if (type === 'mcq') {
      payload.options = opts
        .map((o) => ({
          option_text: String(o?.option_text || o?.optionText || '').trim(),
          is_correct: Boolean(o?.is_correct ?? o?.isCorrect),
        }))
        .filter((o) => o.option_text)
    }

    // eslint-disable-next-line no-await-in-loop
    await services.quizzes.updateQuestion(moduleId.value, sessionId.value, target.id, payload)
    changed = true
  }

  if (changed) {
    await loadQuiz({ force: true })
  }
}

async function saveQuestion() {
  questionModalLoading.value = true
  questionModalError.value = ''
  try {
    if (questionModalMode.value === 'edit') {
      const d = questionDrafts.value[0]
      const validationError = validateQuestionDraft(d)
      if (validationError) throw new Error(validationError)
      if (!editingQuestionId.value) throw new Error('Soal tidak valid')

      const payload = {
        question_type: 'mcq',
        question_text: String(d.question_text || '').trim(),
        points: d.points,
        options: (d.options || [])
          .map((o) => ({ option_text: String(o.option_text || '').trim(), is_correct: Boolean(o.is_correct) }))
          .filter((o) => o.option_text),
        media: d.mediaFile || undefined,
      }

      const res = await services.quizzes.updateQuestion(moduleId.value, sessionId.value, editingQuestionId.value, payload)
      if (res?.success === false) throw new Error(res?.message || 'Gagal menyimpan soal')
    } else {
      // Create mode: batch add all drafts.
      for (let i = 0; i < questionDrafts.value.length; i++) {
        const d = questionDrafts.value[i]
        const validationError = validateQuestionDraft(d)
        if (validationError) throw new Error(`Soal #${i + 1}: ${validationError}`)

        const payload = {
          question_type: 'mcq',
          question_text: String(d.question_text || '').trim(),
          points: d.points,
          options: (d.options || [])
            .map((o) => ({ option_text: String(o.option_text || '').trim(), is_correct: Boolean(o.is_correct) }))
            .filter((o) => o.option_text),
          media: d.mediaFile || undefined,
        }

        const res = await services.quizzes.addQuestion(moduleId.value, sessionId.value, payload)
        if (res?.success === false) throw new Error(res?.message || `Gagal menyimpan soal #${i + 1}`)
      }
    }

    closeQuestionModal()
    await loadQuiz({ force: true })
    await syncQuestionPointsTo100()
  } catch (e) {
    questionModalError.value = e?.message || 'Gagal menyimpan soal'
  } finally {
    questionModalLoading.value = false
  }
}

function addAnotherQuestionDraft() {
  if (questionModalMode.value !== 'create') return
  const last = questionDrafts.value[questionDrafts.value.length - 1]
  const validationError = validateQuestionDraft(last)
  if (validationError) {
    questionModalError.value = validationError
    return
  }

  questionModalError.value = ''
  questionDrafts.value.push(createQuestionDraft())
}

function confirmDeleteQuestion(q) {
  deleteQuestionTarget.value = q
  deleteQuestionLoading.value = false
  deleteQuestionOpen.value = true
}

function closeDeleteQuestion() {
  deleteQuestionOpen.value = false
  deleteQuestionTarget.value = null
}

async function doDeleteQuestion() {
  const q = deleteQuestionTarget.value
  const qid = q?.id || q?.question_id || q?.questionId
  if (!qid) return

  deleteQuestionLoading.value = true
  try {
    const res = await services.quizzes.deleteQuestion(moduleId.value, sessionId.value, qid)
    if (res?.success === false) throw new Error(res?.message || 'Gagal menghapus soal')
    deleteQuestionOpen.value = false
    deleteQuestionTarget.value = null
    await loadQuiz({ force: true })
    await syncQuestionPointsTo100()
  } catch (e) {
    // Keep dialog open, show error in modal-ish message
    deleteQuestionLoading.value = false
    error.value = e?.message || 'Gagal menghapus soal'
    return
  } finally {
    deleteQuestionLoading.value = false
  }
}

async function start() {
  startStatus.value = 'loading'
  studentNotice.value = ''
  submitError.value = ''
  try {
    const res = await services.quizzes.startAttempt(moduleId.value, sessionId.value)
    const data = res?.data || res
    if (res?.success === false) throw new Error(res?.message || 'Gagal memulai attempt')

    attemptId.value = data?.attempt_id || data?.attemptId || data?.id
    const rem = data?.remaining_seconds ?? data?.remainingSeconds
    remainingSeconds.value = Number.isFinite(Number(rem)) ? Number(rem) : null
    attemptStatus.value = 'active'
    startCountdown()
    studentNotice.value = 'Attempt dimulai. Jawab soal lalu submit.'
  } catch (e) {
    studentNotice.value = e?.message || 'Gagal memulai attempt'
  } finally {
    startStatus.value = 'idle'
  }
}

function startCountdown() {
  clearCountdown()
  if (!Number.isFinite(remainingSeconds.value) || remainingSeconds.value == null) return

  countdownTimer = window.setInterval(() => {
    if (remainingSeconds.value == null) return
    remainingSeconds.value = Math.max(0, Number(remainingSeconds.value) - 1)
    if (remainingSeconds.value <= 0) {
      clearCountdown()
      studentNotice.value = 'Waktu habis. Silakan submit jika belum.'
    }
  }, 1000)
}

function clearCountdown() {
  if (countdownTimer) window.clearInterval(countdownTimer)
  countdownTimer = null
}

async function submit() {
  submitStatus.value = 'loading'
  submitError.value = ''
  try {
    const ans = []
    for (const q of questions.value) {
      const qid = q.id || q.question_id || q.questionId
      const type = q.question_type || q.questionType
      if (!qid) continue

      if (type === 'mcq') {
        const selected = studentAnswersMcq.value[String(qid)]
        if (selected != null && selected !== '') {
          ans.push({ question_id: qid, selected_option_id: selected })
        }
      } else {
        const text = String(studentAnswersEssay.value[String(qid)] || '').trim()
        if (text) ans.push({ question_id: qid, essay_answer: text })
      }
    }

    const res = await services.quizzes.submitAttempt(moduleId.value, sessionId.value, {
      attempt_id: attemptId.value,
      answers: ans,
    })
    if (res?.success === false) throw new Error(res?.message || 'Gagal submit quiz')

    attemptStatus.value = 'submitted'
    clearCountdown()

    submitSuccessMessage.value =
      'Mantap. Jawaban kamu sudah kami kirim. Kamu bisa santai dulu, nanti hasilnya bakal muncul sesuai aturan kuis.'
    submitSuccessOpen.value = true

    studentNotice.value = res?.message || 'Jawaban berhasil dikirim.'
  } catch (e) {
    submitError.value = e?.message || 'Gagal submit quiz'
  } finally {
    submitStatus.value = 'idle'
  }
}

function openSubmitConfirm() {
  if (submitStatus.value === 'loading') return
  submitConfirmOpen.value = true
}

function closeSubmitConfirm() {
  if (submitStatus.value === 'loading') return
  submitConfirmOpen.value = false
}

async function confirmSubmit() {
  if (submitStatus.value === 'loading') return
  // Close first so success modal can take focus.
  submitConfirmOpen.value = false
  await submit()
}

function closeSubmitSuccess() {
  submitSuccessOpen.value = false
}

async function ensureSessionContentsLoaded() {
  if (!canManage.value) return
  if (pdfSourceStatus.value === 'loading' || pdfSourceStatus.value === 'success') return

  pdfSourceStatus.value = 'loading'
  try {
    const res = await services.sessions.listContents(moduleId.value, sessionId.value)
    sessionContents.value = normalizeListResponse(res)
    pdfSourceStatus.value = 'success'
  } catch {
    // Keep UI usable even if we can't fetch sources.
    sessionContents.value = []
    pdfSourceStatus.value = 'error'
  }
}

async function openAiGenerate() {
  if (!canManage.value) return
  aiGenerateError.value = ''
  aiGenerateWarnings.value = []
  aiGenerateForm.manualContext = ''
  aiGenerateForm.mcqCount = 5
  aiGenerateForm.essayCount = 3
  aiGenerateForm.difficulty = 'medium'
  aiGenerateForm.locale = 'id'

  await ensureSessionContentsLoaded()

  // Default: select all PDF sources.
  aiGenerateForm.contentIds = pdfSources.value.map((x) => x.id)

  aiGenerateOpen.value = true
}

function closeAiGenerate() {
  if (aiGenerateStatus.value === 'loading') return
  aiGenerateOpen.value = false
  aiGenerateError.value = ''
}

async function runAiGenerate() {
  if (!canManage.value) return

  aiGenerateError.value = ''
  aiGenerateWarnings.value = []

  const ids = (aiGenerateForm.contentIds || []).map((x) => Number(x)).filter((x) => Number.isFinite(x))
  const manual = String(aiGenerateForm.manualContext || '').trim()

  if (!ids.length && !manual) {
    aiGenerateError.value = 'Pilih minimal 1 PDF atau isi manual context.'
    return
  }

  const mcqCount = Number(aiGenerateForm.mcqCount)
  const essayCount = Number(aiGenerateForm.essayCount)
  if (!Number.isFinite(mcqCount) || mcqCount < 0 || mcqCount > 50) {
    aiGenerateError.value = 'MCQ count harus 0-50.'
    return
  }
  if (!Number.isFinite(essayCount) || essayCount < 0 || essayCount > 50) {
    aiGenerateError.value = 'Essay count harus 0-50.'
    return
  }
  if (mcqCount + essayCount <= 0) {
    aiGenerateError.value = 'Minimal generate 1 soal (MCQ atau Essay).'
    return
  }

  aiGenerateStatus.value = 'loading'

  try {
    // Backend will apply replace by default (apply_to_quiz=true).
    const res = await services.quizzes.generateDraft(moduleId.value, sessionId.value, {
      source_mode: 'session_contents',
      content_ids: ids.length ? ids : undefined,
      manual_context: manual || undefined,
      apply_to_quiz: true,
      mcq_count: mcqCount,
      essay_count: essayCount,
      difficulty: aiGenerateForm.difficulty,
      locale: aiGenerateForm.locale,
    })

    if (res?.success === false) throw new Error(res?.message || 'Gagal generate draft')

    const data = res?.data || res || {}
    const warnings = Array.isArray(data?.warnings) ? data.warnings : []
    aiGenerateWarnings.value = warnings

    aiGenerateOpen.value = false
    await loadQuiz({ force: true })
    activeTab.value = 'questions'
  } catch (e) {
    aiGenerateError.value = e?.message || 'Gagal generate soal'
  } finally {
    aiGenerateStatus.value = 'idle'
  }
}

async function loadAttempts({ force = false } = {}) {
  if (!canManage.value) return
  attemptsStatus.value = 'loading'
  attemptsError.value = ''
  try {
    const res = await services.quizzes.listAttempts(moduleId.value, sessionId.value)
    const data = res?.data || res
    if (res?.success === false) throw new Error(res?.message || 'Gagal memuat attempts')
    attempts.value = Array.isArray(data) ? data : Array.isArray(data?.attempts) ? data.attempts : []
    attemptsStatus.value = 'success'
  } catch (e) {
    attemptsStatus.value = 'error'
    attemptsError.value = e?.message || 'Gagal memuat attempts'
  }
}

async function selectAttempt(a) {
  const id = a?.id || a?.attempt_id || a?.attemptId
  if (!id) return
  selectedAttemptId.value = id
  attemptDetailStatus.value = 'loading'
  attemptDetailError.value = ''
  attemptDetail.value = null
  reviewDraftByQuestionId.value = {}
  reviewError.value = ''
  try {
    const res = await services.quizzes.getAttempt(moduleId.value, sessionId.value, id)
    const data = res?.data || res
    if (res?.success === false) throw new Error(res?.message || 'Gagal memuat attempt')
    attemptDetail.value = data
    attemptDetailStatus.value = 'success'

    // initialize review drafts best-effort
    for (const item of essayReviewItems.value) {
      reviewDraftByQuestionId.value[String(item.question_id)] = {
        manual_points: item.manual_points ?? 0,
        reviewer_feedback: item.reviewer_feedback ?? '',
      }
    }

    // Ensure drafts exist for essay rows even if essayReviewItems doesn't include them.
    for (const row of attemptAnswerRows.value) {
      if (row.questionType !== 'essay') continue
      const key = String(row.questionId)
      if (reviewDraftByQuestionId.value[key]) continue
      reviewDraftByQuestionId.value[key] = { manual_points: 0, reviewer_feedback: '' }
    }
  } catch (e) {
    attemptDetailStatus.value = 'error'
    attemptDetailError.value = e?.message || 'Gagal memuat attempt'
  }
}

const essayReviewItems = computed(() => {
  const d = attemptDetail.value
  if (!d) return []

  const answers = Array.isArray(d.answers) ? d.answers : Array.isArray(d.data?.answers) ? d.data.answers : null
  if (!answers) return []

  return answers
    .filter((a) => (a.question_type || a.questionType) === 'essay' || a.essay_answer || a.essayAnswer)
    .map((a) => ({
      question_id: a.question_id || a.questionId || a.id,
      question_text: a.question_text || a.questionText || '',
      essay_answer: a.essay_answer || a.essayAnswer || '',
      question_points: Number(a.question_points ?? a.questionPoints ?? NaN),
      manual_points: a.manual_points ?? a.manualPoints,
      reviewer_feedback: a.reviewer_feedback ?? a.reviewerFeedback,
    }))
    .filter((a) => a.question_id)
})

const reviewableEssayItems = computed(() => {
  return essayReviewItems.value.filter((x) => {
    const hasAnswer = String(x.essay_answer || '').trim().length > 0
    const hasExistingScore = Number.isFinite(Number(x.manual_points))
    return hasAnswer || hasExistingScore
  })
})

function pickFirst(obj, keys) {
  for (const k of keys) {
    const v = obj?.[k]
    if (v != null && v !== '') return v
  }
  return null
}

function parseIsoToLocal(isoLike) {
  const raw = String(isoLike || '').trim()
  if (!raw) return ''
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return raw
  return d.toLocaleString()
}

const attemptStudentName = computed(() => {
  const d = attemptDetail.value
  if (!d) return '-'
  return (
    d.student_name ||
    d.studentName ||
    d.user_name ||
    d.userName ||
    d.user?.name ||
    d.student?.name ||
    '-'
  )
})

const attemptSubmittedAt = computed(() => {
  const d = attemptDetail.value
  const v = pickFirst(d, ['submitted_at', 'submittedAt', 'finished_at', 'finishedAt'])
  return v ? parseIsoToLocal(v) : ''
})

const attemptStatusLabel = computed(() => {
  const d = attemptDetail.value
  const status = String(pickFirst(d, ['status', 'state']) || '').toLowerCase()
  if (status.includes('submit') || status.includes('finish')) return 'Submitted'
  if (status.includes('start') || status.includes('progress')) return 'In progress'
  if (attemptSubmittedAt.value) return 'Submitted'
  return 'Unknown'
})

function normalizeAttemptAnswers(detail) {
  if (!detail) return []
  const candidates = [
    detail.answers,
    detail.data?.answers,
    detail.attempt?.answers,
    detail.data?.attempt?.answers,
  ]
  for (const c of candidates) {
    if (Array.isArray(c)) return c
  }
  return []
}

function findQuestionById(qid) {
  const id = Number(qid)
  if (!Number.isFinite(id)) return null
  return questions.value.find((q) => Number(q.id || q.question_id || q.questionId) === id) || null
}

function essayMaxPoints(itemOrQuestionId) {
  // Prefer attempt snapshot points if present.
  if (itemOrQuestionId && typeof itemOrQuestionId === 'object') {
    const qp = Number(itemOrQuestionId.question_points)
    if (Number.isFinite(qp)) return qp
    const qid = itemOrQuestionId.question_id
    if (qid != null) {
      const q = findQuestionById(qid)
      const pts = Number(q?.points)
      return Number.isFinite(pts) ? pts : NaN
    }
    return NaN
  }

  const q = findQuestionById(itemOrQuestionId)
  const pts = Number(q?.points)
  return Number.isFinite(pts) ? pts : NaN
}

function findOptionById(q, optionId) {
  if (!q) return null
  const id = Number(optionId)
  if (!Number.isFinite(id)) return null
  const opts = Array.isArray(q.options) ? q.options : []
  return opts.find((o) => Number(o.id || o.option_id || o.optionId) === id) || null
}

function findCorrectOption(q) {
  if (!q) return null
  const opts = Array.isArray(q.options) ? q.options : []
  return opts.find((o) => Boolean(o.is_correct ?? o.isCorrect)) || null
}

function formatPoints(n) {
  const v = Number(n)
  if (!Number.isFinite(v)) return ''
  // Keep UI stable for fractional points like 3.33.
  return (Math.round(v * 100) / 100).toFixed(2)
}

const attemptAnswerRows = computed(() => {
  const d = attemptDetail.value
  if (!d) return []

  const raw = normalizeAttemptAnswers(d)
  return raw
    .map((a, idx) => {
      const questionId = a.question_id || a.questionId || a.id
      const q = findQuestionById(questionId)
      const questionText =
        q?.question_text || q?.questionText || a.question_text || a.questionText || `Question #${questionId || idx + 1}`

      const questionType = String(q?.question_type || q?.questionType || a.question_type || a.questionType || '').toLowerCase()

      const possiblePoints = (() => {
        const qpAttempt = pickFirst(a, ['question_points', 'questionPoints'])
        const qpn = Number(qpAttempt)
        if (Number.isFinite(qpn)) return qpn

        const qp = Number(q?.points)
        if (Number.isFinite(qp)) return qp
        const ap = pickFirst(a, ['points', 'points_possible', 'pointsPossible', 'max_points', 'maxPoints'])
        const n = Number(ap)
        return Number.isFinite(n) ? n : NaN
      })()

      const selectedOptionId = pickFirst(a, ['selected_option_id', 'selectedOptionId', 'option_id', 'optionId'])
      const selectedOpt = selectedOptionId != null ? findOptionById(q, selectedOptionId) : null
      const correctOpt = findCorrectOption(q)

      const selectedLabel =
        selectedOpt?.option_text ||
        selectedOpt?.optionText ||
        a.selected_option_text ||
        a.selectedOptionText ||
        a.option_text ||
        a.optionText ||
        (selectedOptionId != null ? `Option #${selectedOptionId}` : 'Tidak menjawab')

      const correctLabel =
        correctOpt?.option_text ||
        correctOpt?.optionText ||
        a.correct_option_text ||
        a.correctOptionText ||
        (correctOpt ? '' : '')

      const isCorrectRaw = pickFirst(a, ['is_correct', 'isCorrect'])
      const isCorrect = (() => {
        // Normalize aggressively: backend may send 0/1, "0"/"1", true/false.
        if (isCorrectRaw != null && isCorrectRaw !== '') {
          const parsed = toBoolLoose(isCorrectRaw)
          if (parsed != null) return parsed
          const n = Number(isCorrectRaw)
          if (Number.isFinite(n)) return n === 1
        }
        if (selectedOpt) return isCorrectOption(selectedOpt)
        return null
      })()

      const awardedRaw = pickFirst(a, ['awarded_points', 'awardedPoints', 'points_awarded', 'pointsAwarded', 'earned_points', 'earnedPoints'])
      const manualRaw = pickFirst(a, ['manual_points', 'manualPoints'])
      const autoRaw = pickFirst(a, ['auto_points', 'autoPoints'])
      const essayAnswer = String(pickFirst(a, ['essay_answer', 'essayAnswer', 'answer_text', 'answerText']) || '').trim()
      const hasManual = Number.isFinite(Number(manualRaw))
      const awardedPoints = (() => {
        // MCQ: rely on correctness + snapshot points for display.
        // Some backends may return awarded_points/auto_points=0 even when is_correct=1.
        if (questionType === 'mcq' && Number.isFinite(possiblePoints) && isCorrect != null) {
          return isCorrect ? possiblePoints : 0
        }

        // Backend attempt payload uses auto_points/manual_points.
        const autoPts = Number(autoRaw)
        const manualPts = Number(manualRaw)
        if (Number.isFinite(autoPts) || Number.isFinite(manualPts)) {
          return (Number.isFinite(autoPts) ? autoPts : 0) + (Number.isFinite(manualPts) ? manualPts : 0)
        }

        // Some backends keep awarded_points stale (eg 0) even after manual grading.
        if (Number.isFinite(Number(awardedRaw))) return Number(awardedRaw)

        // Essay (unreviewed): keep 0 so totals still move for MCQ.
        if (questionType === 'essay' && essayAnswer) {
          return 0
        }

        return NaN
      })()

      const correctnessLabel =
        questionType === 'mcq'
          ? (isCorrect == null ? '' : isCorrect ? 'BENAR' : 'SALAH')
          : (hasManual ? 'REVIEWED' : '')

      const pointsLabel = Number.isFinite(possiblePoints)
        ? Number.isFinite(awardedPoints)
          ? `${formatPoints(awardedPoints)}/${formatPoints(possiblePoints)} poin`
          : `${formatPoints(possiblePoints)} poin`
        : ''

      const finalSelectedLabel = questionType === 'essay'
        ? (essayAnswer || 'Tidak menjawab')
        : selectedLabel

      return {
        index: idx + 1,
        questionId: String(questionId || idx),
        questionText,
        questionType,
        selectedLabel: finalSelectedLabel,
        correctLabel,
        correctnessLabel,
        possiblePoints,
        awardedPoints,
        pointsLabel,
        pendingEssay: questionType === 'essay' && Boolean(essayAnswer) && !hasManual,
        essayAnswer,
      }
    })
})

const attemptScoreSummary = computed(() => {
  const d = attemptDetail.value
  const rows = attemptAnswerRows.value
  if (!d && !rows.length) return { possible: NaN, awarded: NaN, percent: NaN, pendingEssay: 0 }

  // Contract: final_score_percent (0..100) is UI source of truth.
  const percentRaw = pickFirst(d, ['final_score_percent', 'finalScorePercent'])
  const p0 = Number(percentRaw)
  if (Number.isFinite(p0)) {
    const normalized = p0 <= 1 ? p0 * 100 : p0
    const percent = Math.max(0, Math.min(100, normalized))
    const pendingEssay = String(d?.status || '').toLowerCase().includes('pending') ? 1 : 0
    return { possible: 100, awarded: percent, percent, pendingEssay }
  }

  // Prefer backend aggregate fields if present.
  const totalRaw = pickFirst(d, ['total_points', 'totalPoints'])
  const finalRaw = pickFirst(d, ['final_score', 'finalScore'])
  const autoRaw = pickFirst(d, ['auto_score', 'autoScore'])
  const manualRaw = pickFirst(d, ['manual_score', 'manualScore'])

  const total = Number(totalRaw)
  const final = Number(finalRaw)
  const autoScore = Number(autoRaw)
  const manualScore = Number(manualRaw)

  if (Number.isFinite(total) && total > 0 && (Number.isFinite(final) || Number.isFinite(autoScore) || Number.isFinite(manualScore))) {
    const awarded = Number.isFinite(final)
      ? final
      : (Number.isFinite(autoScore) ? autoScore : 0) + (Number.isFinite(manualScore) ? manualScore : 0)

    const awardedForPercent = Math.max(0, Math.min(total, awarded))
    let percent = (awardedForPercent / total) * 100
    if (Number.isFinite(percent)) percent = Math.max(0, Math.min(100, percent))
    const pendingEssay = String(d?.status || '').toLowerCase().includes('pending') ? 1 : 0
    return { possible: total, awarded, percent, pendingEssay }
  }

  // Fallback: sum per-question rows.
  if (!rows.length) return { possible: NaN, awarded: NaN, percent: NaN, pendingEssay: 0 }

  let possible = 0
  let awarded = 0
  let pendingEssay = 0

  for (const r of rows) {
    if (Number.isFinite(r.possiblePoints)) possible += r.possiblePoints
    if (Number.isFinite(r.awardedPoints)) awarded += r.awardedPoints
    if (r.pendingEssay) pendingEssay += 1
  }

  let percent = possible > 0 ? (awarded / possible) * 100 : NaN
  if (Number.isFinite(percent)) percent = Math.max(0, Math.min(100, percent))
  return { possible, awarded, percent, pendingEssay }
})

const attemptScoreLabel = computed(() => {
  const s = attemptScoreSummary.value
  if (!Number.isFinite(s.percent)) return '-'
  const label = `${s.percent.toFixed(2)}`
  if (s.pendingEssay > 0) return `${label} (menunggu review)`
  return label
})

const attemptPassingLabel = computed(() => {
  const pass = passingScoreThreshold.value
  if (!Number.isFinite(pass)) return ''

  const d = attemptDetail.value
  const passedRaw = pickFirst(d, ['passed'])
  if (passedRaw != null) {
    const b = toBoolLoose(passedRaw)
    if (b === true) return 'Lulus'
    if (b === false) return 'Tidak lulus'
  }

  const s = attemptScoreSummary.value
  if (!Number.isFinite(s.percent)) return ''
  if (s.pendingEssay > 0) return ''
  return s.percent >= pass ? 'Lulus' : 'Tidak lulus'
})

const canGradeEssayForAttempt = computed(() => {
  if (!canManage.value) return false
  const st = String(attemptDetail.value?.status || '').toLowerCase()
  // Backend only allows grading when attempt is pending review.
  return st.includes('pending')
})

async function saveReview() {
  if (!canManage.value) return
  if (!selectedAttemptId.value) return

  if (!canGradeEssayForAttempt.value) {
    reviewError.value = 'Attempt quiz ini tidak dalam status yang bisa dinilai essai.'
    return
  }

  reviewStatus.value = 'loading'
  reviewError.value = ''

  try {
    const d = attemptDetail.value
    const answers = Array.isArray(d?.answers) ? d.answers : Array.isArray(d?.data?.answers) ? d.data.answers : []
    const essayAnswers = answers.filter((a) => String(a?.question_type || a?.questionType || '').toLowerCase() === 'essay')
    const reviewTargets = essayAnswers.filter((a) => String(a?.essay_answer || a?.essayAnswer || '').trim())

    if (!reviewTargets.length) {
      throw new Error('Tidak ada jawaban essay yang bisa direview.')
    }

    const reviews = reviewTargets.map((a) => {
      const qid = a?.question_id || a?.questionId || a?.id
      const draft = reviewDraftByQuestionId.value[String(qid)] || {}

      const maxPts = Number(a?.question_points ?? a?.questionPoints)
      const rawPts = Number(draft.manual_points ?? 0)
      const safePts = Number.isFinite(rawPts) ? Math.max(0, rawPts) : 0
      const clampedPts = Number.isFinite(maxPts) ? Math.min(safePts, maxPts) : safePts

      return {
        question_id: qid,
        manual_points: clampedPts,
        reviewer_feedback: String(draft.reviewer_feedback || '').trim(),
      }
    })

    const res = await services.quizzes.reviewAttempt(moduleId.value, sessionId.value, selectedAttemptId.value, { reviews })
    if (res?.success === false) throw new Error(res?.message || 'Gagal menyimpan review')

    // Refresh attempt + attempts list so aggregates update.
    await selectAttempt({ id: selectedAttemptId.value })
    await loadAttempts({ force: true })
    if (studentScoreOpen.value) await openStudentScore()
  } catch (e) {
    reviewError.value = e?.message || 'Gagal menyimpan review'
  } finally {
    reviewStatus.value = 'idle'
  }
}

function isImageDataUrl(value) {
  const s = String(value || '')
  return s.startsWith('data:image/')
}

function isCorrectOption(opt) {
  const v = opt?.is_correct ?? opt?.isCorrect
  if (typeof v === 'boolean') return v
  if (typeof v === 'number') return v === 1
  const s = String(v ?? '').trim().toLowerCase()
  if (!s) return false
  if (s === 'true' || s === '1' || s === 'yes') return true
  return false
}

function toBoolLoose(value) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value === 1
  const s = String(value ?? '').trim().toLowerCase()
  if (!s) return null
  if (s === 'true' || s === '1' || s === 'yes') return true
  if (s === 'false' || s === '0' || s === 'no') return false
  return null
}

function onPickOptionImage(e, idx) {
  const file = e?.target?.files?.[0]
  if (!file) return

  // Backward compatible: when UI doesn't wire option image, just ignore.
  if (!String(file.type || '').toLowerCase().startsWith('image/')) {
    questionModalError.value = 'File opsi harus gambar.'
    return
  }

  if (file.size > 1_500_000) {
    questionModalError.value = 'Ukuran gambar opsi terlalu besar (maks 1.5MB).'
    return
  }

  const d = questionDrafts.value[0]
  if (!d?.options?.[idx]) return

  const reader = new FileReader()
  reader.onload = () => {
    const url = String(reader.result || '')
    if (!url.startsWith('data:image/')) {
      questionModalError.value = 'Gagal membaca gambar opsi.'
      return
    }
    d.options[idx].option_text = url
  }
  reader.onerror = () => {
    questionModalError.value = 'Gagal membaca gambar opsi.'
  }
  reader.readAsDataURL(file)
}

watch(activeTab, async (tab) => {
  if (tab === 'questions' && !canManage.value) {
    activeTab.value = 'overview'
    return
  }

  if (tab === 'attempts' && canManage.value && quizExists.value) {
    await loadAttempts({ force: true })
  }
})

</script>
