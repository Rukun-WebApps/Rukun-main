<template>
  <div class="p-4 md:p-5 h-fit max-h-full flex flex-col bg-white border shadow-sm rounded-xl space-y-4">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-medium text-gray-800 w-full">Tambah Data Kartu Keluarga</h2>
    </div>
    <!-- End Header -->

    <hr>

    <div class="h-full w-full mt-2">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4 flex flex-col">

          <!-- Nomor Kartu Keluarga (KK) -->
          <div class="grid sm:grid-cols-3">
            <label for="kk" class="block text-sm font-medium mb-2 w-full">Nomor Keluarga (KK)</label>
            <div class="col-span-2">
              <div class="relative">
                <input
                  type="text"
                  id="kk"
                  v-model="kk"
                  @input="handleKKInput"
                  @blur="handleKKBlur"
                  maxlength="16"
                  :class="getInputClasses()"
                  placeholder="1234567890123456"
                />
                <!-- Loading spinner saat cek database -->
                <div v-if="isChecking" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg class="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <!-- Success icon -->
                <div v-else-if="inputStatus === 'success'" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg class="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              
              <!-- Progress dan pesan -->
              <div class="mt-1 flex justify-between items-center">
                <small :class="getMessageClasses()">{{ formatMessage() }}</small>
                <!-- <small class="text-gray-400">{{ kkProgress }}/16</small> -->
              </div>
            </div>
          </div>

          <!-- Nama Kepala Keluarga --> 
          <div class="grid sm:grid-cols-3">
            <label for="name" class="block text-sm font-medium mb-2 w-full">Nama Kepala Keluarga</label>
            <div class="col-span-2">
              <input
                type="text"
                id="name"
                v-model="name"
                class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder="Muhammad"
              />
              <small class="text-red-500 italic">{{ nameError }}</small> <!-- ⬅️ pindah ke sini -->
            </div>
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
              Simpan
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

const name = ref<string | null>(null);
const kk = ref<string | null>(null);
const isLoading = ref<boolean>(false);
const kkError = ref<string | null>(null);
const nameError = ref<string | null>(null);
const kkProgress = ref(0);
const isChecking = ref(false);
const inputStatus = ref('neutral');


const clearForm = () => {
  name.value = null;
  kk.value = null;
  kkProgress.value = 0;
  inputStatus.value = 'neutral';
  kkError.value = null;
  nameError.value = null;
};


const handleCancel = () => {
  clearForm();
  router.push('/KK');
};


// Update handleKKInput
const handleKKInput = (event: Event) => {
  const input = (event.target as HTMLInputElement).value.replace(/\D/g, '');
  kk.value = input.slice(0, 16);
  
  // Update progress
  kkProgress.value = kk.value?.length || 0;
  
  // Reset error state saat user mengetik
  kkError.value = null;
  
  // Update status berdasarkan panjang input
  if (!kk.value || kk.value.length === 0) {
    inputStatus.value = 'neutral';
  } else if (kk.value.length < 16) {
    inputStatus.value = 'warning';
  } else if (kk.value.length === 16) {
    inputStatus.value = 'success';
  }
};

// Handler untuk blur event
const handleKKBlur = async () => {
  if (kk.value && kk.value.length === 16) {
    await checkKKAvailability();
  }
};

// Update checkKKAvailability
const checkKKAvailability = async () => {
  if (!kk.value || kk.value.length !== 16) return false;
  
  isChecking.value = true;
  kkError.value = null;
  
  try {
    const result = await $fetch<{ kkTaken: boolean }>('/api/auth/checkKK', {
      method: 'post',
      body: { kk: kk.value }
    });

    if (result.kkTaken) {
      kkError.value = 'Nomor KK sudah terdaftar.';
      inputStatus.value = 'error';
      return false;
    } else {
      inputStatus.value = 'success';
      return true;
    }
  } catch (err) {
    kkError.value = 'Gagal memeriksa data KK. Coba lagi.';
    inputStatus.value = 'error';
    return false;
  } finally {
    isChecking.value = false;
  }
};

// Method untuk CSS classes dinamis
const getInputClasses = () => {
  const baseClasses = "py-3 px-4 block w-full rounded-lg text-sm focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none";
  
  switch (inputStatus.value) {
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

// Method untuk pesan dinamis
const formatMessage = () => {
  if (kkError.value) {
    return kkError.value;
  }
  
  if (!kk.value || kk.value.length === 0) {
    return 'Masukkan 16 digit nomor KK';
  } else if (kk.value.length < 16) {
    return `Masukkan ${16 - kk.value.length} digit lagi`;
  } else if (kk.value.length === 16 && inputStatus.value === 'success') {
    return '✓ Format nomor KK benar';
  }
  
  return '';
};

// Method untuk CSS classes pesan
const getMessageClasses = () => {
  if (kkError.value) {
    return 'text-red-500 italic';
  }
  
  switch (inputStatus.value) {
    case 'warning':
      return 'text-yellow-600 italic';
    case 'success':
      return 'text-green-600 italic';
    default:
      return 'text-gray-500 italic';
  }
};


// Form submission handler
const handleSubmit = async () => {
  // Reset error state
  kkError.value = null;
  nameError.value = null;

  let valid = true;

  // Validasi nama PERTAMA
  if (!name.value?.trim()) {
    nameError.value = 'Nama kepala keluarga wajib diisi.';
    valid = false;
  }

  // Validasi KK
  if (!kk.value || kk.value.length !== 16) {
    kkError.value = 'Nomor Kartu Keluarga harus terdiri dari 16 digit angka.';
    inputStatus.value = 'error';
    valid = false;
  }

  // Jika validasi dasar gagal, stop di sini
  if (!valid) return;

  // Baru cek ketersediaan KK setelah validasi dasar lolos
  const isAvailable = await checkKKAvailability();
  if (!isAvailable) return;
    
  try {
    isLoading.value = true;

    // Transform data for API
    const payload = {
      head_of_family: name.value!.trim(), // gunakan non-null assertion karena sudah divalidasi
      kk: kk.value!,
    };

    // API call
    await useFetchApi('/api/auth/kk', {
      method: 'POST',
      body: payload,
    });

    $toast('Data KK berhasil ditambahkan!', 'success');
    clearForm();
    router.push('/kk');
  } catch (error) {
    $toast('Terjadi kesalahan pada server. Silakan coba lagi.', 'error');
  } finally {
    isLoading.value = false;
  }
};
</script>
