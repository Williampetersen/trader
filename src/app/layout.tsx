import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Source_Sans_3, Manrope } from "next/font/google";

import { siteDetails } from '@/data/siteDetails';

import "./globals.css";

const manrope = Manrope({ subsets: ['latin'] });
const sourceSans = Source_Sans_3({ subsets: ['latin'] });
const siteUrl = siteDetails.siteUrl;
const favicon = '/favicon.png';
const ogImage = '/images/hero-chart.webp';
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
    <html lang="en">
      <body
        className={`${manrope.className} ${sourceSans.className} antialiased`}
      >
        {siteDetails.googleAnalyticsId && <GoogleAnalytics gaId={siteDetails.googleAnalyticsId} />}
        <Analytics />
        {[organizationSchema, websiteSchema].map((schema, index) => (
          <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}
        {children}
      </body>
    </html>
  );
}
