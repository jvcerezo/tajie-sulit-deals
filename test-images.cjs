const https = require('https');

const images = {
  'aula-f75': 'https://m.media-amazon.com/images/I/71Ww2c2sKxL._AC_SL1500_.jpg',
  'baseus-light': 'https://m.media-amazon.com/images/I/61k1jD9q4iL._AC_SL1500_.jpg',
  'ugreen-65w': 'https://m.media-amazon.com/images/I/61iVfK-qUqL._AC_SL1500_.jpg',
  'desk-mat': 'https://m.media-amazon.com/images/I/71uXq6W2FmL._AC_SL1500_.jpg',
  'cable-clips': 'https://m.media-amazon.com/images/I/61n9rB8n1DL._AC_SL1500_.jpg',
  'timemore-c3': 'https://m.media-amazon.com/images/I/61r5c6XUuKL._AC_SL1500_.jpg',
  'wacaco': 'https://m.media-amazon.com/images/I/61J6aK8uOXL._AC_SL1500_.jpg',
  'nordic-mug': 'https://m.media-amazon.com/images/I/71jYy7iJ8mL._AC_SL1500_.jpg',
  'coffee-scale': 'https://m.media-amazon.com/images/I/61aK0bW4VjL._AC_SL1500_.jpg',
  'frother': 'https://m.media-amazon.com/images/I/61V1V8w2U1L._AC_SL1500_.jpg',
  'seat-cushion': 'https://m.media-amazon.com/images/I/71b2k+kYdZL._AC_SL1500_.jpg',
  'sunset-lamp': 'https://m.media-amazon.com/images/I/61H+VvR9mWL._AC_SL1500_.jpg',
  'smart-plug': 'https://m.media-amazon.com/images/I/61hX4Tz+uJL._AC_SL1500_.jpg',
  'flame-diffuser': 'https://m.media-amazon.com/images/I/61fWq+5vJPL._AC_SL1500_.jpg',
  'bath-mat': 'https://m.media-amazon.com/images/I/71R3T+3X0QL._AC_SL1500_.jpg',
  'tumbler-boot': 'https://m.media-amazon.com/images/I/61Y0S2uG8VL._AC_SL1500_.jpg',
  'heavyweight-tee': 'https://m.media-amazon.com/images/I/71z7n5iG8NL._AC_SL1500_.jpg',
  'titanium-glasses': 'https://m.media-amazon.com/images/I/61J2y9S2rXL._AC_SL1500_.jpg',
};

async function checkImage(key, url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ key, status: res.statusCode, type: res.headers['content-type'] });
    }).on('error', (err) => {
      resolve({ key, error: err.message });
    });
  });
}

async function run() {
  for (const [key, url] of Object.entries(images)) {
    const res = await checkImage(key, url);
    console.log(key, res.status, res.type);
  }
}

run();
