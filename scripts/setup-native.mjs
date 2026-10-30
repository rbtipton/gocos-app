// One-time setup of the native iPhone and Android projects for GOCOS.
// Run on the build computer after `npm install`:   npm run native:setup
// Safe to run again: it only adds what is missing.
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const run = cmd => { console.log(`\n> ${cmd}`); execSync(cmd, { stdio: 'inherit' }) }

run('npx vite build')
if (!existsSync('android')) run('npx cap add android')
if (!existsSync('ios') && process.platform === 'darwin') run('npx cap add ios')
if (!existsSync('ios') && process.platform !== 'darwin') console.log('\nSkipping iOS: it can only be set up on a Mac.')

// App icons and splash screens: draw the source images, then let
// @capacitor/assets make every size each platform needs.
const bg = '#051B2C'
const sharp = (await import('sharp')).default
mkdirSync('assets', { recursive: true })
const mark = `<text x='240' y='300' font-family='Georgia, serif' font-weight='bold' font-size='265' fill='#00CFB4' text-anchor='middle'>G</text>
<path d='M52,370 Q142,345 234,370 Q326,395 418,370 Q454,359 480,365' fill='none' stroke='#00CFB4' stroke-width='17' stroke-linecap='round' opacity='0.95'/>
<path d='M54,404 Q144,379 236,404 Q328,429 420,404 Q455,393 481,399' fill='none' stroke='#00CFB4' stroke-width='12' stroke-linecap='round' opacity='0.65'/>`
const full = `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'><rect width='512' height='512' fill='${bg}'/>
<circle cx='420' cy='88' r='150' fill='#FFFFFF' opacity='0.12'/><circle cx='420' cy='88' r='100' fill='#FFFFFF' opacity='0.10'/><circle cx='420' cy='88' r='56' fill='#FFFFFF' opacity='0.12'/>
${mark}<path d='M56,435 Q146,410 238,435 Q330,460 422,435 Q456,424 482,430' fill='none' stroke='#00CFB4' stroke-width='7' stroke-linecap='round' opacity='0.38'/></svg>`
const fg = `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'><g transform='translate(102 102) scale(0.6)'>${mark}</g></svg>`
await sharp(Buffer.from(full), { density: 300 }).resize(1024, 1024).flatten({ background: bg }).png().toFile('assets/icon-only.png')
await sharp(Buffer.from(fg), { density: 300 }).resize(1024, 1024).png().toFile('assets/icon-foreground.png')
await sharp({ create: { width: 1024, height: 1024, channels: 3, background: bg } }).png().toFile('assets/icon-background.png')
const logo = await sharp(Buffer.from(fg), { density: 300 }).resize(900, 900).png().toBuffer()
for (const n of ['splash.png', 'splash-dark.png']) {
  await sharp({ create: { width: 2732, height: 2732, channels: 3, background: bg } })
    .composite([{ input: logo, gravity: 'center' }]).png().toFile(`assets/${n}`)
}
run(`npx @capacitor/assets@3 generate --android ${existsSync('ios') ? '--ios' : ''} ` +
  `--iconBackgroundColor "${bg}" --iconBackgroundColorDark "${bg}" ` +
  `--splashBackgroundColor "${bg}" --splashBackgroundColorDark "${bg}"`)

// Android: location and camera permissions for the field log
const manifest = 'android/app/src/main/AndroidManifest.xml'
let m = readFileSync(manifest, 'utf8')
const perms = [
  '<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />',
  '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />',
  '<uses-permission android:name="android.permission.CAMERA" />',
  '<uses-feature android:name="android.hardware.location.gps" android:required="false" />',
  '<uses-feature android:name="android.hardware.camera" android:required="false" />',
]
const missing = perms.filter(p => !m.includes(p))
if (missing.length) {
  m = m.replace('</manifest>', missing.map(p => `    ${p}\n`).join('') + '</manifest>')
  writeFileSync(manifest, m)
  console.log('Added Android permissions.')
}

// iOS: permission messages shown to the user, and export compliance
const plist = 'ios/App/App/Info.plist'
if (existsSync(plist)) {
  let p = readFileSync(plist, 'utf8')
  const keys = {
    NSLocationWhenInUseUsageDescription: '<string>GOCOS records the position of a water sampling station when you tap Use phone GPS.</string>',
    NSCameraUsageDescription: '<string>GOCOS lets SSI crew attach photos to a sampling station record.</string>',
    NSPhotoLibraryUsageDescription: '<string>GOCOS lets SSI crew attach existing photos to a sampling station record.</string>',
    ITSAppUsesNonExemptEncryption: '<false/>',
  }
  const add = Object.entries(keys).filter(([k]) => !p.includes(`<key>${k}</key>`))
    .map(([k, v]) => `\t<key>${k}</key>\n\t${v}\n`).join('')
  if (add) {
    const i = p.lastIndexOf('</dict>')
    p = p.slice(0, i) + add + p.slice(i)
    writeFileSync(plist, p)
    console.log('Added iOS permission messages.')
  }
}

run('npx cap sync')
console.log('\nNative projects ready. Next: npm run cap:android  or  npm run cap:ios')
