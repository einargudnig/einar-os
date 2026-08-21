This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Contact form

The "Work with me" section on the home page posts to `app/api/contact/route.ts`,
which relays the message over the [Resend](https://resend.com) API.

Copy `.env.example` to `.env.local` (and set the same vars in Vercel):

- `RESEND_API_KEY` — required, from https://resend.com/api-keys
- `CONTACT_TO_EMAIL` — optional, defaults to `einargudnig@gmail.com`
- `CONTACT_FROM_EMAIL` — optional, defaults to `onboarding@resend.dev`

Resend's default sender only delivers to the address that owns the Resend
account, which is enough to receive enquiries. Verify a domain and point
`CONTACT_FROM_EMAIL` at it (e.g. `hello@einargudni.com`) for proper
deliverability. Without `RESEND_API_KEY` the form stays visible but replies
with a message pointing people at the mailto link.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
