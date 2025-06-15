import UrlPattern from "url-pattern"
import {decodeAccessToken} from "~/server/utils/jwt";
import {User} from "~/server/model/User";

export default defineEventHandler(async (event) => {
    try {
        // Definisi endpoints dengan role yang diizinkan
        const endpointRoles = {
            // Endpoints untuk semua user yang login (User + Admin)
            '/api/auth/user': ['User', 'Admin'],
            '/api/auth/logout': ['User', 'Admin'],
            
            
            // Endpoints untuk User (bisa buat & lihat pengajuan surat sendiri)
            '/api/auth/application-letter': ['User', 'Admin'],
            '/api/auth/application-letter/:id': ['User', 'Admin'],
            '/api/auth/application-letter/search?q=:q': ['User', 'Admin'],
            '/api/auth/application-letter?page=:page&pagesize=:pagesize': ['User', 'Admin'],
            
            // Endpoints khusus Admin saja
            '/api/auth/users': ['Admin'],
            '/api/auth/users/:id': ['Admin'],
            '/api/auth/user/stats': ['User', 'Admin'],
            '/api/auth/users/search': ['Admin'],
            '/api/auth/users?page=:page&pagesize=:pagesize': ['Admin'],

            '/api/auth/citizen': ['Admin'],
            '/api/auth/citizen/:id': ['Admin'],
            '/api/auth/citizen/search?q=:q': ['Admin'],
            '/api/auth/citizen?page=:page&pagesize=:pagesize': ['Admin'],

            '/api/auth/kk': ['Admin'],
            '/api/auth/kk/:id': ['Admin'],
            '/api/auth/kk/search?q=:q': ['Admin'],
            '/api/auth/kk?page=:page&pagesize=:pagesize': ['Admin'],

            '/api/auth/cashflow': ['Admin'],
            '/api/auth/cashflow/:id': ['Admin'],
            '/api/auth/cashflow/search?q=:q': ['Admin'],
            '/api/auth/cashflow?page=:page&pagesize=:pagesize': ['Admin'],

            '/api/auth/notifications': ['User', 'Admin'],
            '/api/auth/notifications/:id': ['User', 'Admin'],
            '/api/auth/notifications/search?q=:q': ['User', 'Admin'],
            '/api/auth/notifications?page=:page&pagesize=:pagesize': ['User', 'Admin'],

            '/api/auth/logs': ['User', 'Admin'],
            '/api/auth/logs?page=:page&pagesize=:pagesize': ['User', 'Admin'],
        };

        // Cek apakah URL ini ditangani oleh middleware ini
        const matchedEndpoint = Object.keys(endpointRoles).find(endpoint => {
            const pattern = new UrlPattern(endpoint);
            return pattern.match(event.node.req.url as string);
        });

        if (!matchedEndpoint) {
            return; // Tidak ditangani oleh middleware ini
        }

        // Ambil token dari header
        const authHeader = getHeader(event, 'authorization');
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return sendError(event, createError({
                statusCode: 401,
                statusMessage: 'Token tidak ditemukan'
            }));
        }

        // Decode token
        const decoded = decodeAccessToken(token);
        if (!decoded) {
            return sendError(event, createError({
                statusCode: 401,
                statusMessage: 'Token tidak valid'
            }));
        }

        try {
            // Ambil data user
            const userId = decoded.id;
            const user = await User.getUserById(userId);
            
            if (!user) {
                return sendError(event, createError({
                    statusCode: 401,
                    statusMessage: 'User tidak ditemukan'
                }));
            }

            // Cek role authorization
            const allowedRoles = endpointRoles[matchedEndpoint as keyof typeof endpointRoles];
            if (!allowedRoles.includes(user.role)) {
                return sendError(event, createError({
                    statusCode: 403,
                    statusMessage: 'Akses ditolak - Anda tidak memiliki izin untuk mengakses resource ini'
                }));
            }

            // Set context untuk handler selanjutnya
            event.context.auth = { user: user };
            
        } catch (error) {
            return sendError(event, createError({
                statusCode: 500,
                statusMessage: 'Error saat memvalidasi user'
            }));
        }
        
    } catch (error) {
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: 'Server error'
        }));
    }
});