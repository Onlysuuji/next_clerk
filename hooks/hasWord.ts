import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const fetchWordT = async (language: string) => {
    const word = await prisma.word.findFirst({
        where: {
            language: language,
        },
        orderBy: {
            updatedAt: 'asc',
        },
    });

    return word ?? false;
};
