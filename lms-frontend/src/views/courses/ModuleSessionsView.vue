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
        <article class="ink-card overflow-hidden">
          <div class="flex items-center justify-between gap-4 px-6 pt-6">
            <h2 class="text-lg font-semibold">Materi</h2>

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
                Dibuka:
                <span class="font-extrabold text-ink/80">{{ scheduleLabel }}</span>
              </p>
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
                      class="absolute right-0 top-10 z-10 w-44 rounded-2xl border-2 border-ink bg-paper p-2 shadow-ink"
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
import { createServices } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useModulesStore } from '@/stores/modules'
import { useModuleBannersStore } from '@/stores/moduleBanners'
import SessionItem from '@/components/sessions/SessionItem.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const services = createServices()

const auth = useAuthStore()

const modules = useModulesStore()
const banners = useModuleBannersStore()

const moduleId = computed(() => Number(route.params.moduleId))
const preselectSessionId = computed(() => {
  const raw = route.query.sessionId
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : null
})

const sessions = ref([])
const sessionsStatus = ref('idle')
const sessionsError = ref('')

const selectedSessionId = ref(null)

const showTips = ref(true)

const canManageSessions = computed(() => {
  const r = auth.user?.role
  return r === 'teacher' || r === 'admin'
})

const editOpen = ref(false)
const editSession = ref(null)

const deleteOpen = ref(false)
const deleteSession = ref(null)
const deleteLoading = ref(false)

const createSessionOpen = ref(false)
const createSessionLoading = ref(false)
const createSessionError = ref('')
const createSessionTitle = ref('')
const createSessionOpenAtLocal = ref('')

const menuOpen = ref(false)
const menuRef = ref(null)
const menuButtonRef = ref(null)
const menuStyle = ref({})
const isEditingEnrollKey = ref(false)
const enrollKeyDraft = ref('')
const deleteModuleOpen = ref(false)
const moduleActionLoading = ref('')
const feedback = ref({ type: '', message: '' })

const contents = ref([])
const contentsStatus = ref('idle')
const contentsError = ref('')

const downloadStatusById = ref({})

const fileViewStatusById = ref({})
const fileViewErrorById = ref({})

const contentsMenuOpen = ref(false)
const contentsMenuRef = ref(null)
const contentsMenuButtonRef = ref(null)
const contentsMenuStyle = ref({})

const contentActionsOpenId = ref(null)

const contentModalOpen = ref(false)
const contentModalMode = ref('add')
const contentModalLoading = ref(false)
const contentModalError = ref('')
const editingContentId = ref(null)
const editingContentOriginalType = ref('')
const editingContentOriginalTitle = ref('')
const editingContentOriginalUrl = ref('')
const editingContentOriginalText = ref('')
const editingContentOriginalFileName = ref('')

const contentType = ref('url')
const contentTitle = ref('')
const contentUrl = ref('')
const contentText = ref('')
const contentFile = ref(null)
const contentFileInputRef = ref(null)

const deleteContentOpen = ref(false)
const deleteContentItem = ref(null)
const deleteContentLoading = ref(false)

const mediaPreviewOpen = ref(false)
const mediaPreviewStatus = ref('idle')
const mediaPreviewError = ref('')
const mediaPreviewUrl = ref('')
const mediaPreviewKind = ref('image')
const mediaPreviewContent = ref(null)

const contentFileName = computed(() => contentFile.value?.name || '')

const contentFileLabel = computed(() => {
  // kalau user pilih file baru
  if (contentFileName.value) return contentFileName.value

  // kalau bukan edit mode
  if (contentModalMode.value !== 'edit') return 'Belum ada file'

  const cur =
    String(editingContentOriginalFileName.value || '').trim() ||
    String(editingContentOriginalTitle.value || '').trim()

  // if (!cur) return 'Current file: (tersimpan)'

  // return `Current file: ${cur}`
})

function looksLikeFileName(name) {
  return name.includes('.') && !name.endsWith('.')
}

const moduleItem = computed(() => modules.items.find((m) => Number(m.id) === moduleId.value))

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

const selectedSession = computed(() => sessions.value.find((s) => s.id === selectedSessionId.value) || null)
const selectedSessionTitle = computed(() => selectedSession.value?.title || 'Pilih sesi')
const selectedSessionDesc = computed(() => selectedSession.value?.description || ' ')

const isStudent = computed(() => auth.user?.role === 'student')

const scheduleStatus = ref('idle')
const scheduleError = ref('')
const scheduleOpenAt = ref(null)

const scheduleOpen = ref(false)
const scheduleSaving = ref(false)
const scheduleModalError = ref('')
const scheduleDraftLocal = ref('')

const scheduleHuman = computed(() => {
  if (!scheduleOpenAt.value) return ''
  const d = new Date(scheduleOpenAt.value)
  if (Number.isNaN(d.getTime())) return ''
  try {
    return d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return d.toLocaleString()
  }
})

const scheduleLabel = computed(() => {
  if (!selectedSessionId.value) return '-'
  if (scheduleStatus.value === 'loading') return 'memuat...'
  if (scheduleError.value) return 'gagal memuat'
  if (!scheduleOpenAt.value) return 'belum dibuka'
  return scheduleHuman.value || scheduleOpenAt.value
})

const deleteModuleMessage = computed(() => {
  return `Kamu yakin mau menghapus modul ${moduleTitle.value}? Tindakan ini tidak bisa dibatalkan.`
})

onMounted(async () => {
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
  selectedSessionId.value = null
  contents.value = []
  contentsStatus.value = 'idle'
  hideEnrollMenu()
  hideContentsMenu()
  closeContentActions()
  closeContentModal()
  closeDeleteContent()
  closeMediaPreview()
  closeCreateSession()
  closeScheduleModal()
  scheduleStatus.value = 'idle'
  scheduleError.value = ''
  scheduleOpenAt.value = null
  isEditingEnrollKey.value = false
  deleteModuleOpen.value = false
  moduleActionLoading.value = ''
  feedback.value = { type: '', message: '' }
  fileViewStatusById.value = {}
  fileViewErrorById.value = {}
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
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) {
    updateMenuPosition()
  }
}

function hideEnrollMenu() {
  menuOpen.value = false
}

function onDocumentClick(event) {
  // Enroll key menu
  if (menuOpen.value && menuRef.value) {
    if (!menuRef.value.contains(event.target) && !menuButtonRef.value?.contains(event.target)) {
      hideEnrollMenu()
    }
  }

  // Materi menu
  if (contentsMenuOpen.value && contentsMenuRef.value) {
    if (!contentsMenuRef.value.contains(event.target) && !contentsMenuButtonRef.value?.contains(event.target)) {
      hideContentsMenu()
    }
  }
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
  if (menuOpen.value) updateMenuPosition()
  if (contentsMenuOpen.value) updateContentsMenuPosition()
}

function toggleContentsMenu() {
  contentsMenuOpen.value = !contentsMenuOpen.value
  if (contentsMenuOpen.value) updateContentsMenuPosition()
}

function hideContentsMenu() {
  contentsMenuOpen.value = false
}

function updateContentsMenuPosition() {
  if (!contentsMenuButtonRef.value) return

  const rect = contentsMenuButtonRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const margin = 8
  const preferredWidth = 200
  const width = Math.min(preferredWidth, Math.max(160, viewportWidth - margin * 2))
  const estimatedHeight = 96

  let left = rect.right - width
  left = Math.max(margin, Math.min(left, viewportWidth - width - margin))

  let top = rect.bottom + 8
  if (top + estimatedHeight > viewportHeight - margin) {
    top = Math.max(margin, rect.top - estimatedHeight - 8)
  }

  contentsMenuStyle.value = {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
  }
}

function toggleContentActions(contentId) {
  if (contentActionsOpenId.value === contentId) {
    closeContentActions()
    return
  }

  contentActionsOpenId.value = contentId
  setTimeout(() => {
    document.addEventListener(
      'click',
      () => {
        closeContentActions()
      },
      { once: true }
    )
  }, 0)
}

function closeContentActions() {
  contentActionsOpenId.value = null
}

function onPickContentFile(e) {
  const f = e?.target?.files?.[0]
  contentFile.value = f || null
}

function triggerContentFilePicker() {
  contentFileInputRef.value?.click?.()
}

function openAddContent() {
  if (!selectedSessionId.value) return
  hideContentsMenu()
  closeContentActions()
  contentModalMode.value = 'add'
  contentModalError.value = ''
  contentModalLoading.value = false
  editingContentId.value = null
  editingContentOriginalType.value = ''
  editingContentOriginalTitle.value = ''
  editingContentOriginalUrl.value = ''
  editingContentOriginalText.value = ''
  editingContentOriginalFileName.value = ''
  contentType.value = 'url'
  contentTitle.value = ''
  contentUrl.value = ''
  contentText.value = ''
  contentFile.value = null
  contentModalOpen.value = true
}

function openEditContent(c) {
  hideContentsMenu()
  closeContentActions()
  contentModalMode.value = 'edit'
  contentModalError.value = ''
  contentModalLoading.value = false
  editingContentId.value = c?.id || null
  editingContentOriginalType.value = c?.type || 'text'
  editingContentOriginalTitle.value = c?.title || ''
  editingContentOriginalUrl.value = c?.url || ''
  editingContentOriginalText.value = c?.text || ''
  editingContentOriginalFileName.value = c?.fileName || ''

  contentType.value = editingContentOriginalType.value
  contentTitle.value = editingContentOriginalTitle.value
  contentUrl.value = editingContentOriginalUrl.value
  contentText.value = editingContentOriginalText.value
  contentFile.value = null
  contentModalOpen.value = true
}

function closeContentModal() {
  contentModalOpen.value = false
  contentModalLoading.value = false
  contentModalError.value = ''
  editingContentId.value = null
  editingContentOriginalType.value = ''
  editingContentOriginalTitle.value = ''
  editingContentOriginalUrl.value = ''
  editingContentOriginalText.value = ''
  editingContentOriginalFileName.value = ''
}

async function saveContent() {
  if (!selectedSessionId.value) return

  contentModalError.value = ''

  const nextType = contentType.value
  const isEdit = contentModalMode.value === 'edit'
  const originalType = editingContentOriginalType.value

  if (nextType === 'url' && !contentUrl.value.trim()) {
    contentModalError.value = 'URL wajib diisi.'
    return
  }
  if (nextType === 'text' && !contentText.value.trim()) {
    contentModalError.value = 'Isi materi wajib diisi.'
    return
  }
  if (nextType === 'file') {
    const needsFile = !isEdit || originalType !== 'file'
    if (needsFile && !contentFile.value) {
      contentModalError.value = 'File wajib dipilih.'
      return
    }
  }

  contentModalLoading.value = true
  try {
    if (contentModalMode.value === 'add') {
      await services.sessions.addContent(moduleId.value, selectedSessionId.value, {
        content_type: nextType,
        title: contentTitle.value,
        url: nextType === 'url' ? contentUrl.value.trim() : undefined,
        file: nextType === 'file' ? contentFile.value : undefined,
        text_content: contentText.value.trim() || undefined,
      })
    } else {
      if (!editingContentId.value) throw new Error('Konten tidak valid')

      const payload = {}

      const isTypeChanged = Boolean(originalType) && nextType !== originalType
      const isReplacingFile = nextType === 'file' && Boolean(contentFile.value)
      if (isTypeChanged || isReplacingFile) payload.content_type = nextType

      const nextTitle = contentTitle.value
      if (nextTitle.trim() || editingContentOriginalTitle.value) payload.title = nextTitle

      if (nextType === 'url') {
        payload.url = contentUrl.value.trim()
        payload.text_content = contentText.value.trim()
      } else if (nextType === 'text') {
        payload.text_content = contentText.value
      } else {
        payload.text_content = contentText.value
      }

      if (nextType === 'file' && contentFile.value) {
        payload.file = contentFile.value
      }

      await services.sessions.updateContent(moduleId.value, selectedSessionId.value, editingContentId.value, payload)
    }

    await loadContents(selectedSessionId.value)
    closeContentModal()
  } catch (e) {
    contentModalError.value = e?.message || 'Gagal menyimpan materi'
  } finally {
    contentModalLoading.value = false
  }
}

const deleteContentMessage = computed(() => {
  const t = deleteContentItem.value?.title || 'materi ini'
  return `Kamu yakin mau menghapus ${t}? Tindakan ini tidak bisa dibatalkan.`
})

function openDeleteContent(c) {
  hideContentsMenu()
  closeContentActions()
  deleteContentItem.value = c
  deleteContentOpen.value = true
}

function closeDeleteContent() {
  deleteContentOpen.value = false
  deleteContentItem.value = null
  deleteContentLoading.value = false
}

async function confirmDeleteContent() {
  if (!deleteContentItem.value?.id || !selectedSessionId.value) return
  deleteContentLoading.value = true
  try {
    await services.sessions.deleteContent(moduleId.value, selectedSessionId.value, deleteContentItem.value.id)
    await loadContents(selectedSessionId.value)
  } catch (e) {
    contentsError.value = e?.message || 'Gagal menghapus materi'
  } finally {
    closeDeleteContent()
  }
}

function updateMenuPosition() {
  if (!menuButtonRef.value) return

  const rect = menuButtonRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const margin = 8
  const preferredWidth = 176
  const width = Math.min(preferredWidth, Math.max(140, viewportWidth - margin * 2))
  const estimatedHeight = 156

  let left = rect.right - width
  left = Math.max(margin, Math.min(left, viewportWidth - width - margin))

  let top = rect.bottom + 8
  if (top + estimatedHeight > viewportHeight - margin) {
    top = Math.max(margin, rect.top - estimatedHeight - 8)
  }

  menuStyle.value = {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
  }
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

async function loadSessions() {
  sessionsStatus.value = 'loading'
  sessionsError.value = ''
  try {
    const res = await services.sessions.list(moduleId.value)
    const list = normalizeListResponse(res)
    sessions.value = list
      .map(mapSession)
      .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999))

    sessionsStatus.value = 'success'

    const wanted = preselectSessionId.value
    if (wanted && sessions.value.some((s) => s.id === wanted)) {
      selectSession(wanted)
      return
    }

    if (!selectedSessionId.value && sessions.value.length) {
      selectSession(sessions.value[0].id)
    }
  } catch (e) {
    sessionsStatus.value = 'error'
    sessionsError.value = e?.message || 'Gagal memuat sesi'
  }
}

function selectSession(id) {
  selectedSessionId.value = id
}

function openCreateSession() {
  createSessionError.value = ''
  createSessionTitle.value = ''
  createSessionOpenAtLocal.value = ''
  createSessionOpen.value = true
}

function closeCreateSession() {
  createSessionOpen.value = false
  createSessionLoading.value = false
  createSessionError.value = ''
}

async function createSession() {
  if (!canManageSessions.value) return
  createSessionError.value = ''

  if (!createSessionTitle.value.trim()) {
    createSessionError.value = 'Judul sesi wajib diisi.'
    return
  }

  createSessionLoading.value = true
  try {
    const res = await services.sessions.create(moduleId.value, { title: createSessionTitle.value.trim() })
    const newId = res?.data?.id || res?.id || null

    if (createSessionOpenAtLocal.value && newId) {
      const d = new Date(createSessionOpenAtLocal.value)
      if (Number.isNaN(d.getTime())) throw new Error('Format open_at tidak valid. Gunakan format tanggal ISO-8601')
      await services.sessions.setSchedule(moduleId.value, newId, { open_at: d.toISOString() })
    }

    await loadSessions()
    if (newId) selectSession(newId)
    closeCreateSession()
  } catch (e) {
    createSessionError.value = e?.message || 'Gagal membuat sesi'
  } finally {
    createSessionLoading.value = false
  }
}

function openEdit(s) {
  editSession.value = s
  editOpen.value = true
}

function closeEdit() {
  editOpen.value = false
  editSession.value = null
}

async function onSessionSaved() {
  // refresh list + current contents
  await loadSessions()
  if (selectedSessionId.value) await loadContents(selectedSessionId.value)
  closeEdit()
}

const deleteMessage = computed(() => {
  const t = deleteSession.value?.title || 'sesi ini'
  return `Kamu yakin mau menghapus ${t}? Tindakan ini tidak bisa dibatalkan.`
})

function openDelete(s) {
  deleteSession.value = s
  deleteOpen.value = true
}

function closeDelete() {
  deleteOpen.value = false
  deleteSession.value = null
  deleteLoading.value = false
}

async function confirmDelete() {
  if (!deleteSession.value?.id) return
  deleteLoading.value = true
  try {
    await services.sessions.delete(moduleId.value, deleteSession.value.id)
    // Refresh sessions list
    await loadSessions()
    // Ensure selection is valid
    if (selectedSessionId.value === deleteSession.value.id) {
      selectedSessionId.value = sessions.value[0]?.id || null
    }
  } catch (e) {
    // surface error in main content area
    contentsError.value = e?.message || 'Gagal menghapus sesi'
  } finally {
    closeDelete()
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

  const openAt = scheduleOpenAt.value ? new Date(scheduleOpenAt.value) : null
  const isLocked =
    isStudent.value &&
    (!scheduleOpenAt.value || (openAt && !Number.isNaN(openAt.getTime()) && openAt.getTime() > Date.now()))
  if (isLocked) {
    contents.value = []
    contentsError.value = ''
    contentsStatus.value = 'locked'
    return
  }

  await loadContents(selectedSessionId.value)
})

async function reloadSelectedContents() {
  if (!selectedSessionId.value) return
  // Respect schedule lock for students.
  const openAt = scheduleOpenAt.value ? new Date(scheduleOpenAt.value) : null
  const isLocked =
    isStudent.value &&
    (!scheduleOpenAt.value || (openAt && !Number.isNaN(openAt.getTime()) && openAt.getTime() > Date.now()))
  if (isLocked) {
    contents.value = []
    contentsError.value = ''
    contentsStatus.value = 'locked'
    return
  }
  await loadContents(selectedSessionId.value)
}

async function loadSchedule(sessionId) {
  scheduleStatus.value = 'loading'
  scheduleError.value = ''
  scheduleOpenAt.value = null

  try {
    const res = await services.sessions.getSchedule(moduleId.value, sessionId)
    const openAt = res?.data?.open_at || res?.data?.openAt || res?.open_at || res?.openAt || null

    if (openAt) {
      const d = new Date(openAt)
      if (!Number.isNaN(d.getTime())) {
        scheduleOpenAt.value = d.toISOString()
      }
    }

    scheduleStatus.value = 'success'
  } catch (e) {
    scheduleStatus.value = 'error'
    scheduleError.value = e?.message || 'Gagal memuat jadwal'
  }
}

function openScheduleModal() {
  scheduleModalError.value = ''
  scheduleDraftLocal.value = isoToLocalInput(scheduleOpenAt.value)
  scheduleOpen.value = true
}

async function openScheduleForSession(sessionId) {
  if (!canManageSessions.value) return
  if (!sessionId) return

  if (selectedSessionId.value !== sessionId) {
    selectedSessionId.value = sessionId
  }

  await loadSchedule(sessionId)
  openScheduleModal()
}

function closeScheduleModal() {
  scheduleOpen.value = false
  scheduleSaving.value = false
  scheduleModalError.value = ''
}

async function saveSchedule() {
  if (!canManageSessions.value || !selectedSessionId.value) return

  scheduleSaving.value = true
  scheduleModalError.value = ''
  try {
    let iso = null
    if (scheduleDraftLocal.value) {
      const d = new Date(scheduleDraftLocal.value)
      if (Number.isNaN(d.getTime())) throw new Error('Format open_at tidak valid. Gunakan format tanggal ISO-8601')
      iso = d.toISOString()
    }

    await services.sessions.setSchedule(moduleId.value, selectedSessionId.value, { open_at: iso })
    await loadSchedule(selectedSessionId.value)

    // Refresh lock state after schedule changes.
    if (isStudent.value) {
      const openAt = scheduleOpenAt.value ? new Date(scheduleOpenAt.value) : null
      const isLocked =
        !scheduleOpenAt.value || (openAt && !Number.isNaN(openAt.getTime()) && openAt.getTime() > Date.now())
      if (isLocked) {
        contents.value = []
        contentsError.value = ''
        contentsStatus.value = 'locked'
      } else {
        await loadContents(selectedSessionId.value)
      }
    }

    closeScheduleModal()
  } catch (e) {
    scheduleModalError.value = e?.message || 'Gagal menyimpan jadwal'
  } finally {
    scheduleSaving.value = false
  }
}

async function clearSchedule() {
  scheduleDraftLocal.value = ''
  await saveSchedule()
}

function isoToLocalInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''

  const pad = (n) => String(n).padStart(2, '0')
  const yyyy = d.getFullYear()
  const mm = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const mi = pad(d.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}

async function loadContents(sessionId) {
  contentsStatus.value = 'loading'
  contentsError.value = ''
  try {
    const res = await services.sessions.listContents(moduleId.value, sessionId)
    const list = normalizeListResponse(res)
    contents.value = list.map(mapContent)
    contentsStatus.value = 'success'
    fileViewStatusById.value = {}
    fileViewErrorById.value = {}
  } catch (e) {
    contentsStatus.value = 'error'
    contentsError.value = e?.message || 'Gagal memuat konten'
  }
}

async function downloadFile(content) {
  const contentId = content?.id
  if (!contentId || !selectedSessionId.value) return

  downloadStatusById.value = { ...downloadStatusById.value, [contentId]: 'loading' }
  try {
    const blob = await services.sessions.downloadContentFile(moduleId.value, selectedSessionId.value, contentId)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = content.fileName || `content-${contentId}`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch (e) {
    contentsError.value = e?.message || 'Gagal download file'
  } finally {
    downloadStatusById.value = { ...downloadStatusById.value, [contentId]: 'idle' }
  }
}

async function viewFilePublic(content) {
  const contentId = content?.id
  if (!contentId || !selectedSessionId.value) return

  fileViewStatusById.value = { ...fileViewStatusById.value, [contentId]: 'loading' }
  fileViewErrorById.value = { ...fileViewErrorById.value, [contentId]: '' }

  try {
    const res = await services.sessions.createContentViewUrl(moduleId.value, selectedSessionId.value, contentId)
    const publicUrl = res?.data?.public_url || res?.data?.publicUrl || res?.public_url || res?.publicUrl || ''
    if (!publicUrl) throw new Error('URL view tidak tersedia')
    window.open(publicUrl, '_blank', 'noopener,noreferrer')
  } catch (e) {
    fileViewErrorById.value = { ...fileViewErrorById.value, [contentId]: e?.message || 'Gagal membuka berkas' }
  } finally {
    fileViewStatusById.value = { ...fileViewStatusById.value, [contentId]: 'idle' }
  }
}

async function viewFile(content) {
  const kind = mediaKindFromContent(content)
  if (content?.isMedia || kind) {
    await openMediaPreview(content, kind || 'image')
    return
  }

  // Prefer public view URL for non-media documents when supported.
  if (content?.shouldUsePublicViewUrl || content?.isPublicViewSupported) {
    await viewFilePublic(content)
    return
  }

  // Fallback: open the authenticated file endpoint in a new tab via blob URL.
  await viewFileAuthTab(content)
}

function mediaKindFromContent(content) {
  const k = String(content?.fileKind || '').toLowerCase()
  if (k === 'image') return 'image'
  if (k === 'video') return 'video'

  const mime = String(content?.mimeType || '').toLowerCase()
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime.startsWith('audio/')) return 'audio'

  return ''
}

async function viewFileAuthTab(content) {
  const contentId = content?.id
  if (!contentId || !selectedSessionId.value) return

  fileViewStatusById.value = { ...fileViewStatusById.value, [contentId]: 'loading' }
  fileViewErrorById.value = { ...fileViewErrorById.value, [contentId]: '' }

  try {
    const blob = await services.sessions.downloadContentFile(moduleId.value, selectedSessionId.value, contentId)
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener,noreferrer')
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  } catch (e) {
    fileViewErrorById.value = { ...fileViewErrorById.value, [contentId]: e?.message || 'Gagal membuka berkas' }
  } finally {
    fileViewStatusById.value = { ...fileViewStatusById.value, [contentId]: 'idle' }
  }
}

async function openMediaPreview(content, kind) {
  const contentId = content?.id
  if (!contentId || !selectedSessionId.value) return

  closeMediaPreview()
  mediaPreviewOpen.value = true
  mediaPreviewStatus.value = 'loading'
  mediaPreviewError.value = ''
  mediaPreviewKind.value = kind
  mediaPreviewContent.value = content

  try {
    const blob = await services.sessions.downloadContentFile(moduleId.value, selectedSessionId.value, contentId)
    const url = URL.createObjectURL(blob)
    mediaPreviewUrl.value = url
    mediaPreviewStatus.value = 'success'
  } catch (e) {
    mediaPreviewStatus.value = 'error'
    mediaPreviewError.value = e?.message || 'Gagal memuat media'
  }
}

function closeMediaPreview() {
  mediaPreviewOpen.value = false
  mediaPreviewStatus.value = 'idle'
  mediaPreviewError.value = ''
  mediaPreviewContent.value = null
  mediaPreviewKind.value = 'image'

  const url = mediaPreviewUrl.value
  mediaPreviewUrl.value = ''
  if (url) URL.revokeObjectURL(url)
}

function normalizeListResponse(res) {
  if (Array.isArray(res)) return res
  if (res && typeof res === 'object') {
    if (Array.isArray(res.data)) return res.data
    if (res.data && Array.isArray(res.data.sessions)) return res.data.sessions
    if (res.data && Array.isArray(res.data.contents)) return res.data.contents
  }
  return []
}

function mapSession(s) {
  return {
    id: s?.id,
    title: s?.title || `Sesi ${s?.sort_order || ''}`.trim(),
    description: s?.description || '',
    sortOrder: typeof s?.sort_order === 'number' ? s.sort_order : typeof s?.sortOrder === 'number' ? s.sortOrder : 999,
  }
}

function mapContent(c) {
  const type = c?.content_type || c?.type || 'text'
  const title = c?.title || (type === 'file' ? 'File' : type === 'url' ? 'Link' : 'Text')
  const typeLabel = type === 'file' ? 'Berkas' : type === 'url' ? 'Tautan' : 'Teks'

  return {
    id: c?.id,
    type,
    typeLabel,
    typeBadge: typeLabel,
    title,
    url: c?.url || '',
    text: c?.text_content || c?.text || '',
    fileName: c?.original_name || c?.file_name || c?.filename || c?.title || `content-${c?.id || ''}`,
    mimeType: c?.mime_type || c?.mimeType || '',
    fileDownloadUrl: c?.file_download_url || c?.fileDownloadUrl || null,
    fileKind: c?.file_kind || c?.fileKind || null,
    isMedia: Boolean(c?.is_media ?? c?.isMedia),
    isPublicViewSupported: Boolean(c?.is_public_view_supported ?? c?.isPublicViewSupported),
    shouldUsePublicViewUrl: Boolean(c?.should_use_public_view_url ?? c?.shouldUsePublicViewUrl),
  }
}
</script>
