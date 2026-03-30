import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://serenitywellness.com.au"),
  title: {
    default: "Serenity Wellness Spa | Melbourne's Premier Sanctuary",
    template: "%s | Serenity Wellness Spa",
  },
  description:
    "Experience Melbourne's most serene wellness sanctuary. Swedish massage, deep tissue, hot stone, aromatherapy, and more. Book your healing journey today.",
  keywords: [
    "massage Melbourne",
    "wellness spa Melbourne",
    "Swedish massage South Yarra",
    "deep tissue massage Melbourne",
    "aromatherapy spa",
    "hot stone massage",
    "couples massage Melbourne",
    "prenatal massage",
    "relaxation spa",
  ],
  authors: [{ name: "Serenity Wellness Spa" }],
  creator: "Serenity Wellness Spa",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://serenitywellness.com.au",
    siteName: "Serenity Wellness Spa",
    title: "Serenity Wellness Spa | Melbourne's Premier Sanctuary",
    description:
      "Step away from the noise. Experience transformative healing in the heart of Melbourne.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Serenity Wellness Spa Melbourne",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Serenity Wellness Spa Melbourne",
    description: "Melbourne's premier wellness sanctuary. Book your healing journey.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification-token",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  name: "Serenity Wellness Spa",
  image: "https://serenitywellness.com.au/og-image.jpg",
  description: "Melbourne's premier wellness sanctuary offering massage and holistic treatments.",
  url: "https://serenitywellness.com.au",
  telephone: "+61398765432",
  email: "hello@serenityspa.com.au",
  address: {
    "@type": "PostalAddress",
    streetAddress: "42 Chapel Street",
    addressLocality: "South Yarra",
    addressRegion: "VIC",
    postalCode: "3141",
    addressCountry: "AU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -37.8393,
    longitude: 144.9908,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "08:00",
      closes: "19:00",
    },
  ],
  priceRange: "$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "399",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Manrope:wght@300;400;500;600;700&family=Satisfy&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
