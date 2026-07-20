import prisma from '../prisma';
import { comparePassword } from '../lib/crypto';

async function main() {
  const email = 'admin@twothreads.com';
  const password = 'password123';
  
  const user = await prisma.user.findUnique({ where: { email } });
  
  console.log('User found:', !!user);
  if (user) {
    console.log('User isActive:', user.isActive);
    console.log('Stored hash:', user.passwordHash);
    
    const isMatch = await comparePassword(password, user.passwordHash);
    console.log('Does "password123" match hash?:', isMatch);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
