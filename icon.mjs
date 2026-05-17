import sharp from 'sharp'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
  <rect width="512" height="512" rx="92" fill="#051B2C"/>
  <circle cx="420" cy="88" r="150" fill="#FFFFFF" opacity="0.12"/>
  <circle cx="420" cy="88" r="100" fill="#FFFFFF" opacity="0.10"/>
  <circle cx="420" cy="88" r="56" fill="#FFFFFF" opacity="0.12"/>
  <text x="240" y="300" font-family="Georgia, serif" font-weight="bold" font-size="265" fill="#00CFB4" text-anchor="middle">G</text>
  <path d="M52,370 Q142,345 234,370 Q326,395 418,370 Q454,359 480,365" fill="none" stroke="#00CFB4" stroke-width="17" stroke-linecap="round" opacity="0.95"/>
  <path d="M54,404 Q144,379 236,404 Q328,429 420,404 Q455,393 481,399" fill="none" stroke="#00CFB4" stroke-width="12" stroke-linecap="round" opacity="0.65"/>
  <path d="M56,435 Q146,410 238,435 Q330,460 422,435 Q456,424 482,430" fill="none" stroke="#00CFB4" stroke-width="7" stroke-linecap="round" opacity="0.38"/>
</svg>`

const buf = Buffer.from(svg)
await sharp(buf).resize(512,512).png().toFile('public/icon-512.png')
await sharp(buf).resize(192,192).png().toFile('public/icon-192.png')
await sharp(buf).resize(180,180).png().toFile('public/apple-touch-icon.png')
await sharp(buf).resize(32,32).png().toFile('public/favicon.png')
console.log('Icons done')
