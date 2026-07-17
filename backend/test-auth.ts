import prisma from './src/prisma/index';
import bcrypt from 'bcrypt';

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@twothreads.com' }
  });
  
  if (!user) {
    console.log('User not found');
    return;
  }
  
  console.log('User passwordHash:', user.passwordHash);
  
  const match = await bcrypt.compare('Admin@12345', user.passwordHash);
  console.log('Match Admin@12345:', match);
}

main().finally(() => prisma.$disconnect());
