import fetch from 'node-fetch';

async function main() {
  const slug = 'midnight-bloom-hand-embroidery-kit-test-demo';
  const url = `http://localhost:5000/api/v1/products/${slug}`;
  console.log(`Fetching from: ${url}`);
  
  const res = await fetch(url);
  const data = await res.json();
  
  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
