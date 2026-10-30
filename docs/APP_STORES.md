# GOCOS in the App Store and Google Play

GOCOS ships as native iPhone and Android apps using Capacitor. The native `ios/` and `android/` projects are generated
on the build computer (step 4) and wrap the same React code that runs at gocos-app.vercel.app, plus native GPS and camera access for the field tools.

- App ID (both stores): `org.sustainableseasinstitute.gocos`
- App name: GOCOS
- Privacy policy URL: https://gocos-app.vercel.app/privacy
- Support / marketing URL: https://sustainableseasinstitute.org

## 1. Before either store: get SSI's D-U-N-S number

Both Apple and Google require a D-U-N-S number to enroll an organization.

1. Look up or request SSI's number with Apple's free D-U-N-S lookup tool (linked from Apple's organization enrollment
   page). Use SSI's exact legal name and address as they appear on the IRS determination letter.
2. A new number can take several business days to issue, and Apple may take extra time to receive it.

Also have ready: the IRS determination letter (Apple may ask for proof of nonprofit status), an Apple Account with
two-factor authentication for the person signing (must have legal authority to bind SSI), and a work email on the
SSI domain if possible.

## 2. Apple Developer Program with the nonprofit fee waiver

Eligibility (Apple's fee waiver page): a legal entity with nonprofit status recognized by the IRS, not an individual or
sole proprietor, that does not sell digital goods. GOCOS is free with no in-app purchases, so it qualifies.

1. Go to developer.apple.com/programs/enroll and enroll as an **Organization** (not Individual).
2. When enrollment asks for payment, choose the **fee waiver request** option instead of paying.
   (If SSI is ever enrolled and paid already, the Account Holder can request a waiver later at
   developer.apple.com/contact/membership-fee-waiver/.)
3. Apple reviews the request and may ask for documentation, such as the IRS determination letter.
4. Do **not** sign the Paid Applications Agreement in App Store Connect. Signing it ends the waiver.
5. Renew each year by confirming eligibility (renewal opens 30 days before expiration).

Note: keep donation links out of the iPhone app. Apple restricts how apps collect donations, and the waiver
requires not selling digital goods. Donations stay on the SSI website.

## 3. Google Play Console

There is no nonprofit fee waiver; the one-time registration fee is 25 USD.

1. Create the account at play.google.com/console as an **Organization** account using SSI's D-U-N-S number.
2. Complete Google's organization and identity verification.
3. New *personal* accounts must run a 14-day closed test with 12 testers before going public. Organization accounts
   are not subject to that rule under Google's current policy; confirm on the sign-up screen.

## 4. One-time setup on the build computer

- iPhone builds need a **Mac with Xcode** (current version). Android builds need **Android Studio**.
- Clone this repo, then create a file named `.env` in the top folder with the same values Vercel uses:

  ```
  VITE_SUPABASE_URL=...
  VITE_SUPABASE_ANON_KEY=...
  ```

- Run `npm install`, then `npm run native:setup`. This creates the `android/` project (and `ios/` on a Mac), adds the
  app icons and splash screens from `assets/`, and adds the location and camera permissions. Run it once per computer.

## 5. Build and upload

### Android
1. `npm run cap:android` (builds the web app, copies it in, opens Android Studio).
2. In Android Studio: Build > Generate Signed App Bundle > Android App Bundle. Create an upload key the first time and
   store the keystore file and passwords somewhere safe (SSI password manager). Enroll in Play App Signing.
3. In Play Console, create the app, upload the `.aab` to an internal test track first, then production.

### iPhone
1. `npm run cap:ios` (builds, copies, opens Xcode).
2. In Xcode: select the App target > Signing & Capabilities > choose SSI's team. Bump Version/Build for each upload.
3. Product > Archive > Distribute App > App Store Connect. Test with TestFlight, then submit for review.

For every later release: change `versionCode`/`versionName` in `android/app/build.gradle` and Version/Build in Xcode,
then repeat the steps.

## 6. Store listing checklist

| Item | What to enter |
|---|---|
| Category | Education (secondary: Science / Reference) |
| Price | Free, no in-app purchases, no ads |
| Privacy policy | https://gocos-app.vercel.app/privacy |
| Screenshots | iPhone 6.9" and 6.5", iPad if offered, Android phone: Dashboard, Map, Data, Field log |
| Apple privacy labels / Google data safety | Email address (crew sign-in, linked to user), Precise location (only when crew taps Use phone GPS, linked to user), Photos (crew station photos). No tracking, no data sold, data encrypted in transit. |
| Content rating | Everyone / 4+ |
| Review notes (Apple) | The Field log is for SSI research crew. Provide a demo crew account with a password (create it in Supabase: Authentication > Users > Add user, with a password) and say all other features need no login. |

The native GPS, camera and offline field logging matter for review: Apple rejects apps that are only a website
in a wrapper (guideline 4.2), and these features are the answer to that.

## 7. Field tools database setup (once)

1. Supabase dashboard > SQL Editor > run `supabase/migrations/001_field_samples.sql`.
2. Authentication > Sign In / Providers: turn **off** "Allow new users to sign up" so only invited crew can sign in.
3. Authentication > Email Templates > Magic Link: include `{{ .Token }}` in the email so crew receive a 6-digit code
   (the app signs in with the code, which works inside the native app).
4. Authentication > Users > Invite user for each crew member.
