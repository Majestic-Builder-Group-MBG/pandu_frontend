<template>
  <section class="space-y-6">
    <header class="ink-card relative z-20 overflow-visible">
      <div class="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_360px]">
        <div class="p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Modul</p>
              <h1 class="mt-2 truncate text-2xl font-semibold">{{ moduleTitle }}</h1>
              <p class="mt-2 line-clamp-2 text-sm font-semibold text-ink/60">{{ moduleDesc }}</p>
              <p v-if="moduleTeacher" class="mt-3 text-xs font-bold text-ink/50">by {{ moduleTeacher }}</p>
              <div v-if="showEnrollKey" class="mt-4 space-y-3">
                <div
                  v-if="feedback.message"
                  class="rounded-xl border-2 px-4 py-3 text-sm font-semibold shadow-ink-sm"
                  :class="feedbackClasses"
                >
                  {{ feedback.message }}
                </div>

                <div class="relative inline-flex flex-wrap items-center gap-2">
                  <span class="ink-chip bg-accent/60">Kode Akses</span>

                  <template v-if="isEditingEnrollKey">
                    <input
                      v-model.trim="enrollKeyDraft"
                      type="text"
                      class="min-w-[240px] rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm font-extrabold text-ink shadow-ink-sm outline-none focus:bg-cloud"
                      placeholder="TRIGONOMETRI-KELAS-7A"
                    />
                    <button
                      type="button"
                      class="inline-flex items-center gap-2 rounded-xl border-2 border-emerald-700 bg-emerald-500 px-3 py-2 text-xs font-extrabold text-white shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
                      :disabled="moduleActionLoading === 'saving'"
                      @click="saveEnrollKey"
                    >
                      <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
                        <path d="M5 12.5l4 4L19 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      {{ moduleActionLoading === 'saving' ? 'Menyimpan...' : 'Simpan' }}
                    </button>
                    <button
                      type="button"
                      class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-xs font-extrabold shadow-ink-sm"
                      :disabled="moduleActionLoading === 'saving'"
                      @click="cancelEnrollKeyEdit"
                    >
                      Batal
                    </button>
                  </template>

                  <template v-else>
                    <span class="rounded-xl border-2 border-ink bg-cloud px-3 py-2 font-mono text-xs font-extrabold text-ink">
                      {{ enrollKey || 'Loading...' }}
                    </span>
                    <div ref="menuRef" class="relative">
                      <button
                        ref="menuButtonRef"
                        type="button"
                        class="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-paper shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        @click="toggleEnrollMenu"
                        aria-label="Enroll key actions"
                      >
                        <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                          <path d="M5 12h.01M12 12h.01M19 12h.01" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" />
                        </svg>
                      </button>

                      <div
                        v-if="menuOpen"
                        class="fixed z-[60] rounded-2xl border-2 border-ink bg-paper p-2 shadow-ink"
                        :style="menuStyle"
                      >
                        <button
                          type="button"
                          class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-extrabold hover:bg-accent/30"
                          @click="startEditEnrollKey"
                        >
                          <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4 shrink-0" aria-hidden="true">
                            <path d="M4 20h4l10.5-10.5a2 2 0 0 0 0-3L16.5 4.5a2 2 0 0 0-3 0L3 15v5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                          </svg>
                          Ubah
                        </button>
                        <button
                          type="button"
                          class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-extrabold hover:bg-accent/30"
                          @click="regenerateEnrollKey"
                        >
                          <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4 shrink-0" aria-hidden="true">
                            <path d="M21 12a9 9 0 1 1-3-6.7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            <path d="M21 4v6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          Buat Ulang
                        </button>
                        <button
                          type="button"
                          class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-extrabold text-rose-700 hover:bg-rose-50"
                          @click="openDeleteModuleConfirm"
                        >
                          <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4 shrink-0" aria-hidden="true">
                            <path d="M4 7h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            <path d="M10 11v7M14 11v7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            <path d="M6 7l1 14h10l1-14" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                            <path d="M9 7V4h6v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <RouterLink
              to="/courses"
              class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              Back
            </RouterLink>
          </div>
        </div>

        <div class="border-t-2 border-ink bg-cloud rounded-b-xl lg:border-l-2 lg:border-t-0 lg:rounded-b-none lg:rounded-r-xl">
          <div class="aspect-[16/9] w-full rounded-xl">
            <img :src="bannerSrc" alt="Module banner" class="h-full w-full object-cover rounded-xl" />
          </div>
        </div>
      </div>
    </header>

    <div class="grid gap-6 lg:grid-cols-[360px_1fr]">
      <aside class="space-y-4">
        <div class="ink-card p-6">
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-lg font-semibold">Sesi</h2>
            <button
              v-if="canManageSessions"
              type="button"
              class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              @click="openCreateSession"
            >
              + Tambah
            </button>
          </div>

          <p v-if="sessionsStatus === 'loading'" class="mt-4 text-sm font-semibold text-ink/60">Memuat sesi...</p>
          <p v-else-if="sessionsStatus === 'error'" class="mt-4 text-sm font-semibold text-ink/60">
            Gagal memuat sesi: <span class="font-extrabold">{{ sessionsError }}</span>
          </p>

          <div v-else class="mt-5 space-y-3">
            <SessionItem
              v-for="s in sessions"
              :key="s.id"
              :module-id="moduleId"
              :session="s"
              :selected="selectedSessionId === s.id"
              :can-manage="canManageSessions"
              @select="selectSession(s.id)"
              @renamed="onSessionRenamed"
              @schedule="openScheduleForSession"
              @delete="openDelete(s)"
            />
          </div>
        </div>
        <div v-if="showTips" class="ink-card px-6 pt-6 pb-4">
          <div class="flex items-start justify-between gap-4">
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Tips</p>
          </div>
          <p class="mt-2 pb-2 text-sm font-semibold text-ink/70">Klik sesi untuk melihat materi. Konten bisa berupa file, link, atau teks ringkasan.</p>
          <div class="flex justify-start">
            <button
              type="button"
              class="h-7 w-9 place-items-center hover:bg-accent/40 hover:rounded-xl"
              @click="showTips = false"
              aria-label="Tutup tips"
              title="Tutup"
            >
            <span class="text-sm flex align-center font-semibold text-ink/50">Close</span>
          </button>
          
          </div>
        </div>
      </aside>

      <main class="space-y-4">
        <article class="ink-card overflow-visible">
          <div class="flex items-center justify-between gap-4 px-6 pt-6">
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-semibold">Materi</h2>

              <button
                v-if="canShowReminder"
                type="button"
                class="inline-flex items-center gap-1 rounded-xl border-2 px-2.5 py-1 text-xs font-extrabold shadow-ink-sm"
                :class="reminderEnabled ? 'border-emerald-700 bg-emerald-50 text-emerald-800' : 'border-ink bg-paper text-ink/80'"
                :disabled="reminderStatus === 'loading' || reminderStatus === 'saving' || isSessionAlreadyOpen"
                :title="isSessionAlreadyOpen ? 'Sesi sudah dibuka' : 'Ingatkan saat sesi dibuka'"
                @click="toggleReminder"
              >
                <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
                  <path d="M12 3a5 5 0 0 0-5 5v2.3c0 .8-.3 1.6-.8 2.2L5 14.2c-.5.7 0 1.8.9 1.8h12.2c.9 0 1.4-1.1.9-1.8l-1.2-1.7a3.8 3.8 0 0 1-.8-2.2V8a5 5 0 0 0-5-5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                  <path d="M10 18a2 2 0 0 0 4 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
                {{ reminderButtonLabel }}
              </button>
            </div>

            <div v-if="canManageSessions" class="relative">
              <button
                ref="contentsMenuButtonRef"
                type="button"
                class="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink bg-paper shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                aria-label="Opsi materi"
                @click="toggleContentsMenu"
                :disabled="!selectedSessionId"
              >
                <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                  <path d="M5 12h.01M12 12h.01M19 12h.01" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" />
                </svg>
              </button>

              <div
                v-if="contentsMenuOpen"
                ref="contentsMenuRef"
                class="fixed z-[60] rounded-2xl border-2 border-ink bg-paper p-2 shadow-ink"
                :style="contentsMenuStyle"
              >
                <button
                  type="button"
                  class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-extrabold hover:bg-accent/30"
                  @click="openAddContent"
                >
                  <span class="grid h-8 w-8 place-items-center">
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                      <path d="M12 5v14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                      <path d="M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                    </svg>
                  </span>
                  Tambah Materi
                </button>
              </div>
            </div>
          </div>

          <div class="bg-paper px-6 pb-6">
            <div v-if="selectedSessionId" class="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p class="text-xs font-bold text-ink/60">
                Status:
                <span class="font-extrabold text-ink/80">{{ scheduleLabel }}</span>
              </p>
              <p v-if="canShowReminder && reminderError" class="text-xs font-bold text-rose-700">{{ reminderError }}</p>
            </div>

            <p v-if="contentsStatus === 'idle'" class="text-sm font-semibold text-ink/60">Pilih sesi untuk melihat materi.</p>
            <p v-else-if="contentsStatus === 'loading'" class="text-sm font-semibold text-ink/60">Memuat materi...</p>
            <p v-else-if="contentsStatus === 'locked'" class="text-sm font-semibold text-ink/60">
              Sesi ini belum dibuka.
              <span v-if="scheduleOpenAt" class="font-extrabold">Dibuka {{ scheduleHuman }}.</span>
            </p>
            <p v-else-if="contentsStatus === 'error'" class="text-sm font-semibold text-ink/60">
              Gagal memuat materi: <span class="font-extrabold">{{ contentsError }}</span>
            </p>

            <div v-else-if="!contents.length" class="mt-4 rounded-2xl border-2 border-ink bg-cloud p-6 text-center shadow-ink-sm">
              <p class="text-sm font-extrabold">Belum ada materi.</p>
              <p class="mt-2 text-sm font-semibold text-ink/60">Materi dapat berupa berkas, tautan, atau ringkasan teks.</p>
            </div>

            <div v-else class="mt-4 space-y-3">
              <article v-for="c in contents" :key="c.id" class="relative rounded-2xl border-2 border-ink bg-paper p-5 shadow-ink-sm">
                <div class="flex items-start justify-between gap-4">
                  <div class="min-w-0">
                    <p class="text-sm font-extrabold">{{ c.title }}</p>
                  </div>

                  <div v-if="canManageSessions" class="relative">
                    <button
                      type="button"
                      class="grid h-9 w-9 place-items-center rounded-xl border-2 border-transparent text-ink/70 hover:border-ink hover:bg-accent/20"
                      aria-label="Opsi materi"
                      @click.stop="toggleContentActions(c.id)"
                    >
                      <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                        <path d="M5 12h.01M12 12h.01M19 12h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                      </svg>
                    </button>

                    <div
                      v-if="contentActionsOpenId === c.id"
                      class="absolute right-0 top-10 z-[80] w-44 rounded-2xl border-2 border-ink bg-paper p-2 shadow-ink"
                    >
                      <button
                        type="button"
                        class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-extrabold hover:bg-accent/30"
                        @click="openEditContent(c)"
                      >
                        <span class="grid h-8 w-8 place-items-center rounded-xl border-2 border-ink bg-paper shadow-ink-sm">
                          <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
                            <path d="M4 20h4l10.5-10.5a2 2 0 0 0 0-3L16.5 4.5a2 2 0 0 0-3 0L3 15v5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                            <path d="M12.5 6.5l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                          </svg>
                        </span>
                        Edit
                      </button>

                      <button
                        type="button"
                        class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-extrabold text-rose-700 hover:bg-rose-50"
                        @click="openDeleteContent(c)"
                      >
                        <span class="grid h-8 w-8 place-items-center rounded-xl border-2 border-ink bg-paper shadow-ink-sm">
                          <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
                            <path d="M4 7h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            <path d="M10 11v7M14 11v7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            <path d="M6 7l1 14h10l1-14" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                            <path d="M9 7V4h6v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                          </svg>
                        </span>
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>

                <div class="mt-3">
                  <p v-if="c.type === 'text'" class="whitespace-pre-wrap text-sm font-semibold text-ink/70">{{ c.text }}</p>

                <a
                  v-else-if="c.type === 'url'"
                  :href="c.url"
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm hover:bg-accent/20"
                >
                  Buka Tautan
                  <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
                    <path d="M14 3h7v7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </a>

                <p v-if="c.type === 'file' && c.text" class="mt-3 whitespace-pre-wrap text-sm font-semibold text-ink/70">{{ c.text }}</p>
                
                <p v-if="c.type === 'url' && c.text" class="mt-3 whitespace-pre-wrap text-sm font-semibold text-ink/70">{{ c.text }}</p>

                <div v-if="c.type === 'file'" class="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-70"
                    @click="viewFile(c)"
                    :disabled="fileViewStatusById[c.id] === 'loading' || mediaPreviewStatus === 'loading'"
                  >
                    {{ fileViewStatusById[c.id] === 'loading' || mediaPreviewStatus === 'loading' ? 'Memuat...' : 'Lihat' }}
                  </button>

                  <button
                    type="button"
                    class="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-paper shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-70"
                    @click="downloadFile(c)"
                    :disabled="downloadStatusById[c.id] === 'loading'"
                    aria-label="Unduh berkas"
                    title="Unduh"
                  >
                    <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                      <path d="M12 3v10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                      <path d="M7 11l5 5 5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M5 21h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                    </svg>
                  </button>

                  <p v-if="fileViewErrorById[c.id]" class="w-full text-xs font-bold text-rose-700">{{ fileViewErrorById[c.id] }}</p>
                </div>

              </div>
            </article>
          </div>
          </div>
        </article>
      </main>
    </div>

    <BaseModal
      :open="contentModalOpen"
      :title="contentModalMode === 'add' ? 'Tambah Materi' : 'Edit Materi'"
      kicker="Materi"
      :subtitle="contentModalMode === 'add' ? 'Tambahkan konten untuk sesi yang dipilih.' : 'Ubah materi yang dipilih.'"
      @close="closeContentModal"
    >
      <form class="space-y-4" @submit.prevent="saveContent">
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="ink-chip"
            :class="contentType === 'url' ? 'bg-accent/60' : 'bg-paper hover:bg-accent/30'"
            @click="contentType = 'url'"
          >
            Tautan
          </button>
          <button
            type="button"
            class="ink-chip"
            :class="contentType === 'text' ? 'bg-accent/60' : 'bg-paper hover:bg-accent/30'"
            @click="contentType = 'text'"
          >
            Teks
          </button>
          <button
            type="button"
            class="ink-chip"
            :class="contentType === 'file' ? 'bg-accent/60' : 'bg-paper hover:bg-accent/30'"
            @click="contentType = 'file'"
          >
            Berkas
          </button>
        </div>

        <label class="block space-y-2">
          <span class="text-sm font-semibold">Judul materi (opsional)</span>
          <input v-model.trim="contentTitle" class="ink-input" placeholder="Judul materi..." />
        </label>

        <label v-if="contentType === 'url'" class="block space-y-2">
          <span class="text-sm font-semibold">Tautan</span>
          <input v-model.trim="contentUrl" class="ink-input" placeholder="https://..." />
        </label>

        <label v-if="contentType === 'file'" class="block space-y-2">
          <span class="text-sm font-semibold">Berkas</span>

          <input ref="contentFileInputRef" type="file" class="hidden" @change="onPickContentFile" />

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-accent/20"
              @click="triggerContentFilePicker"
            >
              Change file
            </button>

            <span class="text-xs font-bold text-ink/50">
              {{ contentFileLabel }}
            </span>
          </div>
        </label>

        <label class="block space-y-2">
          <span class="text-sm font-semibold">{{ contentType === 'text' ? 'Isi materi' : 'Text tambahan (opsional)' }}</span>
          <textarea
            v-model.trim="contentText"
            class="ink-input min-h-[120px] resize-y"
            :placeholder="contentType === 'text' ? 'Materi inti sesi ini adalah ...' : 'Ringkasan / poin penting / petunjuk (opsional)'"
          />
        </label>

        <p v-if="contentModalError" class="rounded-xl border-2 border-ink bg-accent/30 px-4 py-3 text-sm font-semibold text-ink">{{ contentModalError }}</p>
      </form>

      <template #actions>
        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm font-extrabold shadow-ink-sm"
          :disabled="contentModalLoading"
          @click="closeContentModal"
        >
          Batal
        </button>
        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-accent px-3 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="contentModalLoading"
          @click="saveContent"
        >
          {{ contentModalLoading ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </template>
    </BaseModal>

    <ConfirmDialog
      :open="deleteOpen"
      title="Hapus Sesi"
      kicker="Danger"
      :message="deleteMessage"
      confirm-text="Ya, hapus"
      :is-loading="deleteLoading"
      @cancel="closeDelete"
      @confirm="confirmDelete"
    />

    <BaseModal
      :open="scheduleOpen"
      title="Jadwal Buka Sesi"
      kicker="Schedule"
      subtitle="Atur kapan sesi bisa dibuka oleh murid."
      @close="closeScheduleModal"
    >
      <form class="space-y-4" @submit.prevent="saveSchedule">
        <label class="block space-y-2">
          <span class="text-sm font-semibold">Open at (opsional)</span>
          <input v-model="scheduleDraftLocal" type="datetime-local" class="ink-input" />
          <p class="text-xs font-bold text-ink/50">Kosongkan untuk menghapus jadwal.</p>
        </label>

        <p v-if="scheduleModalError" class="rounded-xl border-2 border-ink bg-accent/30 px-4 py-3 text-sm font-semibold text-ink">
          {{ scheduleModalError }}
        </p>
      </form>

      <template #actions>
        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm font-extrabold shadow-ink-sm"
          :disabled="scheduleSaving"
          @click="closeScheduleModal"
        >
          Batal
        </button>

        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="scheduleSaving"
          @click="clearSchedule"
        >
          Hapus Jadwal
        </button>

        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-accent px-3 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="scheduleSaving"
          @click="saveSchedule"
        >
          {{ scheduleSaving ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </template>
    </BaseModal>

    <BaseModal
      :open="createSessionOpen"
      title="Tambah Sesi"
      kicker="Sesi"
      subtitle="Buat sesi baru untuk modul ini."
      @close="closeCreateSession"
    >
      <form class="space-y-4" @submit.prevent="createSession">
        <label class="block space-y-2">
          <span class="text-sm font-semibold">Judul Sesi</span>
          <input v-model.trim="createSessionTitle" class="ink-input" placeholder="Contoh: Pertemuan 1" />
        </label>

        <label class="block space-y-2">
          <span class="text-sm font-semibold">Jadwal Buka (opsional)</span>
          <input v-model="createSessionOpenAtLocal" type="datetime-local" class="ink-input" />
          <p class="text-xs font-bold text-ink/50">Jika kosong, sesi berstatus belum dibuka.</p>
        </label>

        <p v-if="createSessionError" class="rounded-xl border-2 border-ink bg-accent/30 px-4 py-3 text-sm font-semibold text-ink">
          {{ createSessionError }}
        </p>
      </form>

      <template #actions>
        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm font-extrabold shadow-ink-sm"
          :disabled="createSessionLoading"
          @click="closeCreateSession"
        >
          Batal
        </button>
        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-accent px-3 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="createSessionLoading"
          @click="createSession"
        >
          {{ createSessionLoading ? 'Membuat...' : 'Buat Sesi' }}
        </button>
      </template>
    </BaseModal>

    <ConfirmDialog
      :open="deleteContentOpen"
      title="Hapus Materi"
      kicker="Danger"
      :message="deleteContentMessage"
      confirm-text="Ya, hapus"
      :is-loading="deleteContentLoading"
      @cancel="closeDeleteContent"
      @confirm="confirmDeleteContent"
    />

    <div
      v-if="mediaPreviewOpen"
      class="fixed inset-0 z-[80] grid place-items-center bg-ink/40 p-4"
      @click.self="closeMediaPreview"
    >
      <article class="ink-card w-full max-w-[960px] overflow-hidden">
        <header class="flex items-center justify-between gap-4 border-b-2 border-ink bg-paper px-6 py-4">
          <div class="min-w-0">
            <p class="truncate text-sm font-extrabold">{{ mediaPreviewContent?.title || 'Berkas' }}</p>
            <p v-if="mediaPreviewContent?.fileName" class="mt-1 truncate text-xs font-bold text-ink/50">{{ mediaPreviewContent.fileName }}</p>
          </div>

          <button
            type="button"
            class="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-paper shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            @click="closeMediaPreview"
            aria-label="Tutup"
            title="Tutup"
          >
            <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
              <path d="M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
            </svg>
          </button>
        </header>

        <div class="bg-cloud px-6 py-5">
          <p v-if="mediaPreviewStatus === 'loading'" class="text-sm font-semibold text-ink/70">Memuat...</p>
          <p v-else-if="mediaPreviewStatus === 'error'" class="text-sm font-semibold text-ink/70">
            Gagal memuat: <span class="font-extrabold">{{ mediaPreviewError }}</span>
          </p>

          <template v-else>
            <p v-if="mediaPreviewContent?.text" class="mb-4 whitespace-pre-wrap text-sm font-semibold text-ink/70">{{ mediaPreviewContent.text }}</p>

            <div class="rounded-2xl border-2 border-ink bg-paper p-3 shadow-ink-sm">
              <img
                v-if="mediaPreviewKind === 'image'"
                :src="mediaPreviewUrl"
                alt="Preview"
                class="mx-auto max-h-[70vh] w-auto rounded-xl"
              />
              <video v-else-if="mediaPreviewKind === 'video'" :src="mediaPreviewUrl" controls class="w-full max-h-[70vh] rounded-xl" />
              <audio v-else :src="mediaPreviewUrl" controls class="w-full" />
            </div>
          </template>
        </div>
      </article>
    </div>

    <ConfirmDialog
      :open="deleteModuleOpen"
      title="Hapus Modul"
      kicker="Danger"
      :message="deleteModuleMessage"
      confirm-text="Ya, hapus modul"
      :is-loading="moduleActionLoading === 'deleting'"
      @cancel="closeDeleteModule"
      @confirm="confirmDeleteModule"
    />

  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import defaultBanner from '@/assets/images/module-banner-default.svg'
import { getServices } from '@/services'
import { useSessionContents } from '@/composables/moduleSessions/useSessionContents'
import { useModuleSessions } from '@/composables/moduleSessions/useModuleSessions'
import { useSessionReminder } from '@/composables/moduleSessions/useSessionReminder'
import { useAuthStore } from '@/stores/auth'
import { useEnrollmentsStore } from '@/stores/enrollments'
import { useModulesStore } from '@/stores/modules'
import { useModuleBannersStore } from '@/stores/moduleBanners'
import { useMediaPreview } from '@/composables/moduleSessions/useMediaPreview'
import { useSessionSchedule } from '@/composables/moduleSessions/useSessionSchedule'
import { useFloatingMenu } from '@/composables/ui/useFloatingMenu'
import SessionItem from '@/components/sessions/SessionItem.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const services = getServices()

const auth = useAuthStore()
const enrollments = useEnrollmentsStore()

const modules = useModulesStore()
const banners = useModuleBannersStore()

const moduleId = computed(() => Number(route.params.moduleId))
const preselectSessionId = computed(() => {
  const raw = route.query.sessionId
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : null
})

const showTips = ref(true)

const canManageSessions = computed(() => {
  const r = auth.user?.role
  return r === 'teacher' || r === 'admin'
})

const {
  sessions,
  sessionsStatus,
  sessionsError,
  selectedSessionId,
  deleteOpen,
  deleteLoading,
  deleteMessage,
  createSessionOpen,
  createSessionLoading,
  createSessionError,
  createSessionTitle,
  createSessionOpenAtLocal,
  loadSessions,
  selectSession,
  openCreateSession,
  closeCreateSession,
  createSession,
  openDelete,
  closeDelete,
  confirmDelete,
  resetSessionsState,
} = useModuleSessions({
  services,
  moduleId,
  preselectSessionId,
  canManageSessions,
  onDeleteError: (message) => {
    contentsError.value = message
  },
})

const {
  menuOpen,
  menuStyle,
  buttonRef: menuButtonRef,
  menuRef,
  toggle: toggleEnrollMenuInternal,
  hide: hideEnrollMenu,
  onDocumentClick: onEnrollMenuDocumentClick,
  onViewportChange: onEnrollMenuViewportChange,
} = useFloatingMenu({ preferredWidth: 176, minWidth: 140, estimatedHeight: 156 })
const isEditingEnrollKey = ref(false)
const enrollKeyDraft = ref('')
const deleteModuleOpen = ref(false)
const moduleActionLoading = ref('')
const feedback = ref({ type: '', message: '' })

const {
  menuOpen: contentsMenuOpen,
  menuStyle: contentsMenuStyle,
  buttonRef: contentsMenuButtonRef,
  menuRef: contentsMenuRef,
  toggle: toggleContentsMenu,
  hide: hideContentsMenu,
  onDocumentClick: onContentsMenuDocumentClick,
  onViewportChange: onContentsMenuViewportChange,
} = useFloatingMenu({ preferredWidth: 200, minWidth: 160, estimatedHeight: 96 })


const {
  mediaPreviewOpen,
  mediaPreviewStatus,
  mediaPreviewError,
  mediaPreviewUrl,
  mediaPreviewKind,
  mediaPreviewContent,
  openMediaPreview: openMediaPreviewInternal,
  closeMediaPreview,
} = useMediaPreview()


const moduleItem = computed(() => modules.getById(moduleId.value))

const moduleTitle = computed(() => moduleItem.value?.title || `Modul #${moduleId.value}`)
const moduleDesc = computed(() => moduleItem.value?.desc || ' ')
const moduleTeacher = computed(() => moduleItem.value?.teacherName || '')

const showEnrollKey = computed(() => {
  const r = auth.user?.role
  return r === 'teacher' || r === 'admin'
})

const enrollKey = ref('')

const bannerSrc = computed(() => {
  const cached = banners.urlsById[moduleId.value]
  if (cached) return cached
  return defaultBanner
})

const feedbackClasses = computed(() => {
  if (feedback.value.type === 'success') return 'border-emerald-700 bg-emerald-50 text-emerald-900'
  return 'border-rose-700 bg-rose-50 text-rose-900'
})

const isStudent = computed(() => auth.user?.role === 'student')
const isStudentAllowedModule = computed(() => {
  if (!isStudent.value) return true
  return enrollments.moduleIdSet.has(moduleId.value)
})

const {
  contents,
  contentsStatus,
  contentsError,
  downloadStatusById,
  fileViewStatusById,
  fileViewErrorById,
  contentActionsOpenId,
  contentModalOpen,
  contentModalMode,
  contentModalLoading,
  contentModalError,
  contentType,
  contentTitle,
  contentUrl,
  contentText,
  contentFileInputRef,
  contentFileLabel,
  deleteContentOpen,
  deleteContentMessage,
  deleteContentLoading,
  onPickContentFile,
  triggerContentFilePicker,
  openAddContent,
  openEditContent,
  closeContentModal,
  saveContent,
  openDeleteContent,
  closeDeleteContent,
  confirmDeleteContent,
  loadContents,
  downloadFile,
  viewFile,
  toggleContentActions,
  closeContentActions,
  setLockedState,
  resetContentsState,
} = useSessionContents({
  services,
  moduleId,
  selectedSessionId,
  openMediaPreview,
  hideContentsMenu,
})

const {
  scheduleStatus,
  scheduleError,
  scheduleOpenAt,
  scheduleOpen,
  scheduleSaving,
  scheduleModalError,
  scheduleDraftLocal,
  scheduleHuman,
  scheduleLabel,
  isLockedForStudent,
  loadSchedule,
  openScheduleForSession,
  closeScheduleModal,
  saveSchedule,
  clearSchedule,
  resetScheduleState,
} = useSessionSchedule({
  services,
  moduleId,
  selectedSessionId,
  canManageSessions,
  isStudent,
  onLocked: setLockedState,
  onUnlocked: loadContents,
})

const {
  reminderStatus,
  reminderError,
  reminderEnabled,
  reminderButtonLabel,
  isSessionAlreadyOpen,
  canShowReminder,
  loadReminder,
  toggleReminder,
  resetReminderState,
} = useSessionReminder({
  services,
  moduleId,
  selectedSessionId,
  isStudent,
  scheduleOpenAt,
})

const deleteModuleMessage = computed(() => {
  return `Kamu yakin mau menghapus modul ${moduleTitle.value}? Tindakan ini tidak bisa dibatalkan.`
})

onMounted(async () => {
  if (isStudent.value && !enrollments.moduleIds.length) {
    try {
      await enrollments.fetchMine({ services, force: true })
    } catch {
      // ignore; API access checks still apply
    }
  }

  if (isStudent.value && !isStudentAllowedModule.value) {
    contentsStatus.value = 'error'
    contentsError.value = 'Modul ini tidak termasuk enrollment kamu.'
    return
  }

  // Ensure modules list exists so title/teacher show.
  if (!modules.items.length) {
    try {
      await modules.fetchAll({ services })
    } catch {
      // ignore; sessions still can be fetched
    }
  }

  await loadSessions()
  await ensureModuleBanner()
  await ensureEnrollKey()

  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
  window.addEventListener('resize', onViewportChange)
  window.addEventListener('scroll', onViewportChange, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
  closeMediaPreview()
})

watch(moduleId, async () => {
  if (isStudent.value && !enrollments.moduleIds.length) {
    try {
      await enrollments.fetchMine({ services, force: true })
    } catch {
      // ignore
    }
  }

  if (isStudent.value && !isStudentAllowedModule.value) {
    contentsStatus.value = 'error'
    contentsError.value = 'Modul ini tidak termasuk enrollment kamu.'
    return
  }

  resetSessionsState()
  resetContentsState()
  hideEnrollMenu()
  hideContentsMenu()
  closeMediaPreview()
  resetScheduleState()
  resetReminderState()
  isEditingEnrollKey.value = false
  deleteModuleOpen.value = false
  moduleActionLoading.value = ''
  feedback.value = { type: '', message: '' }
  await loadSessions()
  await ensureModuleBanner()
  await ensureEnrollKey()
})

async function ensureModuleBanner() {
  const m = moduleItem.value
  if (!m?.bannerDownloadUrl) return
  await banners.ensureBanner({ moduleId: moduleId.value, bannerPath: m.bannerDownloadUrl, services })
}

async function ensureEnrollKey() {
  if (!showEnrollKey.value) {
    enrollKey.value = ''
    return
  }

  const m = moduleItem.value
  if (m?.enrollKey) {
    enrollKey.value = m.enrollKey
    enrollKeyDraft.value = m.enrollKey
    return
  }

  try {
    const res = await services.modules.getById(moduleId.value)
    const data = res?.data || res
    if (data?.enroll_key) {
      enrollKey.value = data.enroll_key
      enrollKeyDraft.value = data.enroll_key
    }
  } catch {
    // ignore
  }
}

function showFeedback(type, message) {
  feedback.value = { type, message }
  window.setTimeout(() => {
    if (feedback.value.message === message) {
      feedback.value = { type: '', message: '' }
    }
  }, 3000)
}

function toggleEnrollMenu() {
  toggleEnrollMenuInternal()
}

function onDocumentClick(event) {
  onEnrollMenuDocumentClick(event)
  onContentsMenuDocumentClick(event)
}

function onDocumentKeydown(event) {
  if (event.key !== 'Escape') return
  hideEnrollMenu()
  hideContentsMenu()
  closeContentActions()
  closeMediaPreview()
  closeScheduleModal()
  isEditingEnrollKey.value = false
}

function onViewportChange() {
  onEnrollMenuViewportChange()
  onContentsMenuViewportChange()
}

function onSessionRenamed(payload) {
  const sessionId = payload?.sessionId
  const title = String(payload?.title || '').trim()
  if (!sessionId || !title) return

  sessions.value = sessions.value.map((s) => {
    if (s.id !== sessionId) return s
    return { ...s, title }
  })
}


function startEditEnrollKey() {
  enrollKeyDraft.value = enrollKey.value || ''
  isEditingEnrollKey.value = true
  hideEnrollMenu()
}

function cancelEnrollKeyEdit() {
  enrollKeyDraft.value = enrollKey.value || ''
  isEditingEnrollKey.value = false
}

async function saveEnrollKey() {
  if (!enrollKeyDraft.value.trim()) {
    showFeedback('error', 'Enroll key wajib diisi.')
    return
  }

  moduleActionLoading.value = 'saving'
  try {
    const res = await services.modules.update(moduleId.value, {
      name: moduleItem.value?.title || moduleTitle.value,
      description: moduleItem.value?.desc || '',
      enrollKey: enrollKeyDraft.value.trim(),
    })
    const data = res?.data || res

    if (res?.success === false) {
      throw new Error(res?.message || 'Gagal menyimpan enroll key')
    }

    enrollKey.value = data?.enroll_key || enrollKeyDraft.value.trim()
    enrollKeyDraft.value = enrollKey.value
    isEditingEnrollKey.value = false
    await modules.fetchAll({ services, force: true })
    showFeedback('success', res?.message || 'Enroll key berhasil disimpan.')
  } catch (e) {
    showFeedback('error', e?.message || 'Gagal menyimpan enroll key')
  } finally {
    moduleActionLoading.value = ''
  }
}

async function regenerateEnrollKey() {
  hideEnrollMenu()
  moduleActionLoading.value = 'regenerating'
  try {
    const res = await services.modules.regenerateEnrollKey(moduleId.value)
    const data = res?.data || res

    if (res?.success === false) {
      throw new Error(res?.message || 'Gagal regenerate enroll key')
    }

    enrollKey.value = data?.enroll_key || enrollKey.value
    enrollKeyDraft.value = enrollKey.value
    await modules.fetchAll({ services, force: true })
    showFeedback('success', res?.message || 'Enroll key berhasil digenerate ulang.')
  } catch (e) {
    showFeedback('error', e?.message || 'Gagal regenerate enroll key')
  } finally {
    moduleActionLoading.value = ''
  }
}

function openDeleteModuleConfirm() {
  hideEnrollMenu()
  deleteModuleOpen.value = true
}

function closeDeleteModule() {
  deleteModuleOpen.value = false
}

async function confirmDeleteModule() {
  moduleActionLoading.value = 'deleting'
  try {
    const res = await services.modules.delete(moduleId.value)
    if (res?.success === false) {
      throw new Error(res?.message || 'Gagal menghapus module')
    }
    showFeedback('success', res?.message || 'Module berhasil dihapus.')
    await modules.fetchAll({ services, force: true })
    deleteModuleOpen.value = false
    router.push('/courses')
  } catch (e) {
    showFeedback('error', e?.message || 'Gagal menghapus module')
  } finally {
    moduleActionLoading.value = ''
  }
}


watch(selectedSessionId, async () => {
  if (!selectedSessionId.value) return
  hideContentsMenu()
  closeContentActions()
  closeContentModal()
  closeDeleteContent()
  closeMediaPreview()
  await loadSchedule(selectedSessionId.value)
  await loadReminder()

  if (isLockedForStudent()) {
    setLockedState()
    return
  }

  await loadContents()
})

async function openMediaPreview(content, kind) {
  await openMediaPreviewInternal({
    content,
    kind,
    moduleId: moduleId.value,
    sessionId: selectedSessionId.value,
    downloadContentFile: services.sessions.downloadContentFile.bind(services.sessions),
  })
}

</script>
