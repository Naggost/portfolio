import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://naggost-portfolio.vercel.app";
const PAGE_TITLE = "Portfolio - Nicolás Agostini";
const OG_TITLE = "Portfolio · Nicolás Agostini";
const DESCRIPTION =
  "Soy Nicolás Agostini, desarrollador de software. En mi portfolio reúno los proyectos que construí y es desde donde podés ver cómo trabajo y contactarme para crear tu próxima web.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: PAGE_TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: OG_TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Portfolio · Nicolás Agostini",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
