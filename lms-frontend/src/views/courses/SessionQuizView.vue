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

      <div class="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="ink-chip"
          :class="activeTab === 'overview' ? 'bg-accent/60' : 'bg-paper hover:bg-accent/30'"
          @click="activeTab = 'overview'"
        >
          Overview
        </button>
        <button
          type="button"
          class="ink-chip"
          :class="activeTab === 'questions' ? 'bg-accent/60' : 'bg-paper hover:bg-accent/30'"
          @click="activeTab = 'questions'"
          :disabled="!quizExists"
          :title="!quizExists ? 'Buat quiz dulu' : ''"
        >
          Soal
        </button>
        <button
          v-if="canManage"
          type="button"
          class="ink-chip"
          :class="activeTab === 'attempts' ? 'bg-accent/60' : 'bg-paper hover:bg-accent/30'"
          @click="activeTab = 'attempts'"
          :disabled="!quizExists"
          :title="!quizExists ? 'Buat quiz dulu' : ''"
        >
          Attempts
        </button>

        <div class="ml-auto flex items-center gap-2">
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
      </div>
    </header>

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
      <p class="mt-2 text-sm font-semibold text-ink/60">{{ canManage ? 'Buat quiz untuk sesi ini.' : 'Tunggu quiz dipublish oleh pengampu modul.' }}</p>
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

            <p v-if="studentNotice" class="mt-4 rounded-xl border-2 border-ink bg-accent/30 px-4 py-3 text-sm font-semibold text-ink">
              {{ studentNotice }}
            </p>
          </div>
        </aside>

        <main class="space-y-4">
          <article class="ink-card p-6">
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Quiz</p>
            <h2 class="mt-2 text-xl font-semibold">{{ quizTitle }}</h2>
            <p v-if="quizDescription" class="mt-3 whitespace-pre-wrap text-sm font-semibold text-ink/70">{{ quizDescription }}</p>

            
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
                    class="flex items-center justify-between gap-3 rounded-xl border-2 border-ink bg-cloud px-3 py-2 shadow-ink-sm"
                  >
                    <p class="text-sm font-semibold text-ink/80">{{ opt.option_text || opt.optionText || '' }}</p>
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
                @click="submit"
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

                <div class="mt-4">
                  <div v-if="(q.question_type || q.questionType) === 'mcq'" class="space-y-2">
                    <label
                      v-for="opt in (q.options || [])"
                      :key="opt.id || opt.option_id || opt.optionId || opt.option_text"
                      class="flex items-start gap-3 rounded-xl border-2 border-ink bg-cloud px-3 py-2 shadow-ink-sm"
                    >
                      <input
                        type="radio"
                        class="mt-1"
                        :name="`q-${q.id || q.question_id || q.questionId}`"
                        :value="opt.id || opt.option_id || opt.optionId"
                        v-model="studentAnswersMcq[String(q.id || q.question_id || q.questionId)]"
                      />
                      <span class="text-sm font-semibold text-ink/80">{{ opt.option_text || opt.optionText || '' }}</span>
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

                <img
                  v-if="mediaSrcForQuestion(q)"
                  :src="mediaSrcForQuestion(q)"
                  alt="Question image"
                  class="mt-4 w-full max-h-[360px] rounded-2xl border-2 border-ink object-contain bg-cloud shadow-ink-sm"
                  loading="lazy"
                />
              </article>
            </div>
          </article>
        </main>
      </div>

      <div v-else-if="activeTab === 'questions'" class="space-y-4">
        <div class="ink-card p-6">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Soal</p>
              <p class="mt-2 text-sm font-semibold text-ink/60">Kelola soal MCQ dan essay untuk quiz ini.</p>
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
                class="flex items-center justify-between gap-3 rounded-xl border-2 border-ink bg-cloud px-3 py-2 shadow-ink-sm"
              >
                <p class="text-sm font-semibold text-ink/80">{{ opt.option_text || opt.optionText || '' }}</p>
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

            <button
              type="button"
              class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
              :disabled="attemptsStatus === 'loading'"
              @click="loadAttempts({ force: true })"
            >
              {{ attemptsStatus === 'loading' ? 'Memuat...' : 'Refresh' }}
            </button>
          </div>

          <p v-if="attemptsError" class="mt-4 rounded-xl border-2 border-rose-700 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900">
            {{ attemptsError }}
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
                <div class="mt-4 rounded-2xl border-2 border-ink bg-cloud p-4 shadow-ink-sm">
                  <pre class="overflow-auto text-xs font-semibold text-ink/70">{{ prettyJson(attemptDetail) }}</pre>
                </div>

                <div class="mt-6">
                  <p class="text-sm font-extrabold">Review Essay</p>
                  <p class="mt-2 text-sm font-semibold text-ink/60">Isi manual points dan feedback untuk soal essay, lalu simpan.</p>

                  <p v-if="reviewError" class="mt-3 rounded-xl border-2 border-rose-700 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900">
                    {{ reviewError }}
                  </p>

                  <p v-else-if="!essayReviewItems.length" class="mt-3 text-sm font-semibold text-ink/60">
                    Tidak ditemukan jawaban essay pada payload attempt.
                  </p>

                  <div v-else class="mt-4 space-y-3">
                    <article
                      v-for="item in essayReviewItems"
                      :key="item.question_id"
                      class="rounded-2xl border-2 border-ink bg-paper p-5 shadow-ink-sm"
                    >
                      <p class="text-sm font-extrabold">Question #{{ item.question_id }}</p>
                      <p v-if="item.question_text" class="mt-2 text-sm font-semibold text-ink/70">{{ item.question_text }}</p>
                      <p v-if="item.essay_answer" class="mt-2 whitespace-pre-wrap text-sm font-semibold text-ink/70">{{ item.essay_answer }}</p>

                      <div class="mt-4 grid gap-3 sm:grid-cols-2">
                        <label class="block space-y-2">
                          <span class="text-sm font-semibold">Manual points</span>
                          <input
                            v-model.number="reviewDraftByQuestionId[String(item.question_id)].manual_points"
                            type="number"
                            class="ink-input"
                            min="0"
                          />
                        </label>

                        <label class="block space-y-2">
                          <span class="text-sm font-semibold">Feedback</span>
                          <input
                            v-model.trim="reviewDraftByQuestionId[String(item.question_id)].reviewer_feedback"
                            type="text"
                            class="ink-input"
                            placeholder="Catatan untuk murid (opsional)"
                          />
                        </label>
                      </div>
                    </article>

                    <button
                      type="button"
                      class="rounded-xl border-2 border-ink bg-emerald-500 px-4 py-2 text-sm font-extrabold text-white shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
                      :disabled="reviewStatus === 'loading'"
                      @click="saveReview"
                    >
                      {{ reviewStatus === 'loading' ? 'Menyimpan...' : 'Simpan Review' }}
                    </button>
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
      :subtitle="quizModalMode === 'create' ? 'Buat quiz untuk sesi ini.' : 'Ubah pengaturan quiz.'"
      @close="closeQuizModal"
    >
      <form class="space-y-4" @submit.prevent>
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
            Idle
          </button>
          <span class="text-xs font-bold text-ink/50">Idle = tanpa batas waktu.</span>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
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
          <label class="block space-y-2">
            <span class="text-sm font-semibold">Passing score</span>
            <input v-model.number="quizDraft.passing_score" type="number" min="0" max="100" step="0.01" class="ink-input" />
          </label>
        </div>

        <div class="space-y-2">
          <span class="text-sm font-semibold">Banner (opsional)</span>
          <input ref="quizBannerInputRef" type="file" class="hidden" @change="onPickQuizBanner" />

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm font-extrabold shadow-ink-sm"
              @click="quizBannerInputRef && quizBannerInputRef.click()"
            >
              Choose file
            </button>
            <span class="text-xs font-bold text-ink/50">{{ quizDraft.bannerLabel }}</span>

            <label
              v-if="quizModalMode === 'edit'"
              class="ml-auto inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-paper px-3 py-2 text-xs font-extrabold shadow-ink-sm"
              title="Hapus banner saat update"
            >
              <input type="checkbox" v-model="quizDraft.remove_banner" />
              Remove banner
            </label>
          </div>
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
      kicker="Soal"
      :subtitle="questionModalMode === 'create' ? 'Buat soal baru untuk quiz.' : 'Ubah soal.'"
      @close="closeQuestionModal"
    >
      <form class="space-y-4" @submit.prevent>
        <div class="rounded-2xl border-2 border-ink bg-cloud p-4 shadow-ink-sm">
          <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Tipe Soal</p>
          <p class="mt-1 text-sm font-extrabold">Multiple Choice (MCQ)</p>
          <p class="mt-1 text-sm font-semibold text-ink/60">Centang opsi yang benar. Minimal 2 opsi dan minimal 1 jawaban benar.</p>
        </div>

        <label class="block space-y-2">
          <span class="text-sm font-semibold">Question</span>
          <textarea v-model.trim="questionDraft.question_text" class="ink-input min-h-[110px] resize-y" placeholder="Tulis pertanyaan..." />
        </label>

        <label class="block space-y-2">
          <span class="text-sm font-semibold">Points</span>
          <input v-model.number="questionDraft.points" type="number" min="0" class="ink-input" />
        </label>

        <div class="space-y-3">
          <p class="text-sm font-semibold">Options</p>

          <div class="space-y-2">
            <div
              v-for="(opt, idx) in questionDraft.options"
              :key="idx"
              class="flex flex-col gap-2 rounded-2xl border-2 border-ink bg-cloud p-4 shadow-ink-sm sm:flex-row sm:items-center"
            >
              <input v-model.trim="opt.option_text" class="ink-input flex-1" placeholder="Option text..." />
              <label class="inline-flex items-center gap-2 text-xs font-extrabold text-ink/70">
                <input type="checkbox" v-model="opt.is_correct" />
                Correct
              </label>
              <button
                type="button"
                class="rounded-xl border-2 border-rose-700 bg-rose-50 px-3 py-2 text-xs font-extrabold text-rose-900 shadow-ink-sm"
                @click="removeOption(idx)"
              >
                Hapus
              </button>
            </div>
          </div>

          <button
            type="button"
            class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm font-extrabold shadow-ink-sm"
            @click="addOption"
          >
            + Tambah Option
          </button>
        </div>

        <div class="space-y-2">
          <span class="text-sm font-semibold">Gambar (opsional)</span>
          <input ref="questionMediaInputRef" type="file" accept="image/*" class="hidden" @change="onPickQuestionMedia" />
          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm font-extrabold shadow-ink-sm"
              @click="questionMediaInputRef && questionMediaInputRef.click()"
            >
              Choose image
            </button>
            <span class="text-xs font-bold text-ink/50">{{ questionDraft.mediaLabel }}</span>
          </div>

          <img
            v-if="questionMediaPreviewUrl"
            :src="questionMediaPreviewUrl"
            alt="Selected image preview"
            class="w-full max-h-[240px] rounded-2xl border-2 border-ink object-contain bg-cloud shadow-ink-sm"
          />
        </div>

        <p v-if="questionModalError" class="rounded-xl border-2 border-ink bg-accent/30 px-4 py-3 text-sm font-semibold text-ink">
          {{ questionModalError }}
        </p>
      </form>

      <template #actions>
        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm font-extrabold shadow-ink-sm"
          :disabled="questionModalLoading"
          @click="closeQuestionModal"
        >
          Batal
        </button>
        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-accent px-3 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="questionModalLoading"
          @click="saveQuestion"
        >
          {{ questionModalLoading ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </template>
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

const activeTab = ref('overview')

const publishStatus = ref('idle')

const attemptsStatus = ref('idle')
const attemptsError = ref('')
const attempts = ref([])
const selectedAttemptId = ref(null)
const attemptDetailStatus = ref('idle')
const attemptDetailError = ref('')
const attemptDetail = ref(null)

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

const questionMediaStatusById = reactive({})
const questionMediaUrlById = reactive({})
const questionMediaPreviewUrl = ref('')

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
  passing_score: 75,
  bannerFile: null,
  bannerLabel: 'No file chosen',
  remove_banner: false,
})

const questionModalOpen = ref(false)
const questionModalMode = ref('create')
const questionModalLoading = ref(false)
const questionModalError = ref('')
const questionMediaInputRef = ref(null)
const editingQuestionId = ref(null)
const questionDraft = ref({
  question_type: 'mcq',
  question_text: '',
  points: 10,
  options: [
    { option_text: '', is_correct: true },
    { option_text: '', is_correct: false },
  ],
  mediaFile: null,
  mediaLabel: 'No file chosen',
})

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

onBeforeUnmount(() => {
  clearCountdown()
  revokeBannerUrl()
  revokeAllQuestionMedia()
  revokeQuestionMediaPreview()
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
  revokeQuestionMediaPreview()
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

async function ensureQuestionMedia(q) {
  const id = getQuestionId(q)
  if (!id) return

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

function revokeQuestionMediaPreview() {
  if (questionMediaPreviewUrl.value) URL.revokeObjectURL(questionMediaPreviewUrl.value)
  questionMediaPreviewUrl.value = ''
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
  } catch {
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
    await loadBanner()
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
      passing_score: Number(quiz.value?.passing_score ?? 75),
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
      passing_score: 75,
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

function openQuestionModal(mode, q) {
  questionModalMode.value = mode
  questionModalError.value = ''
  questionModalLoading.value = false
  editingQuestionId.value = null

  revokeQuestionMediaPreview()

  if (mode === 'edit' && q) {
    const qid = q.id || q.question_id || q.questionId
    editingQuestionId.value = qid

    const type = q.question_type || q.questionType || 'mcq'
    if (String(type).toLowerCase() !== 'mcq') {
      error.value = 'Saat ini UI hanya mendukung soal MCQ.'
      return
    }
    const opts = Array.isArray(q.options) ? q.options : []
    questionDraft.value = {
      question_type: 'mcq',
      question_text: q.question_text || q.questionText || '',
      points: Number(q.points ?? 0),
      options: (opts.length
        ? opts.map((o) => ({
            option_text: o.option_text || o.optionText || '',
            is_correct: Boolean(o.is_correct ?? o.isCorrect),
          }))
        : [
            { option_text: '', is_correct: true },
            { option_text: '', is_correct: false },
          ]
      ),
      mediaFile: null,
      mediaLabel: 'No file chosen',
    }
  } else {
    questionDraft.value = {
      question_type: 'mcq',
      question_text: '',
      points: 10,
      options: [
        { option_text: '', is_correct: true },
        { option_text: '', is_correct: false },
      ],
      mediaFile: null,
      mediaLabel: 'No file chosen',
    }
  }

  questionModalOpen.value = true
}

function closeQuestionModal() {
  questionModalOpen.value = false
  revokeQuestionMediaPreview()
}

function goToQuestions() {
  activeTab.value = 'questions'
}

function addOption() {
  questionDraft.value.options.push({ option_text: '', is_correct: false })
}

function removeOption(idx) {
  questionDraft.value.options.splice(idx, 1)
}

function onPickQuestionMedia(e) {
  const file = e?.target?.files?.[0]
  questionDraft.value.mediaFile = file || null
  questionDraft.value.mediaLabel = file?.name || 'No file chosen'

  revokeQuestionMediaPreview()
  if (file) {
    questionMediaPreviewUrl.value = URL.createObjectURL(file)
  }
}

function validateQuestionDraft() {
  const type = 'mcq'
  const text = String(questionDraft.value.question_text || '').trim()
  if (!text) return 'Question wajib diisi.'

  if (type === 'mcq') {
    const opts = (questionDraft.value.options || [])
      .map((o) => ({ option_text: String(o.option_text || '').trim(), is_correct: Boolean(o.is_correct) }))
      .filter((o) => o.option_text)

    if (opts.length < 2) return 'MCQ harus memiliki minimal 2 opsi.'
    if (!opts.some((o) => o.is_correct)) return 'MCQ harus memiliki minimal 1 jawaban benar.'
  }

  return ''
}

async function saveQuestion() {
  const validationError = validateQuestionDraft()
  if (validationError) {
    questionModalError.value = validationError
    return
  }

  questionModalLoading.value = true
  questionModalError.value = ''
  try {
    const type = 'mcq'
    const payload = {
      question_type: type,
      question_text: String(questionDraft.value.question_text || '').trim(),
      points: questionDraft.value.points,
      options: type === 'mcq'
        ? (questionDraft.value.options || [])
            .map((o) => ({ option_text: String(o.option_text || '').trim(), is_correct: Boolean(o.is_correct) }))
            .filter((o) => o.option_text)
        : undefined,
      media: questionDraft.value.mediaFile || undefined,
    }

    const res = questionModalMode.value === 'create'
      ? await services.quizzes.addQuestion(moduleId.value, sessionId.value, payload)
      : await services.quizzes.updateQuestion(moduleId.value, sessionId.value, editingQuestionId.value, payload)

    if (res?.success === false) throw new Error(res?.message || 'Gagal menyimpan soal')

    questionModalOpen.value = false
    await loadQuiz({ force: true })
  } catch (e) {
    questionModalError.value = e?.message || 'Gagal menyimpan soal'
  } finally {
    questionModalLoading.value = false
  }
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
    studentNotice.value = res?.message || 'Jawaban berhasil dikirim.'
  } catch (e) {
    submitError.value = e?.message || 'Gagal submit quiz'
  } finally {
    submitStatus.value = 'idle'
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
      manual_points: a.manual_points ?? a.manualPoints,
      reviewer_feedback: a.reviewer_feedback ?? a.reviewerFeedback,
    }))
    .filter((a) => a.question_id)
})

async function saveReview() {
  reviewStatus.value = 'loading'
  reviewError.value = ''
  try {
    const reviews = essayReviewItems.value.map((item) => {
      const draft = reviewDraftByQuestionId.value[String(item.question_id)] || {}
      return {
        question_id: item.question_id,
        manual_points: Number(draft.manual_points ?? 0),
        reviewer_feedback: String(draft.reviewer_feedback || '').trim(),
      }
    })

    const res = await services.quizzes.reviewAttempt(moduleId.value, sessionId.value, selectedAttemptId.value, { reviews })
    if (res?.success === false) throw new Error(res?.message || 'Gagal menyimpan review')
    // refresh detail
    await selectAttempt({ id: selectedAttemptId.value })
  } catch (e) {
    reviewError.value = e?.message || 'Gagal menyimpan review'
  } finally {
    reviewStatus.value = 'idle'
  }
}

function prettyJson(obj) {
  try {
    return JSON.stringify(obj, null, 2)
  } catch {
    return String(obj)
  }
}

watch(activeTab, async (tab) => {
  if (tab === 'attempts' && canManage.value && quizExists.value) {
    await loadAttempts({ force: true })
  }
})

</script>
