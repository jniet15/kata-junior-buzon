import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  
  await prisma.requestHistory.deleteMany();
  await prisma.request.deleteMany();
  await prisma.user.deleteMany();

  
  const user1 = await prisma.user.create({
    data: {
      email: 'solicitante@example.com',
      name: 'Juan Solicitante',
      password: await bcrypt.hash('password123', 10),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'aprobador@example.com',
      name: 'María Aprobadora',
      password: await bcrypt.hash('password123', 10),
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Carlos Administrador',
      password: await bcrypt.hash('password123', 10),
    },
  });

  console.log('Users created with passwords: password123');

 
  const request1 = await prisma.request.create({
    data: {
      title: 'Despliegue en Producción',
      description: 'Necesito desplegar la versión 2.0 de la aplicación en el servidor de producción.',
      type: 'DEPLOYMENT',
      createdById: user1.id,
      assignedToId: user2.id,
      status: 'PENDING',
    },
  });

  const request2 = await prisma.request.create({
    data: {
      title: 'Acceso a Base de Datos',
      description: 'Solicito acceso de lectura a la base de datos de clientes para generar reportes.',
      type: 'ACCESS',
      createdById: user1.id,
      assignedToId: user3.id,
      status: 'PENDING',
    },
  });

  console.log('Sample requests created');
  console.log('Seed completed!');
  console.log('\nCredenciales de prueba:');
  console.log('Solicitante: solicitante@example.com / password123');
  console.log('Aprobador: aprobador@example.com / password123');
  console.log('Admin: admin@example.com / password123');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });