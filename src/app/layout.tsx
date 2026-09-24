import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import { siteDetails } from '@/data/siteDetails';
import { inter } from '@/lib/fonts';

import "./globals.css";

const siteUrl = siteDetails.siteUrl;
const favicon = '/favicon.png';
const ogImage = '/images/hero-chart.webp';
const googleAnalyticsId = siteDetails.googleAnalyticsId;
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteDetails.siteName,
  url: siteUrl,
  logo: new URL(siteDetails.siteLogo, siteUrl).toString(),
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@gptchartview.com",
    contactType: "customer support",
  },
};
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteDetails.siteName,
  url: siteUrl,
  description: siteDetails.metadata.description,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteDetails.metadata.title,
  description: siteDetails.metadata.description,
  alternates: { canonical: siteUrl },
  icons: {
    icon: [{ url: favicon, type: "image/png" }],
    shortcut: [favicon],
    apple: [{ url: favicon, type: "image/png" }],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
  openGraph: {
    title: siteDetails.metadata.title,
    description: siteDetails.metadata.description,
    url: siteUrl,
    type: 'website',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 675,
        alt: siteDetails.siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteDetails.metadata.title,
    description: siteDetails.metadata.description,
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {googleAnalyticsId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${googleAnalyticsId}');
`,
              }}
            />
          </>
        )}
      </head>
      <body
        className="font-sans antialiased"
      >
        <Analytics />
        {[organizationSchema, websiteSchema].map((schema, index) => (
          <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}
        {children}
      </body>
    </html>
  );
}
