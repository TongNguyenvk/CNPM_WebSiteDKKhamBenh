const crypto = require('crypto');

function generateSecret() {
  return crypto.randomBytes(64).toString('hex'); // Tạo chuỗi 64 byte và chuyển đổi thành hex
}

const secret = generateSecret();
console.log('JWT Secret:', secret);