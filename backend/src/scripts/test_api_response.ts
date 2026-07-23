import http from 'http';

function get(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function main() {
  const result = await get('http://localhost:5000/api/v1/products');
  console.log('API Response structure keys:', Object.keys(result));
  if (result.data && result.data.products) {
    const products = result.data.products;
    console.log('Returned products count:', products.length);
    const target = products.find((p: any) => p.name.includes('Midnight Bloom')) || products[0];
    console.log('Sample Product from GET /api/v1/products:');
    console.log(JSON.stringify(target, null, 2));
  }
}

main().catch(console.error);
