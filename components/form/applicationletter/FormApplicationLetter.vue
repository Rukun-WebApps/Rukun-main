<template>
  <div class="p-4 md:p-5 h-fit max-h-full flex flex-col bg-white border shadow-sm rounded-xl space-y-4">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-medium text-gray-800 w-full">Pengajuan Surat</h2>
    </div>
    <!-- End Header -->

    <hr>

    <div class="h-full w-full mt-2">
      <form @submit.prevent="handleSubmit">
        <!-- Email -->
      <div class="space-y-4 flex flex-col">   
        <div class="grid sm:grid-cols-3">
          <label for="email" class="block text-sm font-medium mb-2 w-full">Email Tujuan</label>
          <div class="col-span-2">
            <input type="email" id="email"
                  v-model="email"
                  @input="handleEmailInput"
                  :class="getEmailInputClasses()"
                  placeholder="example@gmail.com">
            <small :class="getEmailMessageClasses()">{{ emailError }}</small>
          </div>
        </div>

        <!-- Nomer Induk Kependudukan -->
        <div class="grid sm:grid-cols-3">
          <label for="nik" class="block text-sm font-medium mb-2 w-full">NOMER INDUK KEPENDUDUKAN (NIK)</label>
          <div class="col-span-2">
            <div class="relative">
              <input type="text" id="nik"
                    v-model="nik"
                    @input="handleNIKInput"
                    maxlength="16"
                    :class="getNIKInputClasses()"
                    placeholder="1234567890123456">
              <!-- Success icon untuk NIK -->
              <div v-if="nikStatus === 'success'" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg class="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            
            <!-- Progress dan pesan NIK -->
            <div class="mt-1 flex justify-between items-center">
              <small :class="getNIKMessageClasses()">{{ formatNIKMessage() }}</small>
              <small class="text-gray-400">{{ nikProgress }}/16</small>
            </div>
          </div>
        </div>
          <!-- Jenis Surat -->
          <div class="grid sm:grid-cols-3">
            <label for="letter" class="block text-sm font-medium mb-2 w-full">JENIS SURAT</label>
            <select id="letter"
                    v-model="letter"
                    class="col-span-2 py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
              <option value="SuratPengantarKTP">Surat Pengantar KTP</option>
              <option value="SuratKeteranganDomisili">Surat Keterangan Domisili</option>
              <option value="SuratKeteranganUsaha">Surat Keterangan Usaha</option>
              <option value="SuratPengantarNikah">Surat Pengantar Nikah</option>
              <option value="SuratKeteranganTidakMampu">SuratKeteranganTidakMampu</option>
            </select>
          </div>

          <!-- Submit Button -->
          <div class="space-x-3 self-end">
            <button type="button" @click="handleCancel"
                 class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-red-600 bg-transparent text-red-600 hover:bg-red-200 focus:outline-none focus:bg-red-700 disabled:opacity-50 disabled:pointer-events-none">
                 Batal
            </button>
            <button type="submit"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    :disabled="isLoading">
              <!-- Loading spinner -->
              <svg v-if="isLoading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              
              <!-- Text berubah saat loading -->
              {{ isLoading ? 'Mengirim...' : 'Simpan' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import useFetchApi from '~/composables/useFetchApi';
import { useRouter } from "vue-router";

const router = useRouter();
const { $toast } = useNuxtApp();
const email = ref<string | null>(null);
const nik = ref<string | null>(null);
const letter = ref<string | null>(null);
const isLoading = ref<boolean>(false);
const emailError = ref<string | null>(null);
const nikError = ref<string | null>(null);
const emailStatus = ref('neutral'); // 'neutral', 'error', 'success'
const nikStatus = ref('neutral'); // 'neutral', 'warning', 'success', 'error'
const nikProgress = ref(0);

// Update clearForm
const clearForm = () => {
  email.value = null;
  letter.value = null;
  nik.value = null;
  emailError.value = null;
  nikError.value = null;
  emailStatus.value = 'neutral';
  nikStatus.value = 'neutral';
  nikProgress.value = 0;
};

// Email validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handleEmailInput = () => {
  emailError.value = null;
  
  if (!email.value) {
    emailStatus.value = 'neutral';
  } else if (!validateEmail(email.value)) {
    emailError.value = 'Format email tidak valid';
    emailStatus.value = 'error';
  } else {
    emailStatus.value = 'success';
  }
};

// NIK validation
const handleNIKInput = (event: Event) => {
  const input = (event.target as HTMLInputElement).value.replace(/\D/g, '');
  nik.value = input.slice(0, 16);
  
  // Update progress
  nikProgress.value = nik.value?.length || 0;
  
  // Reset error state
  nikError.value = null;
  
  // Update status
  if (!nik.value || nik.value.length === 0) {
    nikStatus.value = 'neutral';
  } else if (nik.value.length < 16) {
    nikStatus.value = 'warning';
  } else if (nik.value.length === 16) {
    nikStatus.value = 'success';
  }
};

// CSS classes methods
const getEmailInputClasses = () => {
  const baseClasses = "py-3 px-4 block w-full rounded-lg text-sm focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none";
  
  switch (emailStatus.value) {
    case 'success':
      return `${baseClasses} border-green-300 focus:border-green-500`;
    case 'error':
      return `${baseClasses} border-red-300 focus:border-red-500`;
    default:
      return `${baseClasses} border-gray-200 focus:border-blue-500`;
  }
};

const getNIKInputClasses = () => {
  const baseClasses = "py-3 px-4 block w-full rounded-lg text-sm focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none";
  
  switch (nikStatus.value) {
    case 'warning':
      return `${baseClasses} border-yellow-300 focus:border-yellow-500`;
    case 'success':
      return `${baseClasses} border-green-300 focus:border-green-500`;
    case 'error':
      return `${baseClasses} border-red-300 focus:border-red-500`;
    default:
      return `${baseClasses} border-gray-200 focus:border-blue-500`;
  }
};

const getEmailMessageClasses = () => {
  return emailError.value ? 'text-red-500 italic' : '';
};

const getNIKMessageClasses = () => {
  if (nikError.value) {
    return 'text-red-500 italic';
  }
  
  switch (nikStatus.value) {
    case 'warning':
      return 'text-yellow-600 italic';
    case 'success':
      return 'text-green-600 italic';
    default:
      return 'text-gray-500 italic';
  }
};

const formatNIKMessage = () => {
  if (nikError.value) {
    return nikError.value;
  }
  
  if (!nik.value || nik.value.length === 0) {
    return 'Masukkan 16 digit NIK';
  } else if (nik.value.length < 16) {
    return `Masukkan ${16 - nik.value.length} digit lagi`;
  } else if (nik.value.length === 16 && nikStatus.value === 'success') {
    return '✓ Format NIK benar';
  }
  
  return '';
};


const handleCancel = () => {
  clearForm();
  router.push('/applicationletter');
};

// Update handleSubmit dengan validasi yang lebih ketat
const handleSubmit = async () => {
  try {
    // Reset errors
    emailError.value = null;
    nikError.value = null;
    
    let valid = true;

    // Validasi email
    if (!email.value?.trim()) {
      emailError.value = 'Email Tujuan harus diisi.';
      emailStatus.value = 'error';
      valid = false;
    } else if (!validateEmail(email.value)) {
      emailError.value = 'Format email tidak valid.';
      emailStatus.value = 'error';
      valid = false;
    }

    // Validasi NIK
    if (!nik.value?.trim()) {
      nikError.value = 'NIK harus diisi.';
      nikStatus.value = 'error';
      valid = false;
    } else if (nik.value.length !== 16) {
      nikError.value = 'NIK harus terdiri dari 16 digit angka.';
      nikStatus.value = 'error';
      valid = false;
    }

    // Validasi jenis surat
    if (!letter.value) {
      $toast('Jenis Surat harus diisi.', 'error');
      valid = false;
    }

    if (!valid) return;

    isLoading.value = true;

    // Transform data for API
    const payload = {
      toEmail: email.value,
      data_nik: nik.value,
      category_letter: letter.value,
    };

    // Send API request
    const response = await useFetchApi('/api/auth/application-letter', {
      method: 'POST',
      body: payload,
    });

    $toast('Surat Pengajuan Berhasil di Kirim!', 'success');
    clearForm();
    router.push('/applicationletter');
  } catch (error: any) {
    $toast('Nomer Induk Kependudukan (NIK) tidak ditemukan.', 'error');
  } finally {
    isLoading.value = false;
  }
};
</script>

