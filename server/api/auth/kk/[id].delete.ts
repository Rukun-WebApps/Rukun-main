// import {KK} from '~/server/model/KK';
// import {LogRequest} from "~/types/AuthType";
// import {ActionLog} from "~/types/TypesModel";
// import {createLog } from "~/server/utils/atLog";

// export default defineEventHandler(async (event) => {
//     // Check if user exists
//     const user = event.context.auth.user;
//     if (!user) {
//         setResponseStatus(event, 403);
//         return {code: 403, message: 'Pengguna tidak valid'};
//     }

//     try {
//         const id = parseInt(event.context.params?.id as string, 10);

//         const payload: LogRequest = {
//             user_id: user.id,
//             action: ActionLog.DELETE,
//             description: `Data KK dengan ID ${id}, berhasil dihapus`,
//         }
//         const kk = await KK.deleteKK(id);

//         await createLog(payload)

//         return {
//             code: 200,
//             message: 'Data KK berhasil dihapus!',
//             data: kk,
//         };

//     } catch (error: any) {
//         console.error(error);
//         return sendError(event, createError({statusCode: 500, statusMessage: 'Internal Server Error'}));
//     }
// });

import {KK} from '~/server/model/KK';
import {LogRequest} from "~/types/AuthType";
import {ActionLog} from "~/types/TypesModel";
import { createLog } from "~/server/utils/atLog"; 

export default defineEventHandler(async (event) => {
    // Check if user exists
    const user = event.context.auth.user;
    if (!user) {
        setResponseStatus(event, 403);
        return {code: 403, message: 'Pengguna tidak valid'};
    }

    try {
        const id = parseInt(event.context.params?.id as string, 10);
        
        // Validasi ID
        if (isNaN(id)) {
            setResponseStatus(event, 400);
            return {code: 400, message: 'ID tidak valid'};
        }

        console.log('Attempting to delete KK with ID:', id); // Debug log

        // Cek apakah KK exists sebelum delete
        const existingKK = await KK.getKKById(id);
        if (!existingKK) {
            setResponseStatus(event, 404);
            return {code: 404, message: 'Data KK tidak ditemukan'};
        }

        console.log('KK found, proceeding with delete...'); // Debug log

        // Delete KK
        const kk = await KK.deleteKK(id);
        
        console.log('KK deleted successfully, creating log...'); // Debug log

        // Create log
        const payload: LogRequest = {
            user_id: user.id,
            action: ActionLog.DELETE,
            description: `Data KK dengan ID ${id}, berhasil dihapus`,
        }
        
        await createLog(payload);
        
        console.log('Log created successfully'); // Debug log

        return {
            code: 200,
            message: 'Data KK berhasil dihapus!',
            data: kk,
        };

    } catch (error: any) {
        console.error('Delete KK Error:', error);
        
        // Handle specific Prisma errors
        if (error.code === 'P2003') {
            setResponseStatus(event, 400);
            return {
                code: 400, 
                message: 'Tidak dapat menghapus KK karena masih ada data terkait (Citizen)'
            };
        }
        
        if (error.code === 'P2025') {
            setResponseStatus(event, 404);
            return {
                code: 404, 
                message: 'Data KK tidak ditemukan'
            };
        }

        // Generic error
        setResponseStatus(event, 500);
        return {
            code: 500,
            message: 'Terjadi kesalahan server',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        };
    }
});