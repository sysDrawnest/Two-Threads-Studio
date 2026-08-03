import prisma from "./src/prisma/index.js";

async function main() { 
  const refunds = await prisma.refund.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { payment: true } }); 
  console.dir(refunds, {depth: null}); 
} 
main().catch(console.error).finally(() => process.exit(0));
