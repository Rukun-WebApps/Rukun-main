# RUKUN - Nuxt Minimal Starter

Panduan untuk menjalankan project ini di lokal:

## Langkah Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/Rukun-WebApps/Rukun-main.git
   cd Rukun-main
   ```

2. **Buat database MySQL dengan nama `rukun`**
   
   Pastikan MySQL sudah berjalan, lalu buat database dengan nama `rukun`:
   ```sql
   CREATE DATABASE rukun;
   ```

3. **Install dependencies dan generate Prisma client**
   ```bash
   npm install
   npx prisma generate
   ```

4. **Generate file migrasi Prisma**
   ```bash
   npx prisma migrate generate
   ```

5. **Jalankan project**
   
   **Development mode**
   ```bash
   npm run dev
   ```
   
   **Production mode**
   ```bash
   npm run build
   npm run start
   ```

---

## Dokumentasi Tambahan

* Dokumentasi Nuxt: [https://nuxt.com/docs/getting-started/introduction](https://nuxt.com/docs/getting-started/introduction)
* Dokumentasi Deployment: [https://nuxt.com/docs/getting-started/deployment](https://nuxt.com/docs/getting-started/deployment)
```
