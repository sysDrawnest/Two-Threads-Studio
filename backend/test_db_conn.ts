import prisma from "./src/prisma/index.js";

async function testConnection() {
  console.log("Testing DB connection step 1...");
  const categories = await prisma.category.findMany({ take: 2 });
  console.log(`Step 1 success! Found ${categories.length} categories.`);

  console.log("Waiting 2 seconds to verify socket persistence...");
  await new Promise((r) => setTimeout(r, 2000));

  console.log("Testing DB connection step 2...");
  const users = await prisma.user.findMany({ take: 2 });
  console.log(`Step 2 success! Found ${users.length} users.`);
}

testConnection()
  .then(() => console.log("ALL DB CONNECTION TESTS PASSED!"))
  .catch((err) => console.error("TEST FAILED:", err))
  .finally(() => process.exit(0));
