const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(process.cwd(), 'public', 'images', 'products');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const sources = [
  {
    name: 'aula-f75.jpg',
    url: 'https://epomaker.com/cdn/shop/files/f75.jpg?v=1766993980',
  },
  {
    name: 'wacaco-espresso.png',
    url: 'https://www.wacaco.com/cdn/shop/products/Nanopresso_Grey-PNG--002-LD_b82dc871-a76d-4850-a66e-42d541261d2b.png?v=1698119888',
  },
  {
    name: 'baseus-lightbar.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0556/4134/2042/products/Baseusi-wokSeriesUSBSteplessDimmingScreenHangingLight_Fighting__1_800x.jpg',
  },
  {
    name: 'ugreen-65w.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0257/5246/9564/products/1_9dfbc4cb-c475-47e0-94e8-8a8b0ebc9360_800x.jpg',
  },
  {
    name: 'timemore-c3.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0569/2755/1647/products/Timemore-C3S-Pro-Coffee-Grinder-Black_800x.jpg',
  }
];

function download(item) {
  return new Promise((resolve) => {
    const dest = path.join(targetDir, item.name);
    const client = item.url.startsWith('https') ? https : http;
    const req = client.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(dest);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Successfully downloaded: ${item.name} (${fs.statSync(dest).size} bytes)`);
          resolve(true);
        });
      } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Handle redirect
        client.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (redRes) => {
          const fileStream = fs.createWriteStream(dest);
          redRes.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            console.log(`Successfully downloaded (after redirect): ${item.name}`);
            resolve(true);
          });
        });
      } else {
        console.warn(`Failed ${item.name} with HTTP status: ${res.statusCode}`);
        resolve(false);
      }
    });
    req.on('error', (err) => {
      console.warn(`Error on ${item.name}: ${err.message}`);
      resolve(false);
    });
  });
}

async function run() {
  for (const s of sources) {
    await download(s);
  }
}

run();
