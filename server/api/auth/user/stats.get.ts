// server/api/auth/user/stats.get.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Get user from auth context (set by middleware)
    const user = event.context.auth?.user;
    
    if (!user) {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      }));
    }

    // Get total applications count for this user
    const totalApplications = await prisma.applicationLetter.count({
      where: {
        create_by: user.id
      }
    });

    // Get applications count for current month
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const thisMonth = await prisma.applicationLetter.count({
      where: {
        create_by: user.id,
        create_at: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    // Get last application
    const lastApplication = await prisma.applicationLetter.findFirst({
      where: {
        create_by: user.id
      },
      orderBy: {
        create_at: 'desc'
      }
    });

    // Format last application data
    let lastApplicationFormatted = null;
    if (lastApplication) {
      const letterTypes: { [key: string]: string } = {
        'SuratPengantarKTP': 'Surat Pengantar KTP',
        'SuratKeteranganDomisili': 'Surat Keterangan Domisili',
        'SuratKeteranganUsaha': 'Surat Keterangan Usaha',
        'SuratPengantarNikah': 'Surat Pengantar Nikah',
        'SuratKeteranganTidakMampu': 'Surat Keterangan Tidak Mampu'
      };

      lastApplicationFormatted = {
        date: lastApplication.create_at.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        type: letterTypes[lastApplication.category_letter] || lastApplication.category_letter
      };
    }

    return {
      success: true,
      data: {
        totalApplications,
        thisMonth,
        lastApplication: lastApplicationFormatted
      }
    };

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    }));
  } finally {
    await prisma.$disconnect();
  }
});