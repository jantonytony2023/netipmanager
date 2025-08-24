import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('Conexão com o banco de dados estabelecida com sucesso pelo Prisma!');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
};

export { connectDB, prisma };
