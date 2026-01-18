import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
// ClientAnalytics disabled during build - enable after fixing Next.js 16 bug
// import { ClientAnalytics } from "@/components/ClientAnalytics";

// Force dynamic rendering for all pages
export const dynamic = 'force-dynamic';

// Display font for headings
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Body font for paragraphs
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1a1a",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://matrixcbs.com"),
  title: {
    default: "MATRIX CBS Kft. | Felnőttképzési Intézmény",
    template: "%s | MATRIX CBS Kft.",
  },
  description:
    "A MATRIX CBS Kft. felnőttképzési intézmény Szegeden. Cégtréningek, készségfejlesztés, vezetői képzések és szervezetfejlesztés.",
  keywords: [
    "felnőttképzés",
    "cégtréning",
    "vezetői képzés",
    "szervezetfejlesztés",
    "készségfejlesztés",
    "Szeged",
    "MATRIX CBS",
    "tréning",
    "coaching",
  ],
  authors: [{ name: "MATRIX CBS Kft." }],
  creator: "MATRIX CBS Kft.",
  publisher: "MATRIX CBS Kft.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "hu_HU",
    url: "https://matrixcbs.com",
    siteName: "MATRIX CBS Kft.",
    title: "MATRIX CBS Kft. | Felnőttképzési Intézmény",
    description:
      "A MATRIX CBS Kft. felnőttképzési intézmény Szegeden. Cégtréningek, készségfejlesztés, vezetői képzések és szervezetfejlesztés.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MATRIX CBS Kft. - Felnőttképzési Intézmény",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MATRIX CBS Kft. | Felnőttképzési Intézmény",
    description:
      "A MATRIX CBS Kft. felnőttképzési intézmény Szegeden. Cégtréningek, készségfejlesztés, vezetői képzések és szervezetfejlesztés.",
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon/apple-icon-57x57.png", sizes: "57x57" },
      { url: "/favicon/apple-icon-60x60.png", sizes: "60x60" },
      { url: "/favicon/apple-icon-72x72.png", sizes: "72x72" },
      { url: "/favicon/apple-icon-76x76.png", sizes: "76x76" },
      { url: "/favicon/apple-icon-114x114.png", sizes: "114x114" },
      { url: "/favicon/apple-icon-120x120.png", sizes: "120x120" },
      { url: "/favicon/apple-icon-144x144.png", sizes: "144x144" },
      { url: "/favicon/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/favicon/apple-icon-180x180.png", sizes: "180x180" },
    ],
    other: [
      { rel: "manifest", url: "/favicon/manifest.json" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MATRIX CBS",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${outfit.variable} ${plusJakarta.variable} antialiased bg-[var(--color-bg-dark)] text-[var(--color-text-primary)] matrix-grid grain-overlay`}
      >
        {/* <ClientAnalytics /> */}
        {children}
      </body>
    </html>
  );
}
