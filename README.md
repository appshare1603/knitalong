This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Kennwort-Wiederherstellung

Die Kennwort-Wiederherstellung führt auch bei einer lokalen Anfrage zur Vercel-App unter `https://knitalong.vercel.app/kennwort-zuruecksetzen`. Diese vollständige Adresse muss im Supabase-Dashboard unter **Authentication → URL Configuration → Redirect URLs** erlaubt sein. Setze dort außerdem die **Site URL** auf `https://knitalong.vercel.app` und richte den E-Mail-Versand ein. Die Supabase-E-Mail-Vorlage für die Kennwort-Wiederherstellung muss den Bestätigungslink (`{{ .ConfirmationURL }}`) enthalten. Nach Änderungen muss ein neuer Link angefordert werden; bereits versendete Links behalten ihre bisherige Rücksprungadresse.

Der Link führt zu einem Formular für ein neues Kennwort; das bisherige Kennwort bleibt bis zur erfolgreichen Änderung gültig. Supabase verschickt und prüft den zeitlich begrenzten Link. Keine Kennwörter werden per E-Mail verschickt. Wird der Link in einem Browser mit bestehender Sitzung geöffnet, zeigt das Formular ausdrücklich an, für welches Konto das Kennwort geändert wird.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
