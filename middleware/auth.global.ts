// middleware/auth.global.ts

export default defineNuxtRouteMiddleware((to, from) => {
  const isAuthenticated = useCookie('isLoggedIn').value;
  const userRoleCookie = useCookie('user_role').value;
  
  // Check if user is admin (case-insensitive)
  const isAdmin = userRoleCookie && 
    String(userRoleCookie).toLowerCase().trim() === 'admin';

  // Halaman publik yang tidak memerlukan otentikasi
  const publicPages = [
    '/auth/login', 
    '/auth/register', 
    '/auth/forget-password', 
    '/auth/reset-password', 
    '/auth/verification'
  ];

  // Halaman yang diizinkan untuk User biasa
  const userAllowedPages = [
    '/dashboard',  
    '/profile', 
    '/applicationletter',
    '/applicationletter/create',
    '/applicationletter/history',
    '/notifications'
  ];

  const isPublicPage = publicPages.includes(to.path);

  // Cek 1: Jika belum login dan bukan halaman publik -> redirect ke login
  if (!isPublicPage && !isAuthenticated) {
    return navigateTo('/auth/login', { redirectCode: 302 });
  }

  // Cek 2: Jika sudah login tapi akses halaman auth -> redirect berdasarkan role
  if (publicPages.includes(to.path) && isAuthenticated) {
    if (isAdmin) {
      return navigateTo('/');  // Admin ke root
    } else {
      return navigateTo('/dashboard');  // User ke dashboard
    }
  }

  // Cek 3: Jika user biasa akses root path -> redirect ke dashboard
  if (to.path === '/' && isAuthenticated && !isAdmin) {
    return navigateTo('/dashboard');
  }

  // Cek 4: Jika admin -> biarkan akses ke mana saja
  if (isAdmin) {
    return; // Admin bisa akses semua halaman
  }

  // Cek 5: Jika user biasa -> cek apakah halaman diizinkan
  if (isAuthenticated && !isPublicPage) {
    const isAllowed = userAllowedPages.some(allowedPath => {
      return to.path === allowedPath || 
             to.path.startsWith(allowedPath + '/');
    });

    if (!isAllowed) {
      // Return 404 untuk menyembunyikan keberadaan halaman admin 
      throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found'
      });
    }
  }
});