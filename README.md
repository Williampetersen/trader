[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnexi-launch%2Ffinwise-landing-page)

# Finwise - Next.js + Tailwind Landing Page Template

Finwise is a lightweight, easily configurable, and customizable **Next.js** and **Tailwind CSS** landing page template. It’s built to be adaptable, performant, and perfect for any product launch, portfolio, or promotional site.

Try out the demo here: [https://finwise-omega.vercel.app](https://finwise-omega.vercel.app).

Please check out the documentation below to get started.

---

## Features

- **Next.js** app router with **TypeScript**
- **Tailwind CSS** v3 for flexible styling customization
- Smooth transitions powered by **Framer Motion**
- Built-in **font optimization** with [next/font](https://nextjs.org/docs/app/api-reference/components/font)
- Automatic **image optimization** via [next/image](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- Access to **31+ icon packs** via [React Icons](https://react-icons.github.io/react-icons/)
- Near-perfect **Lighthouse score**
- Modular, responsive, and **scalable components**
- **Free lifetime updates**

---

## Sections

- Hero
- Partners or Clients Logos
- Features
- Pricing
- Testimonials
- FAQ
- Statistics
- CTA
- Footer

---

## Getting Started

### Prerequisites

Before starting, make sure you have the following installed:

- **Node.js**: Version 18 or later
- **npm**: Version 8 or later (bundled with Node.js)
- **Code editor**: [VS Code](https://code.visualstudio.com/) is recommended.

### Steps

1. **Install dependencies**: Run `npm install`
2. **Run the development server**: `npm run dev`
3. **View your project**: Open [localhost:3000](http://localhost:3000)

---

## Real Gemini Chart Analysis

Chart uploads require a Gemini API key on the server. Without it, `/api/analyses` returns a clear error and does not save a placeholder analysis or spend a user credit. Gemini also rejects uploads that are not readable candlestick chart images.

Required environment variables:

```env
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
```

Set these in `.env.local` for local development and in your Vercel project environment variables for production, then restart/redeploy the app.

---

## Stripe Checkout

Paid dashboard upgrades use Stripe Checkout.

Required environment variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_CURRENCY=usd
STRIPE_PRICE_BASIC_ACCESS=price_xxx
STRIPE_PRICE_PRO_TRADER=price_xxx
STRIPE_PRICE_ADVANCED_TRADERS=price_xxx
```

The `STRIPE_PRICE_*` values should point to recurring Stripe prices:

- Basic Access: $19 USD per week
- Pro Trader: $49 USD per month
- Advanced Traders: $99 USD per month

Local webhook testing:

```bash
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

Copy the `whsec_...` value from the Stripe CLI output into `STRIPE_WEBHOOK_SECRET`, then restart the dev server. Paid plans are activated only after Stripe confirms payment through the webhook or the verified success page.

---

## Owner Dashboard

The private owner dashboard is separate from the user dashboard:

- Owner login: `/owner/login`
- Owner command center: `/owner`
- Users: `/owner/users`
- Revenue: `/owner/revenue`
- Activity: `/owner/activity`
- Support: `/owner/support`

Required environment variables:

```env
OWNER_EMAIL=owner@gptchartview.local
OWNER_PASSWORD=change-this-password
```

The owner dashboard shows real stored users, online users, active sessions, country data, plans, credits, payments, revenue, MRR estimate, uploads, AI activity, and support tickets. Online users are counted from account activity within the last 15 minutes.

---

## Customization

1. **Edit colors**: Update `globals.css` for primary, secondary, background, and accent colors.
2. **Update site details**: Customize `siteDetails.ts` in `/src/data` to reflect your brand and site info.
3. **Modify content**: Files in `/src/data` handle data for navigation, features, pricing, testimonials, and more.
4. **Replace favicon**: Add your icon to `/src/app/favicon.ico`.
5. **Add images**: Update `public/images` for Open Graph metadata (e.g., `og-image.jpg`, `twitter-image.jpg`).

---

## Deploying on Vercel

The fastest way to deploy Finwise is on [Vercel](https://vercel.com/). Simply click the "Deploy with Vercel" button at the top of this README, or check the [Next.js deployment docs](https://vercel.com/docs/deployments/deployment-methods) for other deployment options.

---

## Contributing

Finwise is an open-source project, and we welcome contributions from the community! If you have ideas for new components, designs, layouts, or optimizations, please join us in making Finwise even better.

### How to Contribute

1. **Fork the Repository**: Clone it locally.
2. **Create a New Branch**: For example, `feature/new-section` or `fix/style-issue`.
3. **Develop and Test**: Make sure your changes work and don't break existing functionality.
4. **Submit a Pull Request**: Open a pull request with a clear description of your changes, and we'll review it.

### Ideas for Contributions

- New component sections (team introductions, comparison table, case studies, etc.)
- Additional page variants (e.g., agency, eCommerce, portfolio layouts)
- Additional themes
- Documentation updates, tutorials, or guides

---

## Community and Support

Join our community discussions on GitHub to share ideas, ask questions, or suggest improvements. Let’s build something amazing together!


--- 

## License

This project is open-source and available under the MIT License. Feel free to use, modify, and distribute it for personal or commercial projects.
