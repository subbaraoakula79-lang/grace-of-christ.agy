// Auto-setup script: generates .env for both frontend and backend
// Run: node scripts/setup-env.js
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

const backendEnv = `# ========================
# AUTO-GENERATED .env file
# Generated: ${new Date().toISOString()}
# ========================

NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

DATABASE_URL="postgresql://postgres:password@localhost:5432/goc_db?schema=public"

JWT_ACCESS_SECRET=${generateSecret()}
JWT_REFRESH_SECRET=${generateSecret()}
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

TOTP_ISSUER=GraceOfChrist

PAYMENT_MODE=mock
RAZORPAY_KEY_ID=rzp_test_mock_key
RAZORPAY_KEY_SECRET=mock_secret

EMAIL_MODE=mock
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM="Grace of Christ <noreply@graceofchrist.org>"

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CHURCH_NAME=Grace of Christ (GOC)
CHURCH_LOCATION=Yetimoga, Kakinada, Andhra Pradesh, India
CHURCH_PASTOR=K. John Prasad
`;

const frontendEnv = `# ========================
# AUTO-GENERATED .env.local file
# Generated: ${new Date().toISOString()}
# ========================

NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Grace of Christ
NEXT_PUBLIC_PAYMENT_MODE=mock
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_mock_key
`;

const backendPath = path.join(__dirname, '..', '.env');
const frontendPath = path.join(__dirname, '..', '..', 'frontend', '.env.local');

if (!fs.existsSync(backendPath)) {
  fs.writeFileSync(backendPath, backendEnv);
  console.log('✅ Backend .env created with fresh secrets');
} else {
  console.log('⚠️  Backend .env already exists — skipped (delete it to regenerate)');
}

if (!fs.existsSync(frontendPath)) {
  fs.writeFileSync(frontendPath, frontendEnv);
  console.log('✅ Frontend .env.local created');
} else {
  console.log('⚠️  Frontend .env.local already exists — skipped');
}

console.log('\n🎉 Setup complete! Next steps:');
console.log('   1. Update DATABASE_URL in backend/.env');
console.log('   2. Run: cd backend && npm run db:push && npm run db:seed');
console.log('   3. Run: cd backend && npm run dev');
console.log('   4. Run: cd frontend && npm run dev');
