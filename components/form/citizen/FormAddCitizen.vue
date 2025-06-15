<template>
    <div class="p-4 md:p-5 h-fit max-h-full flex flex-col bg-white border shadow-sm rounded-xl space-y-4">
      <!-- Header -->
      <div>
        <h2 class="text-xl font-medium text-gray-800 w-full">Tambah Warga</h2>
      </div>
      <!-- End Header -->
  
      <hr>
  
      <div class="h-full w-full mt-2 overflow-y-auto">
        <form @submit.prevent="handleSubmit">
          <div class="space-y-4 flex flex-col">
            <!-- Nama Lengkap -->
            <div class="grid sm:grid-cols-3">
              <label for="full_name" class="block text-sm font-medium mb-2 w-full">Nama Lengkap</label>
              <div class="col-span-2">
                <input type="text" id="full_name" v-model="full_name"
                  class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="John Doe">
                <small class="text-red-500 italic">{{ nameError }}</small>
              </div>
            </div>
            <!-- NIK -->
            <div class="grid sm:grid-cols-3">
              <label for="nik" class="block text-sm font-medium mb-2 w-full">Nomor Induk Kependudukan (NIK)</label>
              <div class="col-span-2">
                <div class="relative">
                  <input type="text" id="nik" 
                        v-model="nik" 
                        @input="handleNIKInput" 
                        @blur="handleNIKBlur"
                        maxlength="16"
                        :class="getNIKInputClasses()"
                        placeholder="1234567890123456">
                  
                  <!-- Loading spinner saat cek database -->
                  <div v-if="isCheckingNIK" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg class="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  
                  <!-- Success icon -->
                  <div v-else-if="nikStatus === 'success'" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg class="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                
                <!-- Progress dan pesan -->
                <div class="mt-1 flex justify-between items-center">
                  <small :class="getNIKMessageClasses()">{{ formatNIKMessage() }}</small>
                  <small class="text-gray-400">{{ nikProgress }}/16</small>
                </div>
              </div>
            </div>

            <!-- Jenis Kelamin -->
            <div class="grid sm:grid-cols-3">
              <label for="gender" class="block text-sm font-medium mb-2 w-full">Jenis Kelamin</label>
              <div class="col-span-2">
                <select id="gender"
                        v-model="gender"
                        class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
                <small class="text-red-500 italic">{{ genderError }}</small>
              </div>
            </div>

            <!-- Tanggal Lahir -->
            <div class="grid sm:grid-cols-3">
              <label for="dob" class="block text-sm font-medium mb-2 w-full">Tanggal Lahir</label>
              <div class="col-span-2">
                <input type="date" id="dob"
                      v-model="dob"
                      class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
                <small class="text-red-500 italic">{{ dobError }}</small>
              </div>
            </div>

            <!-- Alamat -->
            <div class="grid sm:grid-cols-3">
              <label for="address" class="block text-sm font-medium mb-2 w-full">Alamat</label>
              <div class="col-span-2">
                <textarea id="address"
                          v-model="address"
                          class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                          placeholder="Jl. Raya 1234"></textarea>
                <small class="text-red-500 italic">{{ addError }}</small>
              </div>
            </div>

            <!-- KK Dropdown -->
            <div class="grid sm:grid-cols-3">
              <label for="kk_id" class="block text-sm font-medium mb-2 w-full">Kartu Keluarga (KK)</label>
              <div class="col-span-2">
                <ComboBoxKk class="w-full" @selectedKK="handleSelectKKID" />
                <small class="text-red-500 italic">{{ kkError }}</small>
              </div>
            </div>

  
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
  import ComboBoxKk from "~/components/form/advanced/ComboBoxKK.vue";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  const {$toast} = useNuxtApp();
  
  // State form
  const full_name = ref<string | null>(null);
  const nik = ref<string | null>(null); // NIK
  const gender = ref<string | null>(null);
  const dob = ref<string | null>(null);
  const address = ref<string | null>(null);
  const kk_id = ref<number | null>(null);
  const isLoading = ref<boolean>(false);
  const nikError = ref<string | null>(null);
  const nameError = ref<string | null>(null);
  const genderError = ref<string | null>(null);
  const dobError = ref<string | null>(null);
  const addError = ref<string | null>(null);
  const kkError = ref<string | null>(null);
  const nikProgress = ref(0);
  const isCheckingNIK = ref(false);
  const nikStatus = ref('neutral'); // 'neutral', 'warning', 'success', 'error'

  
  // Update clearForm
  const clearForm = () => {
    full_name.value = null;
    nik.value = null;
    gender.value = null;
    dob.value = null;
    address.value = null;
    kk_id.value = null;
    nikProgress.value = 0;
    nikStatus.value = 'neutral';
    nikError.value = null;
    nameError.value = null;
    genderError.value = null;
    dobError.value = null;
    addError.value = null;
    kkError.value = null;
  };
  
  const handleCancel = () => {
    clearForm();
    router.push('/citizen');
  };

  const handleSelectKKID = (e: any) => {
    kk_id.value = e.id;
  };
  
  // Update handleNIKInput
  const handleNIKInput = (event: Event) => {
    const input = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    nik.value = input.slice(0, 16);
    
    // Update progress
    nikProgress.value = nik.value?.length || 0;
    
    // Reset error state
    nikError.value = null;
    
    // Update status berdasarkan panjang input
    if (!nik.value || nik.value.length === 0) {
      nikStatus.value = 'neutral';
    } else if (nik.value.length < 16) {
      nikStatus.value = 'warning';
    } else if (nik.value.length === 16) {
      nikStatus.value = 'success';
    }
  };

  // Handler untuk blur event
  const handleNIKBlur = async () => {
    if (nik.value && nik.value.length === 16) {
      await checkNIKAvailability();
    }
  };
  // Method untuk cek NIK tersendiri
  const checkNIKAvailability = async () => {
    if (!nik.value || nik.value.length !== 16) return false;
    
    isCheckingNIK.value = true;
    nikError.value = null;
    
    try {
      const result = await $fetch<{ nikTaken: boolean }>('/api/auth/checkCitizen', {
        method: 'post',
        body: { nik: nik.value }
      });

      if (result.nikTaken) {
        nikError.value = 'NIK sudah terdaftar.';
        nikStatus.value = 'error';
        return false;
      } else {
        nikStatus.value = 'success';
        return true;
      }
    } catch (err) {
      nikError.value = 'Gagal memeriksa data NIK. Coba lagi.';
      nikStatus.value = 'error';
      return false;
    } finally {
      isCheckingNIK.value = false;
    }
  };

    // Method untuk CSS classes dinamis
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

  // Method untuk pesan dinamis
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

  // Method untuk CSS classes pesan
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
  
  const checkKKAvailability = async () => {
    // Reset semua error
    nikError.value = null;
    nameError.value = null;
    genderError.value = null;
    dobError.value = null;
    addError.value = null;
    kkError.value = null;

    let valid = true;

    // Validasi form
    if (!full_name.value?.trim()) {
      nameError.value = 'Nama lengkap harus diisi.';
      valid = false;
    }

    if (!nik.value || nik.value.length !== 16) {
      nikError.value = 'NIK harus terdiri dari 16 digit angka.';
      nikStatus.value = 'error';
      valid = false;
    }

    if (!gender.value) {
      genderError.value = 'Jenis kelamin harus dipilih.';
      valid = false;
    }

    if (!dob.value) {
      dobError.value = 'Tanggal lahir harus diisi.';
      valid = false;
    }

    if (!address.value?.trim()) {
      addError.value = 'Alamat harus diisi.';
      valid = false;
    }

    if (!kk_id.value) {
      kkError.value = 'Kartu Keluarga harus dipilih.';
      valid = false;
    }

    // Jika validasi dasar gagal, stop di sini
    if (!valid) return false;

    // Cek NIK availability (hanya jika validasi dasar lolos)
    try {
      const result = await $fetch<{ nikTaken: boolean }>('/api/auth/checkCitizen', {
        method: 'post',
        body: { nik: nik.value }
      });

      if (result.nikTaken) {
        nikError.value = 'NIK sudah terdaftar.';
        nikStatus.value = 'error';
        return false;
      }

      return true;
    } catch (err) {
      nikError.value = 'Gagal memeriksa data NIK. Coba lagi.';
      nikStatus.value = 'error';
      return false;
    }
  };
  
    
  // Form submission handler
  const handleSubmit = async () => {
    const isAvailable = await checkKKAvailability();
    if (!isAvailable) return; 

    try {
      // Basic validation
      if (!full_name.value) {
        $toast('Nama lengkap harus diisi.', 'error');
        return;
      }
      if (!nik.value) {
        $toast('Nomer Induk Kependudukan (NIK) harus diisi.', 'error');
        return;
      }
      if (!nik.value || nik.value.length !== 16) {
      $toast('Nomer Induk Kependudukan (NIK) harus 16 digit angka.', 'error');
      return;
      }
      if (!gender.value) {
        $toast('Jenis Kelamin harus dipilih.', 'error');
        return;
      }
      if (!dob.value) {
        $toast('Tanggal Lahir harus diisi.', 'error');
        return;
      }
      if (!address.value) {
        $toast('Alamat harus diisi.', 'error');
        return;
      }
      if (!kk_id.value) {
        $toast('KK harus diisi.', 'error');
        return;
      }
  
      isLoading.value = true;
  
      // Transform data for API
      const payload = {
        full_name: full_name.value,
        nik: nik.value,
        gender: gender.value?.charAt(0).toUpperCase() + gender.value?.slice(1), 
        dob: dob.value,
        address: address.value,
        kk_id: kk_id.value,
      };
  
      // API call
      await useFetchApi('/api/auth/citizen', {
        method: 'POST',
        body: payload,
      });
  
      $toast('Data warga berhasil ditambahkan!', 'success');
      clearForm();
      router.push('/citizen');
    } catch (error) {
      $toast('Terjadi kesalahan pada server. Silakan coba lagi.', 'error');
    } finally {
      isLoading.value = false;
    }
  };
  </script>
  <style lang="css" scoped>
  </style>