<template>
  <!-- Breadcrumb -->
  <div class="sticky top-0 inset-x-0 z-20 bg-white border-y px-4 sm:px-6 lg:px-8 lg:hidden">
    <div class="flex items-center py-2">
      <!-- Navigation Toggle -->
      <button type="button"
        class="size-10 flex justify-center items-center gap-x-2 border border-gray-200 text-gray-800 hover:text-gray-500 rounded-lg focus:outline-none focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none"
        aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-application-sidebar"
        aria-label="Toggle navigation" data-hs-overlay="#hs-application-sidebar">
        <span class="sr-only">Toggle Navigation</span>
        <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M15 3v18" />
          <path d="m8 9 3 3-3 3" />
        </svg>
      </button>
      <!-- End Navigation Toggle -->

      <!-- Breadcrumb -->
      <ol class="ms-3 flex items-center whitespace-nowrap">
        <li class="flex items-center text-sm text-gray-800">
          Aplikasi
          <svg class="shrink-0 mx-3 overflow-visible size-2.5 text-gray-400 " width="16" height="16" viewBox="0 0 16 16"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" />
          </svg>
        </li>
        <li class="text-sm font-semibold text-gray-800 truncate" aria-current="page">
          Dashboard
        </li>
      </ol>
      <!-- End Breadcrumb -->
    </div>
  </div>
  <!-- End Breadcrumb -->

  <div class="w-full lg:ps-64">
    <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
      
      <!-- Welcome Section -->
      <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold">Selamat Datang, {{ userProfile?.username }}!</h1>
            <p class="text-blue-100 mt-1">Kelola pengajuan surat Anda dengan mudah</p>
          </div>
          <div class="hidden sm:block">
            <svg class="w-16 h-16 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Quick Stats Cards -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <!-- Total Surat Diajukan -->
        <div class="flex flex-col bg-white border shadow-sm rounded-xl">
          <div class="p-4 md:p-5">
            <div class="flex items-center gap-x-2">
              <div class="flex items-center gap-x-2">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <p class="text-xs uppercase tracking-wide text-gray-500">
                  Total Pengajuan
                </p>
              </div>
            </div>
            <div class="mt-1 flex items-center gap-x-2">
              <h3 class="text-xl sm:text-2xl font-medium text-gray-800">
                {{ userStats?.totalApplications || 0 }}
              </h3>
              <span class="text-xs text-gray-500">surat</span>
            </div>
          </div>
        </div>

        <!-- Bulan Ini -->
        <div class="flex flex-col bg-white border shadow-sm rounded-xl">
          <div class="p-4 md:p-5">
            <div class="flex items-center gap-x-2">
              <div class="flex items-center gap-x-2">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <p class="text-xs uppercase tracking-wide text-gray-500">
                  Bulan Ini
                </p>
              </div>
            </div>
            <div class="mt-1 flex items-center gap-x-2">
              <h3 class="text-xl sm:text-2xl font-medium text-gray-800">
                {{ userStats?.thisMonth || 0 }}
              </h3>
              <span class="text-xs text-gray-500">surat</span>
            </div>
          </div>
        </div>

        <!-- Pengajuan Terakhir -->
        <div class="flex flex-col bg-white border shadow-sm rounded-xl">
          <div class="p-4 md:p-5">
            <div class="flex items-center gap-x-2">
              <div class="flex items-center gap-x-2">
                <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <p class="text-xs uppercase tracking-wide text-gray-500">
                  Terakhir
                </p>
              </div>
            </div>
            <div class="mt-1 flex items-center gap-x-2">
              <h3 class="text-sm font-medium text-gray-800">
                {{ userStats?.lastApplication?.date || 'Belum ada' }}
              </h3>
            </div>
            <div class="text-xs text-gray-500 mt-1">
              {{ userStats?.lastApplication?.type || '-' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Recent Applications -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        <!-- Quick Actions -->
        <div class="lg:col-span-1">
          <div class="bg-white border shadow-sm rounded-xl p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Aksi Cepat</h3>
            <div class="space-y-3">
              <nuxt-link to="/applicationletter/add" 
                class="w-full flex items-center gap-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors group">
                <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-800 group-hover:text-blue-600">Ajukan Surat Baru</p>
                  <p class="text-sm text-gray-500">Buat pengajuan surat</p>
                </div>
              </nuxt-link>

              <nuxt-link to="/applicationletter" 
                class="w-full flex items-center gap-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors group">
                <div class="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-800 group-hover:text-gray-600">Riwayat Pengajuan</p>
                  <p class="text-sm text-gray-500">Lihat semua pengajuan</p>
                </div>
              </nuxt-link>


            </div>
          </div>
        </div>

        <!-- Recent Applications -->
        <div class="lg:col-span-2">
          <div class="bg-white border shadow-sm rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-800">Pengajuan Terbaru</h3>
              <nuxt-link to="/applicationletter/history" class="text-sm text-blue-600 hover:text-blue-700">
                Lihat Semua
              </nuxt-link>
            </div>
            
            <div class="space-y-3" v-if="recentApplications && recentApplications.length > 0">
              <div v-for="application in recentApplications" :key="application.id" 
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-x-3">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">{{ formatLetterType(application.category_letter) }}</p>
                    <p class="text-sm text-gray-500">{{ formatDate(application.create_at) }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Terkirim
                  </span>
                  <p class="text-xs text-gray-500 mt-1">{{ application.toEmail }}</p>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8">
              <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <p class="text-gray-500">Belum ada pengajuan surat</p>
              <nuxt-link to="/applicationletter/create" class="text-blue-600 hover:text-blue-700 text-sm">
                Buat pengajuan pertama
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div class="bg-white border shadow-sm rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Pengumuman & Informasi</h3>
          <!-- <nuxt-link to="/notifications" class="text-sm text-blue-600 hover:text-blue-700">
            Lihat Semua
          </nuxt-link> -->
        </div>
        
        <div class="space-y-3" v-if="notifications && notifications.length > 0">
          <div v-for="notification in notifications" :key="notification.id" 
            class="flex items-start gap-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1">
              <h4 class="font-medium text-gray-800">{{ notification.title }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ notification.description }}</p>
              <p class="text-xs text-gray-500 mt-2">{{ formatDate(notification.date) }}</p>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 6h16l-4 4H4zM4 14h9"/>
          </svg>
          <p class="text-gray-500">Tidak ada pengumuman terbaru</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
interface UserProfile {
  id: number;
  username: string;
  email: string;
}

interface UserStats {
  totalApplications: number;
  thisMonth: number;
  lastApplication?: {
    date: string;
    type: string;
  };
}

interface ApplicationLetter {
  id: number;
  category_letter: string;
  toEmail: string;
  create_at: string;
}

interface Notification {
  id: number;
  title: string;
  description: string;
  date: string;
}

// Reactive data
const userProfile = ref<UserProfile | null>(null);
const userStats = ref<UserStats | null>(null);
const recentApplications = ref<ApplicationLetter[]>([]);
const notifications = ref<Notification[]>([]);

// Format letter type from enum to readable text
const formatLetterType = (categoryLetter: string): string => {
  const letterTypes: { [key: string]: string } = {
    'SuratPengantarKTP': 'Surat Pengantar KTP',
    'SuratKeteranganDomisili': 'Surat Keterangan Domisili',
    'SuratKeteranganUsaha': 'Surat Keterangan Usaha',
    'SuratPengantarNikah': 'Surat Pengantar Nikah',
    'SuratKeteranganTidakMampu': 'Surat Keterangan Tidak Mampu'
  };
  return letterTypes[categoryLetter] || categoryLetter;
};

// Format date to readable format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Fetch user profile
const fetchUserProfile = async () => {
  try {
    const response: any = await useFetchApi('/api/auth/user');
    userProfile.value = response?.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
};

// Fetch user statistics
const fetchUserStats = async () => {
  try {
    const response: any = await useFetchApi('/api/auth/user/stats');
    userStats.value = response?.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
  }
};

// Fetch recent applications (limit 5)
const fetchRecentApplications = async () => {
  try {
    const response: any = await useFetchApi('/api/auth/application-letter?page=1&pagesize=5');
    recentApplications.value = response?.data || [];
  } catch (error) {
    console.error('Error fetching recent applications:', error);
  }
};

// Fetch notifications (limit 3)
const fetchNotifications = async () => {
  try {
    const response: any = await useFetchApi('/api/auth/notifications?page=1&pagesize=3');
    notifications.value = response?.data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

// Load all data when component mounts
onMounted(() => {
  fetchUserProfile();
  fetchUserStats();
  fetchRecentApplications();
  fetchNotifications();
});
</script>

<style scoped>
/* Additional custom styles if needed */
</style>